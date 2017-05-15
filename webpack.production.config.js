const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

delete webpackConfig.devtool;
webpackConfig.entry = webpackConfig.entry[webpackConfig.entry.length - 1];
webpackConfig.plugins = [
    webpackConfig.plugins[0],
    new ExtractTextPlugin({
        filename: 'styles.css',
        allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin()
];
const use = webpackConfig.module.rules[webpackConfig.module.rules.length - 1].use;
webpackConfig.module.rules[webpackConfig.module.rules.length - 1].use = ExtractTextPlugin.extract({
    fallback: use.shift(),
    use: use
});

module.exports = webpackConfig;
