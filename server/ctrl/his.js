
const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esHis = require('../esModel/his');

class HisCtrl {
	
	async  upDataAllStockHis(){ 
		await esStock.Iterator({
			t:200 ,
			dealEsEntity: async ( esObj ) => {
				var  list = await netFetch.fetchHis( esObj );
				if( list && list.length ){
					await  esHis.createOrUpdate( list );
					esObj._source.latesHisDay = list.pop().date.replace(/-/g , '') ; 
					await  esStock.createOrUpdate( esObj );
				}
			}
		}) 
	} 
	
}

const hisCtrl = new HisCtrl();
module.exports = hisCtrl;
exports.HisCtrl = HisCtrl;

  