var fs = require('fs')
var path = require('path')
var opn = require('opn')
var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig =  require('./webpack.dev.conf')
var config = require('./../config')
var compiler = webpack(webpackConfig)
var app = express()
var proxyTable = config.dev.proxyTable

console.log('当前环境 => ' + process.env.NODE_ENV)

var devMiddleWare = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  hot: true,
  stats: {
    colors: true
  }
})

var hotMiddleWare = webpackHotMiddleware(compiler)

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleWare.publish({ action: 'reload' })
    cb()
  })
})

// set proxy
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  app.use(context, proxyMiddleware(options))
})

app.use(devMiddleWare)
app.use(hotMiddleWare)

app.use(express.static('static'))

devMiddleWare.waitUntilValid(() => {
  console.log('....webpack compile.....')
  _resolve()
})

app.listen(80, function() {
  let uri = `http://localhost:80`
  console.log('start listening on 80')
  opn(uri)
})

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})


process.on('SIGINT', function() {
  // console.log('发生了一些事情');
});

module.exports = {
  redy: readyPromise,
  close: () => {
    server.close()
  }
}
