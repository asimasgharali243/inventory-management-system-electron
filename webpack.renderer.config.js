// const rules = require('./webpack.rules');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');

// rules.push({
//   test: /\.css$/,
//   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
// });

// rules.push({
//   test: /\.(jpg|png|gif|svg)$/,
//   type: 'asset/resource',
// });

// module.exports = {
//   target: 'web',
//   module: {
//     rules,
//   },
//   resolve: {
//     extensions: ['.js', '.jsx', '.json'],
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/renderer/index.html',
//       filename: 'index.html',
//     }),
//     new webpack.DefinePlugin({
//       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
//     }),
//   ],
//   // Add this to disable eval in development
//   devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
//   // Optimizations to prevent eval
//   optimization: {
//     minimize: process.env.NODE_ENV === 'production',
//     runtimeChunk: false,
//   },
// };

const rules = require('./webpack.rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(jpg|jpeg|png|gif|svg|webp)$/i,
  type: 'asset/resource',
});

module.exports = {
  target: 'web',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  // Disable eval source maps to prevent URL errors
  devtool: false,
  optimization: {
    minimize: false,
    runtimeChunk: false,
  },
  // Disable HMR to prevent the error
  devServer: {
    hot: false,
    liveReload: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
};