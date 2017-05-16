const path = require('path')
const webpack = require('webpack')
const postcssImport = require('postcss-import')
const postcssCssnext = require('postcss-cssnext')
const postcssUrl = require('postcss-url')

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
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              camelCase: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                postcssImport({ path: path.resolve(__dirname, 'src') }),
                postcssCssnext({ browsers: ['Safari >= 8'] }),
                postcssUrl({
                  url: 'inline',
                  maxSize: 300,
                  basePath: path.resolve(__dirname, 'src')
                })
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['.js', '.jsx', '.json', '.css']
  }
}
