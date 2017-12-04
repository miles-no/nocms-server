const path = require('path');
const config = {
  entry: {
    app: './example/src',
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
  resolve: {
    alias: {
      'nocms-server': path.resolve(__dirname, 'src'),
    },
  },
};

module.exports = config;
