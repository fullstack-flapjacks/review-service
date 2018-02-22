const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');


/*
  This webpack config is used strictly for rehydrating react components
  and transpiling css files. The bundled css is ultimately included in the
  Page component server side.
*/

module.exports = {
  context: __dirname,
  entry: ['./app.js'],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.scss|\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
        })
      },
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('./css/main.css'),
    // new HtmlWebpackPlugin({
    //   inject: false,
    //   template: require('html-webpack-template'),
    //   appMountId: "app"
    // })
  ],
  devtool: "source-map",
  // devServer: {
  //   contentBase: path.join(__dirname, 'public'),
  //   compress: true,
  //   port: 9000
  // },
  target: "web"
};