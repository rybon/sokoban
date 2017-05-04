const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

delete webpackConfig.devtool;
webpackConfig.entry = webpackConfig.entry[webpackConfig.entry.length - 1];
webpackConfig.plugins = [
    webpackConfig.plugins[0],
    new ExtractTextPlugin('styles.css', { allChunks: true }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
];
webpackConfig.module.loaders[webpackConfig.module.loaders.length - 1].loader = ExtractTextPlugin.extract('style-loader', 'css-loader?camelCase&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader');

module.exports = webpackConfig;
