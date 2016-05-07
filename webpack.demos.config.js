var webpack = require('webpack');
var path = require('path');

var ENV = process.env.NODE_ENV;

module.exports = {
  entry: {
    demo0: ['babel-polyfill', './demos/demo0/index.jsx'],
    demo1: ['babel-polyfill', './demos/demo1/index.jsx']
  },
  contentBase: './demos',
  output: {
    filename: '[name]/bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'demos')
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /node_modules|lib/
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ENV === 'development'
          ? ['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-2']
          : ['babel?presets[]=react,presets[]=es2015,presets[]=stage-2'],
        exclude: /node_modules|lib/
      }
    ]
  },
  resolve: {
    root: [path.resolve('./src')],
    extensions: ['', '.js', '.jsx']
  },
  plugins: ENV === 'development'
    ? [new webpack.HotModuleReplacementPlugin()]
    : [],
  eslint: {configFile: '.eslintrc'}
};
