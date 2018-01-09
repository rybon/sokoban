const webpack = require('webpack')
const webpackConfig = require('../configs/webpack.production.config')

const compiler = webpack(webpackConfig)

compiler.run((error, stats) => {
  if (error) {
    console.error('Build failed!')
    console.log(stats.toJson())
    return
  }

  console.info('Build succeeded!')
})
