const path = require('path');
//main.js

module.exports = {
  entry: './public/src/main.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname + "/public", 'dist')
  }
}