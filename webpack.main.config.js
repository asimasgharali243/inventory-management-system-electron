module.exports = {
  entry: './src/main/main.js',
  target: 'electron-main',
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};