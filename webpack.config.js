const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html']
          },
          noErrorOnMissing: true
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost',
        REACT_APP_ACCESSELF_API_KEY: process.env.REACT_APP_ACCESSELF_API_KEY
      })
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: './'
  }
};
