let _ = require('lodash');
let  moment = require('moment');
let config = require('../config');

global._ =_ ;
global.moment = moment ;
global.appConfig = config ;

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
 * 包裹成 可重试的 函数;
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
				console.error("reTryWarper error  try = ", i , fun , e  );
			}
		}
		return result  ;
	}
	
} 

//--------------- 数组异步遍历 ------------------------------------------------------------------------------------------
Array.prototype.asyncForEach = async function ( func ){
	let length = this.length ;  
	let o ; 
	for( let i = 0 ; i < length ; ++i){
		o = this[i];
		await func( o  , i ) 
	}
}
//---------------------------------------------------------------------------------------------------------

const  rowLog = console.log ;
console.log = function(){
	rowLog( new Date().toLocaleString() , "| " , ...arguments)
}

const rowError = console.error ;
console.error = function(){
	rowError(  new Date().toLocaleString() ,"| " , ...arguments) 
}