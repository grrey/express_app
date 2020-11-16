require('../server/node_global');
const stockCtrl = require('../server/ctrl/stock');
const hisCtrl = require('../server/ctrl/his');
const redis = require('../server/utils/redis')
const esStock = require('../server/esModel/stock');

process.env.disLog = true;

(async () => {

	// await hisCtrl.upDataAllStockHis();

	// await hisCtrl.upDataAlNews();

	let list = await stockCtrl.getAllList({fields: esStock.forHisField });
	redis.publishTask( 'updateHis' , list );

})()




