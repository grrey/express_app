/*
 * @Author: your name
 * @Date: 2017-06-30 15:12:47
 * @LastEditTime: 2021-06-29 20:13:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * 
 * @FilePath: /express_app/server/index.js
 */
process.env.NODE_ENV = 'production'

require('./node_global');
require('./chain');

const express = require('express')
const cookieParser = require("cookie-parser")
const http = require('http')
var compression = require('compression')


var setApi = require('./api')
var setRouter = require('./router')
var  initScoket = require('./socket');

var app = express();
var server = http.createServer(app);

app.use(cookieParser());
app.use(compression())
app.use( express.static('../lobaster_client/dist') );
app.use( express.static('./public') );

setApi(app)
setRouter(app)
initScoket( server);

server.listen(8080, function() {
    let host = server.address().address
    let port = server.address().port
    console.log('app listening at', host, port)
})
 
 