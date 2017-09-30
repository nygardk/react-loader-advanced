const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      { pattern: 'test/**/*-spec.js', watched: false },
    ],

    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        modules: [
          path.resolve(__dirname, './src'),
          'node_modules',
        ],
        alias: {
          'prop-types': path.resolve(__dirname, './node_modules/prop-types'),
        },
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
    },

    reporters: ['progress'],
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
