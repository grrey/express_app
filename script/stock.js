require('../server/node_global'); 
const stockCtrl = require('../server/ctrl/stock');
const redis = require('../server/utils/redis')
const esStock = require('../server/esModel/stock');

process.env.disLog = true;
 
(async () => {

	// fetch stock  base data ;
	// stockCtrl.fetchStockLlist();

	// pinyin ;
	// stockCtrl.stockPinyin();

	// fetch f10 ;
	// stockCtrl.updeF10();
  
	// stockCtrl.pubStockQueue( { taskName: 'updateBusiness' } )

	stockCtrl.pubStockQueue( { taskName: 'updateHis' ,fields: esStock.forHisField} )

	// stockCtrl.pubStockQueue( { taskName: 'updateNews' } )

	// watchVal: { height , low } ,// 
	// var list = await stockCtrl.getAllList( { luceneStr:" watchVal.height:123 " })

	// console.log(11 ,  list  )


})()
 