require('../server/node_global');
const stockCtrl = require('../server/ctrl/stock');
const hisCtrl = require('../server/ctrl/his');

process.env.disLog = true;

(async () => {

	// await hisCtrl.upDataAllStockHis();

	await hisCtrl.upDataAlNews();

})()




