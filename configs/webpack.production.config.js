const path = require('path')
const webpack = require('webpack') // eslint-disable-line import/no-extraneous-dependencies
const webpackConfig = require('./webpack.config')
const CleanWebpackPlugin = require('clean-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies
const SriPlugin = require('webpack-subresource-integrity') // eslint-disable-line import/no-extraneous-dependencies
const ExtractTextPlugin = require('extract-text-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies
const ZopfliPlugin = require('zopfli-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies
const BrotliPlugin = require('brotli-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies
const WebpackPwaManifest = require('webpack-pwa-manifest') // eslint-disable-line import/no-extraneous-dependencies
const { name, description } = require('../package')

const isProduction = process.env.NODE_ENV === 'production'

const root = path.resolve(__dirname, '..')
const favicon = path.resolve(__dirname, '..', 'src', 'assets', 'favicon.png')

const title = name
  .split('')
  .map((character, index) => {
    if (index === 0) {
      return character.toUpperCase()
    }
    return character
  })
  .join('')

const PUBLIC_PATH = '/' // process.env.PUBLIC_PATH || '/'
const THEME_COLOR = '#000000'

const test = /\.(js|css|html|png|gif)$/
const threshold = 10240
const minRatio = 0.8

delete webpackConfig.devtool
webpackConfig.entry = {
  app: webpackConfig.entry[webpackConfig.entry.length - 1]
}
webpackConfig.output.filename = '[name].[chunkhash].js'
webpackConfig.output.chunkFilename = '[name].[chunkhash].js'
webpackConfig.output.publicPath = PUBLIC_PATH
webpackConfig.output.crossOriginLoading = 'anonymous'
webpackConfig.plugins = [
  webpackConfig.plugins[0],
  new CleanWebpackPlugin(['dist'], { root }),
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
    minChunks(module) {
      return module.context && module.context.indexOf('node_modules') !== -1
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
  new OptimizeCssAssetsPlugin(),
  new webpack.optimize.UglifyJsPlugin(),
  new SriPlugin({
    hashFuncNames: ['sha256', 'sha384', 'sha512'],
    enabled: isProduction
  }),
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
  }),
  new SWPrecacheWebpackPlugin({
    cacheId: name,
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    minify: true,
    navigateFallback: `${PUBLIC_PATH}index.html`,
    navigateFallbackWhitelist: [/^\/levels\//, /^\/help/, /^\/high-scores/],
    staticFileGlobsIgnorePatterns: [
      /\.map$/,
      /manifest\.json$/,
      /speedrun/,
      /styleguide/,
      /\.gz$/,
      /\.br$/
    ]
  }),
  new WebpackPwaManifest({
    name: title,
    short_name: title,
    description,
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    'theme-color': THEME_COLOR,
    start_url: PUBLIC_PATH,
    icons: [
      {
        src: favicon,
        sizes: [96, 128, 192, 256, 384, 512],
        destination: PUBLIC_PATH
      }
    ]
  })
]
const { use } = webpackConfig.module.rules[
  webpackConfig.module.rules.length - 1
]
webpackConfig.module.rules[
  webpackConfig.module.rules.length - 1
].use = ExtractTextPlugin.extract({
  fallback: use.shift(),
  use
})

module.exports = webpackConfig
