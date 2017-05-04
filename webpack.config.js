const path = require('path');
const webpack = require('webpack');
const postcssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const postcssUrl = require('postcss-url');
// User config
const argv = require('minimist')(process.argv.slice(2));

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-dev-server/client?http://localhost',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './src/index'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.(json)$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loader: 'style?singleton!css?sourceMap&camelCase&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss'
            }
        ]
    },
    postcss(webpack) {
        return [
            postcssImport({ addDependencyTo: webpack, path: path.resolve(__dirname, 'src') }),
            cssnext({ browsers: ['Safari >= 8'] }),
            postcssUrl({ url: 'inline', maxSize: 300, basePath: path.resolve(__dirname, 'src') })
        ];
    },
    resolve: {
        root: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')
        ],
        extensions: ['', '.js', '.jsx', '.json', '.css']
    }
};
