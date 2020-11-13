const stockCtrl = require('../server/ctrl/stock');
require('../server/node_global');
// const chain = require('../server/chain');
const redis = require('../server/utils/redis')


process.env.disLog = true;

let arr = [] ;

for(let i = 0 ; i < 50 ; ++i ){
	arr.push({ task:"tadk_"+ i })
}

(async () => {

	// fetch stock  base data ;
	// stockCtrl.fetchStockLlist();

	// pinyin ;
	// stockCtrl.stockPinyin();

	// fetch f10 ;
	// stockCtrl.updeF10();

	//
	// stockCtrl.updateBusiness();

	redis.publishTask( 'updataF' , arr )

})()




