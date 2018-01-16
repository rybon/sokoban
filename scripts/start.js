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
  webpackConfig.output.publicPath = `http://${host || 'localhost'}:${port}/`
  webpackConfig.entry[0] = webpackConfig.entry[0].replace(
    'localhost',
    `${host || 'localhost'}:${port}`
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
        target: `http://${host || 'localhost'}:${proxyPort}`
      },
      '/graphiql': {
        target: `http://${host || 'localhost'}:${proxyPort}`
      },
      '/recorder': {
        target: `http://${host || 'localhost'}:${proxyPort}`,
        ws: true
      },
      '/replayer': {
        target: `http://${host || 'localhost'}:${proxyPort}`,
        ws: true
      }
    }
  }).listen(port, host, error => {
    if (error) {
      console.log(error)
      return
    }

    console.log(`Listening at http://${host || 'localhost'}:${port}`)
  })
} else {
  app.use('/', expressStaticGzip('dist', { enableBrotli: true })) // or defer hosting of compressed static assets to NGINX
}

app.listen(isProduction ? port : proxyPort)
