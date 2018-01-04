const path = require('path')
const webpack = require('webpack')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcssImport = require('postcss-import')
const postcssCssnext = require('postcss-cssnext')
const postcssUrl = require('postcss-url')
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './src/index'
  ],
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new NpmInstallPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: 'Sokoban',
      favicon: 'src/assets/favicon.png',
      filename: 'index.html',
      minify: isProduction ? { collapseWhitespace: true } : false
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, '..', 'src')
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
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
              sourceMap: true,
              plugins: () => [
                postcssImport({ path: path.resolve(__dirname, '..', 'src') }),
                postcssCssnext(),
                postcssUrl({
                  url: 'inline',
                  maxSize: 300,
                  basePath: path.resolve(__dirname, '..', 'src')
                }),
                postcssFlexbugsFixes()
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules')
    ],
    extensions: ['.js', '.jsx', '.json', '.css', '.png', '.gif']
  }
}
