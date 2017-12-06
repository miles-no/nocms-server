const webpack = require('webpack');
const path = require('path');

const clientBundleConfig = {
  entry: {
    client: './example/src/client',
  },
  output: {
    path: path.join(__dirname, '/example/assets'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        include: path.join(__dirname, '/assets'),
        exclude: /bundle\.js$/,
      },
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'nocms-server': path.resolve(__dirname, 'src'),
    },
  },
};

const serverBundleConfig = {
  entry: {
    server: './example/src',
  },
  devtool: 'source-map',
  target: 'node',
  output: {
    path: `${__dirname}/example/build`,
    filename: '[name].js',
    publicPath: `${__dirname}/example`,
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx|js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
  resolve: {
    alias: {
      'nocms-server': path.resolve(__dirname, 'src'),
    },
  },
};

module.exports = [serverBundleConfig, clientBundleConfig];
