const path = require('path');

module.exports = {
  devtool: process.env !== 'PRODUCTION' ? '#cheap-module-source-map' : false,
  entry: {
    demo0: [
      'babel-polyfill',
      './demos/demo0/index.js',
    ],
    demo1: [
      'babel-polyfill',
      './demos/demo1/index.js',
    ],
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      'node_modules',
    ],
    alias: {
      'react-loader-advanced': path.resolve(__dirname, './src/react-loader-advanced'),
    },
  },
  output: {
    filename: '[name]/bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
