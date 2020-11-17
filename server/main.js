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



/*

var ws = new WebSocket("ws://127.0.0.1:3000");

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};

*/