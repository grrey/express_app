


function log (){
	if( !process.env.$script  ){
		console.log.apply( console , arguments )
	}
}



module.exports = {
	log 
}

 