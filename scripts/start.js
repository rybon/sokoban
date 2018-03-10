const path = require('path')
// Package config
const { config } = require('../package')
// User config
const argv = require('minimist')(process.argv.slice(2))
const host = (argv && argv.host) || ''
const port = (argv && argv.port) || config.port || 80
const isProduction = process.env.NODE_ENV === 'production'
// Webpack
const webpack = require('webpack')
const webpackConfig = require('../configs/webpack.config')
const WebpackDevServer = require('webpack-dev-server')
// Hosting
const express = require('express')
const compression = require('compression')
const expressStaticGzip = require('express-static-gzip')
const fallback = require('express-history-api-fallback')
const { redirectToHTTPS } = require('express-http-to-https')
// API
const app = express()
const proxyPort = port + 1
// GraphQL
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { graphqlSchema } = require('./server/graphql')
// WS
if (!isProduction) {
  require('express-ws')(app) // eslint-disable-line global-require
}
// Handlers
const { recorderHandler, replayerHandler } = require('./server/handlers')

const publicPath = `${host || 'localhost'}:${port}`
const target = `http://${host || 'localhost'}:${proxyPort}`

const root = path.resolve(__dirname, '..', 'dist')

const listening = () => console.log(`Listening at http://${publicPath}`)

app.disable('x-powered-by')
const csp =
  "block-all-mixed-content; frame-ancestors 'none'; base-uri 'self'; require-sri-for script style; form-action 'self'; default-src 'none'; style-src 'self'; img-src 'self' data:; font-src 'self' data:; script-src 'self'; worker-src 'self'; connect-src 'self'; manifest-src 'self'; media-src 'none'; child-src 'none'; frame-src 'none'; object-src 'none'"
const cspStyleguide =
  "block-all-mixed-content; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; script-src 'self'; worker-src 'self'; connect-src 'self'; manifest-src 'self'; media-src 'none'; child-src 'none'; frame-src 'none'; object-src 'none'"
const cspGraphiql =
  "block-all-mixed-content; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; default-src 'none'; style-src 'self' 'unsafe-inline' unpkg.com cdn.jsdelivr.net; img-src 'self' data:; font-src 'self' data:; script-src 'self' 'unsafe-inline' unpkg.com cdn.jsdelivr.net; worker-src 'self'; connect-src 'self'; manifest-src 'self'; media-src 'none'; child-src 'none'; frame-src 'none'; object-src 'none'"
const styleguideRegExp = /styleguide/
const graphiqlRegExp = /graphiql/
app.use((req, res, next) => {
  let actualCsp = csp
  if (graphiqlRegExp.test(req.path)) {
    actualCsp = cspGraphiql
  } else if (styleguideRegExp.test(req.path)) {
    actualCsp = cspStyleguide
  }
  res.setHeader('Content-Security-Policy', actualCsp)
  res.setHeader('X-Content-Security-Policy', actualCsp)
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  return next()
})
app.use(redirectToHTTPS([/localhost:(\d{4})/]))
app.use(
  '/graphql',
  compression(), // or defer API compression to NGINX
  express.json(),
  graphqlExpress({ schema: graphqlSchema })
)
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

if (!isProduction) {
  app.ws('/recorder', recorderHandler)
  app.ws('/replayer', replayerHandler)

  // Fixes for HMR
  webpackConfig.output.publicPath = `http://${publicPath}/`
  webpackConfig.entry[0] = webpackConfig.entry[0].replace(
    'localhost',
    publicPath
  )

  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    },
    proxy: {
      '/graphql': {
        target
      },
      '/graphiql': {
        target
      },
      '/recorder': {
        target,
        ws: true
      },
      '/replayer': {
        target,
        ws: true
      }
    }
  }).listen(port, host, error => {
    if (error) {
      console.log(error)
      return
    }

    listening()
  })
} else {
  app.use('/', expressStaticGzip('dist', { enableBrotli: true })) // or defer hosting of compressed static assets to NGINX
  app.use(fallback('index.html', { root }))

  listening()
}

app.listen(isProduction ? port : proxyPort)
