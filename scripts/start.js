// Package config
const { config } = require('../package')
// User config
const argv = require('minimist')(process.argv.slice(2)) // eslint-disable-line
const host = (argv && argv.host) || ''
const port = (argv && argv.port) || config.port || 80
// Webpack
const webpack = require('webpack') // eslint-disable-line import/no-extraneous-dependencies
const webpackConfig = require('../configs/webpack.config')
const WebpackDevServer = require('webpack-dev-server') // eslint-disable-line import/no-extraneous-dependencies
// Proxy
const express = require('express') // eslint-disable-line import/no-extraneous-dependencies
const bodyParser = require('body-parser') // eslint-disable-line import/no-extraneous-dependencies
// API
const app = express()
app.use(bodyParser.json())
const proxyPort = port + 1
// GraphQL
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express') // eslint-disable-line import/no-extraneous-dependencies
const { graphqlSchema } = require('./server/graphql')
// WS
require('express-ws')(app) // eslint-disable-line import/no-extraneous-dependencies
// Handlers
const {
  getLevelByIdHandler,
  getScoresHandler,
  postScoresHandler,
  recorderHandler,
  replayerHandler,
  proxyHandler
} = require('./server/handlers')

app.get('/api/levels/:id', getLevelByIdHandler)
app.get('/api/scores', getScoresHandler)
app.post('/api/scores', postScoresHandler)
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
    '/api/*': {
      target: `http://${host || 'localhost'}:${proxyPort}`,
      bypass: proxyHandler
    },
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
    console.log(error) // eslint-disable-line no-console
    return
  }

  console.log(`Listening at http://${host || 'localhost'}:${port}`) // eslint-disable-line no-console
})
