module.exports = {
  entry: './src/main/main.js',
  target: 'electron-main',
  plugins: [{
    apply(compiler) {
      compiler.hooks.compilation.tap('native-asset-cache', compilation => {
        require('@vercel/webpack-asset-relocator-loader').initAssetCache(compilation, 'native_modules');
      });
    },
  }],
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
