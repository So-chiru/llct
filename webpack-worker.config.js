require('dotenv').config()

const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')

// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

// const smp = new SpeedMeasurePlugin()

module.exports = (_, argv) => {
  const devMode = argv.mode === 'development'

  const options = {
    entry: { 'service-worker': path.resolve('worker_src', 'worker.ts') },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@worker': path.resolve(__dirname, 'worker_src')
      }
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name]-chunk.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './worker_src/tsconfig.json'),
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        'process.env.API_SERVER': JSON.stringify(process.env.API_SERVER)
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
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 18080,
      writeToDisk: true,
      historyApiFallback: true
    }

    // return smp.wrap(options)
  }

  return options
}
