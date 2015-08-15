var path = require('path');

var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var DIST_PATH = path.resolve(ROOT_PATH, 'dist');
var NODEMODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

var webpack = require('webpack');
var merge = require('webpack-merge');

var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var common = {
  entry: {
    bundle: path.resolve(APP_PATH, 'main'),
    vendors: ['react'] // And other vendors
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: DIST_PATH,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)?$/,
      loaders: ['babel?stage=0'],
      include: APP_PATH
    }]
  },
  plugins: [
    new HtmlWebpackPlugin(), // Generates index.hml in 'output' path
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js') // Generates a vendors.js for external libraries
  ]
};

var deps = [
  'react/dist/react.min.js'
];

if (TARGET === 'development') {
  var config = {
    resolve: {
      alias: {}
    },
    module: {
      loaders: [{
        test: /\.css$/, // Only .css files
        loader: 'style!css', // Run both loaders
        include: APP_PATH
      }],
      noParse: []
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
  }

  deps.forEach(function(dep) {
    var depPath = path.resolve(NODEMODULES_PATH, dep);
    config.resolve.alias[dep.split(path.sep)[0]] = depPath;
    config.module.noParse.push(depPath);
  });

  module.exports = merge(common, config);
}

if (TARGET === 'production') {
  var config = {
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
  }
  
  module.exports = merge(common, config);
}
