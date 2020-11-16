


const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esDimension = require('../esModel/dimension');
const pinyin = require('../utils/pinyin');
const stockListData = require('../../data/allStock')
const redis = require('../utils/redis')
const { TaskName  } = require('../chain/const')

// esStock.getById('sz000002').then( console.log )

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
	// 获取所有列表
	async getAllList( {luceneStr = esStock.lucene_gp , fields = esStock.baseField }){
		let  page =  await  esStock.search({ 
			luceneStr ,
			size:4000 ,
			fields2return: fields
		});
		return page.data ; 
	}
	// 触发 task队列;
	async pubStockQueue( {taskName , fields} ){
		let list = await this.getAllList({ fields });
		redis.publishTask( taskName , list );
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
	async updateBusiness( esObj ){ 
		let id = esObj._id ;
		let ess = await esStock.getById( id , [ esStock.FIELDS.zycp , esStock.FIELDS.zyhy]);
		let  bus  =  await  netFetch.fetchBusiness(  esObj ) ;
		// 合并 数据 ?
		log('updateBusiness' , esObj , bus )
		await esStock.createOrUpdate({ _id: id  , _source: bus });
	}

	async handF(data){
		log( 'handF run !!' , data )
		return  await sleep( 200 )
	}
 

}

module.exports = new StockCtrl();

 