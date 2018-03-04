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

app.use(redirectToHTTPS([/localhost:(\d{4})/]))
app.use(
  '/graphql',
  compression(), // or defer API compression to NGINX
  express.json(),
  graphqlExpress({ schema: graphqlSchema })
)

if (!isProduction) {
  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
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

    console.log(`Listening at http://${publicPath}`)
  })
} else {
  app.use('/', expressStaticGzip('dist', { enableBrotli: true })) // or defer hosting of compressed static assets to NGINX
}

app.listen(isProduction ? port : proxyPort)
