const webpack = require('webpack')
const webpackConfig = require('./webpack.production.config')

const compiler = webpack(webpackConfig)

compiler.run((error, stats) => {
  if (error) {
    console.error('Build failed!') // eslint-disable-line no-console
    console.log(stats.toJson()) // eslint-disable-line no-console
    return
  }

  console.info('Build succeeded!') // eslint-disable-line no-console
})
