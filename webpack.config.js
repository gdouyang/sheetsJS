var path = require('path');

var libraryName = 'sheets';
var outputFile = libraryName + '.js';

var env = process.env.WEBPACK_ENV;

var outputFile, mode;

if (env === 'build') {
  outputFile = libraryName + '.min.js';
  mode = 'production';
} else {
  outputFile = libraryName + '.js';
  mode = 'development';
}

var config = {
  mode: mode,
  entry: __dirname + '/src/Sheet.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd'
  }
};

module.exports = config;
