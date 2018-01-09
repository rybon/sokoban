// Package config
const { config } = require('../package')
// User config
const argv = require('minimist')(process.argv.slice(2))
const host = (argv && argv.host) || ''
const port = (argv && argv.port) || config.port || 80
// Webpack
const webpack = require('webpack')
const webpackConfig = require('../configs/webpack.config')
const WebpackDevServer = require('webpack-dev-server')
// Proxy
const express = require('express')
const bodyParser = require('body-parser')
// API
const app = express()
app.use(bodyParser.json())
const proxyPort = port + 1
// GraphQL
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { graphqlSchema } = require('./server/graphql')
// WS
require('express-ws')(app)
// Handlers
const { recorderHandler, replayerHandler } = require('./server/handlers')

app.use('/graphql', graphqlExpress({ schema: graphqlSchema }))
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.ws('/recorder', recorderHandler)
app.ws('/replayer', replayerHandler)
app.listen(proxyPort)

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
