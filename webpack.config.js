require('dotenv').config()

const path = require('path')

const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')

// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

// const smp = new SpeedMeasurePlugin()

module.exports = (_, argv) => {
  const devMode = argv.mode === 'development'

  const options = {
    entry: path.resolve('src', 'index.tsx'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './src/tsconfig.json'),
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'fast-sass-loader']
        },
        {
          test: /\.(ico|png|jpg|jpeg|json)?$/,
          loader: 'file-loader',
          options: {
            name: '[hash].[ext]'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        ignoreOrder: true
      }),
      new DefinePlugin({
        'process.env.API_SERVER': JSON.stringify(process.env.API_SERVER)
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public'
          }
        ]
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
      new HtmlWebpackPlugin({
        template: './src/views/index.html',
        filename: 'index.html'
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }

  options.mode = argv.mode

  if (devMode) {
    options.devtool = 'source-map'
    options.devServer = {
      compress: true,
      port: 8080,
      historyApiFallback: true
    }

    // return smp.wrap(options)
  }

  return options
}
