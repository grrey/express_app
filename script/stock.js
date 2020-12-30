require('../server/node_global'); 
const stockCtrl = require('../server/ctrl/stock');
const redis = require('../server/utils/redis')
const esStock = require('../server/esModel/stock');
const {TaskName}  = require('../server/chain/const')

process.env.disLog = true;
 
(async () => {

	// fetch stock  base data ;
	// stockCtrl.fetchStockLlist();

	// pinyin ;
	// stockCtrl.stockPinyin();

	// fetch f10 ;
	// stockCtrl.updeF10();
  
	// stockCtrl.pubStockQueue( { taskName: TaskName.updateBusiness } )

	// stockCtrl.pubStockQueue( { taskName: TaskName.updateHis  ,fields: esStock.forHisField} )

	// stockCtrl.pubStockQueue( { taskName: TaskName.updateNews  } )

	stockCtrl.pubStockQueue( { taskName: TaskName.calcMa  } )

	// watchVal: { height , low } ,// 
	// var list = await stockCtrl.getAllList( { luceneStr:" watchVal.height:123 " })

	//console.log(11 ,  list  )


})()
 