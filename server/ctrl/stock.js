


const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esDimension = require('../esModel/dimension');
const esCommon = require('../esModel/common');
const pinyin = require('../utils/pinyin');
const stockListData = require('../../data/allStock')
const redis = require('../utils/redis')
const { TaskName  } = require('../chain/const');

const  commonCtrl = require('./common')
 
 

class StockCtrl {

	async fetchStockLlist() { 
		// let list = await netFetch.fetchStock();
		
		let list = stockListData.data.map((d)=>{
			d._source.marketCode = d._source.market + d._source.code ;
			return  d._source  ;
		}) 
		log('stock length = ', list.length);
		let result = await esStock.createOrUpdate(list);
		log(' es result ', result)
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
	async pubStockQueue( {taskName , fields , luceneStr} ){
		let list = await this.getAllList({ fields  , luceneStr });
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

	/**
	 * 监控  实时  val , 批量 ,
	 * watchVal: { 
			curr:true | false ,
			his:true| false ,

			outter: 超出边界 ,
			inner:  进入边界;
			curr_high , 
			curr_low  ,
			his_high ,
			his_low 
		},  
	 */
	async watchCurrentVal(esObjs){
		// curr = true 
		var  currDataArr = await  netFetch.fetchCurrentVal( esObjs );

		currDataArr.forEach(( currData , i )=>{ 
			let esObj = esObjs[i];
			let { curr_high = 0, curr_low = 0 , curr  , inner , outter } = esObj._source.watchVal || {} ;
			let message ; 
			if( inner && +curr_low < +currData.curr && +currData.curr < +curr_high  ){
				// message in ;
				message = {
					type: esCommon.TYPE.watch_curr_val_message ,
					entity: esObj._id ,
					desc:' curren_val  in ' + currData.curr ,
					value: currData.curr ,
					day: currData.day
				};
			}
			if( outter &&  ( +curr_low > +currData.curr || +currData.curr > +curr_val ) ){
				// message out ;
				message = {
					type: esCommon.TYPE.watch_curr_val_message ,
					entity: esObj._id ,
					desc:' curren_val  out : ' + currData.curr ,
					value: currData.curr ,
					day: currData.day
				}; 
			}
			if( message ){
				await commonCtrl.pushMessage( message);
			}
		})
	}
	/**
	 * 监控   历史 val ,
	 */
	async watchHisVal(){

	} 
}

module.exports = new StockCtrl();

 