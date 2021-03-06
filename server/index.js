require('./node_global');
require('./chain');

 
const express = require('express')
const http = require('http')
var setApi = require('./api')
var setRouter = require('./router')
var  initScoket = require('./socket');
var compression = require('compression')

var app = express();

var server = http.createServer(app);

app.use(compression())
app.use( express.static('../lobaster_client/dist') );

setApi(app)
setRouter(app)
initScoket( server);

server.listen(8080, function() {
    let host = server.address().address
    let port = server.address().port
    console.log('app listening at', host, port)
})
 