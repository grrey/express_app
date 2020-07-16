


const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const pinyin = require('../utils/pinyin');


class StockCtrl {

	async fetchStockLlist() {
		let list = await netFetch.fetchStock();
		console.log('stock length = ', list.length);
		let result = await esStock.createOrUpdate(list);
		console.log(' es result ', result)
	}

	// pinyin字段;
	async stockPinyin() {
		let result = [];
		await esStock.stockIterator({
			t:5,
			dealStock: ({ _id, _source }) => {
				result.push({
					_id,
					_source: {
						pinyin: pinyin.get(_source.name)
					}
				})
			}
		}) 
		await  esStock.createOrUpdate( result );
	}

	// fetch 10 ;
	async updeF10() {
		let result = [];
		await esStock.stockIterator({
			t: 1000 ,
			barText:"f10",
			dealStock: async ( { _id , _source } ) => {
				let f1 =  await  netFetch.fetchF10( {_source});
				await  esStock.createOrUpdate( {_id , _source : f1 });
			}
		})
	}


}

const stockCtrl = new StockCtrl();
module.exports = stockCtrl;
exports.StockCtrl = StockCtrl;

