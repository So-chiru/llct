const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const dev = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: {
    mikan: ['babel-polyfill', path.resolve('src', 'index.ts')]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        exclude: /(node_modules|_old_src|(sa|sc|c)ss|background)/,
        test: /\.js|\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['last 2 versions', 'safari >= 7']
                  }
                }
              ],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        exclude: /\.js|\.ts|\.woff2/,
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(ico|png|jpg|jpeg)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[hash].[ext]'
          }
        }
      },
      {
        test: /\.json?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
          options: {
            globals: {
              dev
            }
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'mikan.css'
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/data/images',
          to: 'assets/'
        },
        {
          from: 'src/data/sounds',
          to: 'assets/'
        },
        {
          from: 'src/data/fonts',
          to: 'assets/'
        },
        {
          from: 'src/root',
          to: './'
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/views/index.pug',
      filename: 'index.html',
      inject: false
    }),
    new webpack.DefinePlugin({
      PRODUCTION: !dev
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true
      })
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
    modules: ['node_modules'],
    alias: { vue: 'vue/dist/vue.common.' + (!dev ? 'prod' : 'dev') + '.js' }
  }
}
