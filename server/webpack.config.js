const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

/*
  This is a very basic webpack config for using react components server side.
*/

module.exports = {
  target: 'node',
  entry: ['./reactApp.jsx'],
  output: {
    filename: './server/reactApp.bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader' }
    ]
  }
};