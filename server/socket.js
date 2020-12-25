var socket = require('socket.io');
module.exports = function initSocket ( server ) {
	const  io =  socket( server ) ;

	io.on('connection', function(socket){
		log('a user connected');
	  
		socket.on('disconnect', function(){
		  log('user disconnected');
		});
		  
		socket.on('chat message', function(msg){
		  log('message: ' + msg);
	  
		  io.emit('chat message', msg);
		});
	  
	});
}