const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

delete webpackConfig.devtool
webpackConfig.entry = webpackConfig.entry[webpackConfig.entry.length - 1]
webpackConfig.plugins = [
  webpackConfig.plugins[0],
  new ExtractTextPlugin({
    filename: 'styles.css',
    allChunks: true
  }),
  new OptimizeCssAssetsPlugin(),
  new webpack.optimize.UglifyJsPlugin(),
  webpackConfig.plugins[webpackConfig.plugins.length - 1],
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js|css|html)$/,
    threshold: 10240,
    minRatio: 0.8
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
