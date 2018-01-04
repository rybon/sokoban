const webpack = require('webpack') // eslint-disable-line import/no-extraneous-dependencies
const webpackConfig = require('../configs/webpack.production.config')

const compiler = webpack(webpackConfig)

compiler.run((error, stats) => {
  if (error) {
    console.error('Build failed!') // eslint-disable-line no-console
    console.log(stats.toJson()) // eslint-disable-line no-console
    return
  }

  console.info('Build succeeded!') // eslint-disable-line no-console
})
