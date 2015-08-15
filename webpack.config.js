var path = require('path');

var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var NODEMODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');
var REACT_PATH = path.resolve(NODEMODULES_PATH, 'react/dist/react.min.js');

var webpack = require('webpack');
var merge = require('webpack-merge');

var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var common = {
  entry: [path.resolve(APP_PATH, 'main')],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)?$/,
      loaders: ['babel?stage=0'],
      include: APP_PATH
    }]
  },
  plugins: [new HtmlWebpackPlugin()] // Generates index.hml in 'output' path
};

if (TARGET === 'development') {
  module.exports = merge(common, {
    resolve: {
      alias: {
        'react': REACT_PATH
      }
    },
    module: {
      loaders: [{
        test: /\.css$/, // Only .css files
        loader: 'style!css', // Run both loaders
        include: APP_PATH
      }],
      noParse: [REACT_PATH]
    },
    devtool: 'eval',
    devServer: {
      colors: true,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if (TARGET === 'production') {
  module.exports = merge(common, {
    module: {
      loaders: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        include: APP_PATH
      }]
    },
    plugins: [
      new ExtractTextPlugin('styles.css')
    ]
  });
}
