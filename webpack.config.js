var path = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  entry: [
  'babel-polyfill',
  './app/app.js'
    // vendor: [
    // 'react',
    // 'react-redux',
    // 'redux',
    // 'isomorphic-fetch',
    // 'es6-promise'
    // ].map( d => "./node_modules/" + d )
    //TODO: add vendor files here
  ],
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    //CUSTOM RUN_TIME ENV VARIABLES. UPDATE FOR PRODUCTION
    new webpack.DefinePlugin({
      PORT: JSON.stringify(process.env.PORT) || 5000, 
      URL: JSON.stringify(process.env.url) || JSON.stringify("http://localhost:" + (process.env.PORT || 5000))
    })
  ],
  // plugins: [
  //   new webpack.optimize.OccurrenceOrderPlugin(),
  //   new webpack.HotModuleReplacementPlugin()
  // ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      { 
        test: /\.json$/,   
        loader: "json-loader" 
      },
      { 
        test: /\.css$/,
        loader: "style-loader!css-loader" 
      }
    ]
  }
}
