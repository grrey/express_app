const stockCtrl = require('../server/ctrl/stock');
require('../server/node_global'); 
const redis = require('../server/utils/redis')


process.env.disLog = true;
 
(async () => {

	// fetch stock  base data ;
	// stockCtrl.fetchStockLlist();

	// pinyin ;
	// stockCtrl.stockPinyin();

	// fetch f10 ;
	// stockCtrl.updeF10();

	// 
	// stockCtrl.updateBusiness({ _id: 'sz000002' , _source:{ market:'sz' , code:'000002'} });

	// redis.publishTask( 'updataF' , arr )

	
	let list = await stockCtrl.getAllList();
	redis.publishTask( 'updateBusiness', list );


})()




