


const {fetchCurrentVal} = require("../netFetch/valcurrent"); 

const esStock = require('../esModel/stock'); 
const esCommon = require('../esModel/common');   

require('../node_global')

class WatchCtrl {
 
 
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
    console.log('wwww~~')
    return;

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
      // 0：”大秦铁路”，股票名字；
      // 1：”27.55″，今日开盘价；
      // 2：”27.25″，昨日收盘价；
      // 3：”26.91″，当前价格；
			let row = currData._row ;

      let chg =  ( row[3]  - row[2] ) / row[2]  * 100 ;
      chg =  +chg.toFixed(1)

			let current = {
        chg ,

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
			};
      
      // buy*sel  hot value 
      current.buy_sell_l = parseInt( current.buy1_l * current.sell1_l  / 10000  ) ;

			console.log(  esObj._id  , current )
			await  esStock.update( esObj._id , {current} );
			await sleep(50);
		})
	}

	/**
	 * 监控   历史 val ,
	 */
	async analyseHisVal(){

	} 
}

var watchCtrl = new  WatchCtrl();
module.exports = watchCtrl;

var s =  + 55.51231231.toFixed(2)

console.log( 222,  s , typeof s )