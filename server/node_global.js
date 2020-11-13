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
 *  funcArr  可以是一个函数, 可以使函数数组;
 * @param asyncFun
 * @param argsArr
 * @param times
 * @param t
 * @returns {Promise<*>}
 */
global.runWithReTry = async function (funcArr=noop, argsArr=noop, times = 2, t = 1000) {

    var result = {};
    var isFunEntity = !funcArr.forEach ;

    for (var i = 0; i < times; ++i) {
        if (isFunEntity) {
            // 运行函数实体;
            try {
                result = await funcArr.apply(undefined, argsArr);
                i = times;
            } catch (e) {
                await  sleep(t);
                console.error("runWithReTry error  try = ", i, times,  );
                console.error(e)
            }
        } else {
            // 遍历 函数 去运行;
            var fun = funcArr[i];
            var resp = await  global.runWithReTry(fun, funcArr, times, t);
            Object.assign(result, resp)
        }
    }
    return result;
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
		 console.log(`cluster_${pm2id} ->: `, ...args)

	}
}

