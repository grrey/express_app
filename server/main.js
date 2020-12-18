require('./node_global');
require('./chain');




const express = require('express')
const http = require('http')
var setApi = require('./api')
var setRouter = require('./router')

var app = express();
app.use( express.static('../lobaster_client/dist') );

var server = http.createServer(app)

server.listen(8080, function() {
    let host = server.address().address
    let port = server.address().port
    log('example app listening at localhost://%s:%s', host, port)
})

setApi(app)
setRouter(app)

// NODE_ENV
console.log('xxxxxxx' , process.env.NODE_ENV )


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