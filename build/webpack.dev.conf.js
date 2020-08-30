const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'

var devConfig =  {
  entry: ['./build/dev-client.js', './client/index.js'],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './../static/'),
    publicPath: '/',
    filename: 'bundle.[hash].js'
  },
  resolve: {
    alias: {
	  'vue$': 'vue/dist/vue.common.js'
	  
	  
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'client/index.jade',
      filename: 'index.html'
	}),
	new webpack.ProvidePlugin({
		moment:"moment",
		_:'lodash',
	})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include:[path.resolve(__dirname,"./../client")]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader','stylus-loader']
      },
      {
        test: /\.jade$/,
        use: 'jade-loader'
      },
      {
        test: /\.stylus$/,
        loader: 'stylus-loader'
      },
      {
        test: /\.vue$/,
        loader: ['vue-loader']
	  },
	  {
        test:/\.(woff|woff2|eot|otf|ttf)$/,
		loader:'file-loader' 
      }
    ]
  }
}

module.exports = devConfig
