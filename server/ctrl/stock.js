


const {fetchCurrentVal} = require("../netFetch/valcurrent");
const {fetchF10} = require("../netFetch/f10");
const {fetchBusiness} = require("../netFetch/business");

const esStock = require('../esModel/stock'); 
const esCommon = require('../esModel/common'); 
const stockListData = require('../../data/allStock'); 
const  {getSM} =require('../utils/pinyin')
 

require('../node_global')

class StockCtrl {

	// 获取所有列表
	async getAllList( {luceneStr = esStock.lucene_gp , fields = esStock.allField }={}){
		let  page =  await  esStock.search({ 
			luceneStr ,
			size:4000 ,
			fields2return: fields
		});
		return page ; 
	}
	// 导入 数据;
	async fetchStockLlist() {
		// let list = await netFetch.fetchStock(); 
		let list = stockListData.data.map((d)=>{
			d._source.marketCode = d._source.market + d._source.code ;
			d._source.pinyin =  getSM(d._source.name);
			return  d._source  ;
		}) 
		console.log('stock length = ', list.length);
		let result = await esStock.createOrUpdate(list);
		console.log(' es result ', result)
	}
	 
	/**
	 * 4个进程 , process 内的st ;
	 * @param {*} param0 
	 */
	async getProcessStList({luceneStr = esStock.lucene_gp , fields = esStock.baseField }={}){
		let  { total , data } = await this.getAllList({ luceneStr , fields});
		let { pm_id=0   ,  instances=1 } = process.env ;
		pm_id = +pm_id ;
		instances = +instances ; 
		let w =  Math.ceil( total/instances );  
		return  data.slice( pm_id * w ,  (pm_id+1)*w );
	}
	   

	// fetch 10 ;
	async updeF10( esObj ) {
		let f10 =  await  fetchF10( esObj );
		await  esStock.update( esObj._id , f10);
	}

	// 跟新经营数据 比例; 
	async updateBusiness( esObj ){  
		let  bus  =  await  fetchBusiness(  esObj ) ; 
		await esStock.update( esObj._id , bus ); 
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
		esObjs = esObjs.forEach ? esObjs: [ esObjs]; 
		var  currDataArr = await fetchCurrentVal( esObjs ); 

		currDataArr.forEach( async ( currData , i )=>{ 
			let esObj = esObjs[i];
			let { curr_high = 0, curr_low = 0 , curr  , inner , outter } = esObj._source.watchVal || {} ;
			let message ;
			// 实时监控 ------------------------------ 
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
				// await commonCtrl.pushMessage( message);
			}
			// 写入 数据库 ---------------------------
			let row = currData._row ;
			let current = {
				buy1_l: +row[10],
				buy1_j: +row[11], 
				buy2_l: +row[12],
				buy2_j: +row[13],
				buy3_l: +row[14],
				buy3_j: +row[15],
				buy4_l: +row[16],
				buy4_j: +row[17],
				buy5_l: +row[18],
				buy6_j: +row[19],

				sell1_l: +row[20],
				sell1_j: +row[21],
				sell2_l: +row[22],
				sell2_j: +row[23],
				sell3_l: +row[24],
				sell3_j: +row[25],
				sell4_l: +row[26],
				sell5_j: +row[27],
				sell6_l: +row[28],
				sell5_j: +row[29],

				date: row[30],
				time: row[31]
			}

			console.log(  currData.entity  , current )
			await  esStock.update( currData.entity , {current} );
			await sleep(50);
		})
	}

	/**
	 * 监控   历史 val ,
	 */
	async watchHisVal(){

	} 
}

var stockCtrl = new  StockCtrl();
module.exports = stockCtrl;

  
// stockCtrl.watchCurrentVal( [{_source:{ marketCode:"sh600311"}}] )


// stockCtrl.getProcessStList({}).then(  (params) => {
// 	console.log('rrrr' , params )
// } )

// stockCtrl.getAllList({}).then((data) => { 
// 	var d = data.data.map((d) => {
// 		return d._source ;
// 	})
// 	console.log( JSON.stringify( d ))
// })

 
//  stockCtrl.fetchStockLlist();
