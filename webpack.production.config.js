const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ZopfliPlugin = require('zopfli-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')

const test = /\.(js|css|html|png|gif)$/
const threshold = 10240
const minRatio = 0.8

delete webpackConfig.devtool
webpackConfig.entry = {
  app: webpackConfig.entry[webpackConfig.entry.length - 1]
}
webpackConfig.output.filename = '[name].[chunkhash].js'
webpackConfig.output.chunkFilename = '[name].[chunkhash].js'
webpackConfig.plugins = [
  webpackConfig.plugins[0],
  new CleanWebpackPlugin(['dist']),
  webpackConfig.plugins[webpackConfig.plugins.length - 1],
  new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    allChunks: true,
    ignoreOrder: true
  }),
  new webpack.HashedModuleIdsPlugin(),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function(module) {
      return module.context && module.context.indexOf('node_modules') !== -1
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
  new OptimizeCssAssetsPlugin(),
  new webpack.optimize.UglifyJsPlugin(),
  new ZopfliPlugin({
    asset: '[path].gz[query]',
    algorithm: 'zopfli',
    test,
    threshold,
    minRatio
  }),
  new BrotliPlugin({
    asset: '[path].br[query]',
    test,
    threshold,
    minRatio
  })
]
const use =
  webpackConfig.module.rules[webpackConfig.module.rules.length - 1].use
webpackConfig.module.rules[
  webpackConfig.module.rules.length - 1
].use = ExtractTextPlugin.extract({
  fallback: use.shift(),
  use: use
})

module.exports = webpackConfig
