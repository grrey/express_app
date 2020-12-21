let _ = require('lodash');
let  moment = require('moment')

global._ =_ ;
global.moment = moment ;

let noop = function(){}
global.noop =  noop;


global.pm2id = process.env.pm_id ;

//---------------------------------------------------------------------------------------------------------
global.sleep = function (t = 1000) {
    return new Promise(function (r, j) {
        setTimeout(r, t);
    })
}

//---------------------------------------------------------------------------------------------------------
/**
 * 包裹成  可重试的 函数;
 * @param {} fun 
 * @param {*} times 
 * @param {*} t 
 */
global.reTryWarper =  function( fun , times = 2 , t=20 ){
	return  async  function( ){ 
		let succ = false  , result ; 
		for(let i  = 0 ;  i < times && !succ ; ++i){
			try {
				result = await fun(...arguments);
				succ = true ;
			}catch(e){
				await sleep(t);
				log.error("reTryWarper error  try = ", i , fun , e  );
			}
		}
		return result  ;
	}
	
} 

//---------------------------------------------------------------------------------------------------------
global.Iterator = async function (  _in , func ){
	if(!_in){
		return ;
	}
	_in =  _in.forEach ? _in :[_in];
	let length = _in.length ;
	let o ; 
	for( let i = 0 ; i < length ; ++i){
		o = _in[i];
		await func( o  , i ) 
	}
}
//---------------------------------------------------------------------------------------------------------

global.log = function(...args ){
	if( !process.env.disLog ){
		let pm2id = process.env.pm_id ;
		 console.log(  new Date().toLocaleString() , "| " , ...args)

	}
}

global.log.error = function(...args ){
	if( !process.env.disLog ){
		let pm2id = process.env.pm_id ;
		 console.error(  new Date().toLocaleString() ,"| " , ...args) 
	}
}
