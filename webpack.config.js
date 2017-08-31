global.Promise           = require('bluebird');

let webpack              = require('webpack');
const path               = require('path');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');


let plugins = [
  new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('styles/styles.css');
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.OccurrenceOrderPlugin()),
  plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  entry: [
    'babel-polyfill',
    __dirname + '/client/app/client.js'
  ],
  resolve: {
    modules: [__dirname + '/client/app', 'node_modules'],
    extensions:         ['*', '.js', '.jsx']
  },
  plugins,
  output: {
    path: __dirname + '/client/public',
    filename: 'js/app.js',
    publicPath: 'http://localhost:9000/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
              failOnError: false,
              failOnWarning: false
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname + '/client/public',
    hot: true,
    inline: true,
    compress: true,
    port: 9000,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false
};
