const stockCtrl = require('../server/ctrl/stock');
require('../server/node_global');


process.env.disLog = true;

(async () => {

	// fetch stock  base data ;
	// stockCtrl.fetchStockLlist();

	// pinyin ;
	// stockCtrl.stockPinyin();

	// fetch f10 ;
	// stockCtrl.updeF10();

	//
	stockCtrl.updateBusiness()


})()




