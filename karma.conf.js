'use strict';

var path = require('path');
var webpack = require('webpack');
var RewirePlugin = require('rewire-webpack');

var webpackConfig = {
  devtool: 'inline-source-map',
  resolve: {
    root: [
      path.resolve('./src/js'),
      path.resolve('./src')
    ],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/},
    ],
    loaders: [
      {test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/}
    ]
  },
  stats: {
    colors: true,
  },
  plugins: [
    new RewirePlugin()
  ],
  eslint: {configFile: '.eslintrc'}
};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/babel-core/browser-polyfill.js',
      'test/**/*-spec.js'
    ],
    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    webpackMiddleware: {
      stats: {
        chunkModules: false,
        colors: true,
      },
    },
    reporters: ['nyan'],
    captureTimeout: 90000,
    browserNoActivityTimeout: 60000,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
  });
};
