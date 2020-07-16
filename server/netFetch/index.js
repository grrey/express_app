 /**
  * 
  */

const  dfcfw = require('./dfcfw');

class NetFetch {
	async fetchStock () {
		let  list = await  dfcfw.fetchStock();
		return list ;
	}

	async fetchF10 ( esStock ){
		let result = await  dfcfw.fetchF10( esStock );
		return result ;
	}

}

var s = new NetFetch();
  
module.exports = new NetFetch();