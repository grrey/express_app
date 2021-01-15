
const stockCtrl = require('../ctrl/stock');
const esStock = require('../esModel/stock') 
var  {TaskName} = require('./const');
const hisCtrl = require('../ctrl/his');
const analyseCtrl = require('../ctrl/analyse');
const _ = require('lodash');




( async () => {
	console.log(' run schedult = ' , 'ss'  ); 

	var batch = 10;
	var handler =  reTryWarper( stockCtrl.watchCurrentVal ) ;
 
	let stockList = await  stockCtrl.getProcessStList({});
  
	while( stockList.length ){ 
		let esObj ; 
		if(1 == batch){
			esObj = stockList.splice(0,1)[0];
		}else {
			esObj = stockList.splice(0,batch);
		}
		await handler( esObj ) ;
		await sleep(1000) ;
	} 

})();

 