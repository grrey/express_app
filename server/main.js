require('./node_global');
require('./chain');




const express = require('express')
const http = require('http')
var app = express()
var setApi = require('./api')
var setRouter = require('./router')
var server = http.createServer(app)

server.listen(8080, function() {
    let host = server.address().address
    let port = server.address().port
    log('example app listening at localhost://%s:%s', host, port)
})

setApi(app)
setRouter(app)
