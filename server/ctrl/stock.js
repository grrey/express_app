


const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esDimension = require('../esModel/dimension');
const pinyin = require('../utils/pinyin');
const stockListData = require('../../data/allStock')


class StockCtrl {

	async fetchStockLlist() { 
		// let list = await netFetch.fetchStock();
		
		let list = stockListData.data.map((d)=>{
			d._source.marketCode = d._source.market + d._source.code ;
			return  d._source  ;
		})

		console.log('stock length = ', list.length);
		let result = await esStock.createOrUpdate(list);
		console.log(' es result ', result)
	}

	// pinyin字段;
	async stockPinyin() {
		let result = [];
		await esStock.Iterator({
			t:1,
			dealEsEntity: ({ _id, _source }) => {
				result.push({
					_id,
					_source: {
						pinyin: pinyin.getSM(_source.name).substr(0 , _source.name.length)
					}
				})
			}
		}) 
		await  esStock.createOrUpdate( result );
	}

	// fetch 10 ;
	async updeF10() {
		let result = [];
		await esStock.Iterator({
			t: 1000 ,
			barText:"f10",
			dealEsEntity: async ( { _id , _source } ) => {
				let f1 =  await  netFetch.fetchF10( {_source});
				await  esStock.createOrUpdate( {_id , _source : f1 });
			}
		})
	}

	// 跟新经营数据 比例; 
	async updateBusiness(){
		await esStock.Iterator({
			t:50 ,
			dealEsEntity: async ({_id , _source })=>{
				let  doc =  await  netFetch.fetchBusiness( {_source}) 
				console.log( _id , doc ); 
				await esStock.createOrUpdate({_id , _source: doc })
			}
		})
	}

	async handF(data){
		log( 'handF run !!' , data )
		return  await sleep( 1000 )
	}
 

}

module.exports = new StockCtrl();

 