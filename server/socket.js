var socket = require('socket.io');
module.exports = function initSocket ( server ) {
	const  io =  socket( server ) ;

	io.on('connection', function(socket){
		console.log('a user connected');
	  
		socket.on('disconnect', function(){
		 console.log('user disconnected');
		});
		  
		socket.on('chat message', function(msg){
		 console.log('message: ' + msg);
	  
		  io.emit('chat message', msg);
		});
	  
	});
}