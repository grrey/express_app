const dimenCtrl = require('../server/ctrl/dimension');
require('../server/node_global');


process.env.disLog = true;

(async () => {
 
	await dimenCtrl.extractDimen();

})()




