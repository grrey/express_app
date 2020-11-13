

var  token = require('../../config');
const Tushare = require('tusharepro');
 
var ts = new Tushare(  token.tushare );


async function fetchStockList(){ 
	let s = await  ts.stock_basic().catch( (a)=>{ console.log(333,a)} );
	return s ;
}

async function fetchHis( {_id , _source } , startDay ){
	/**
	 * @description: 交易日每天15点～16点之间/每分钟内最多调取200次，超过5000积分无限制/获取股票行情数据，或通过通用行情接口获取数据，包含了前后复权数据．
	 * @param {type} 
	 * @return: 
	 * TusharePro.prototype.daily = function (ts_code = '', trade_date = '', start_date = '20200411', end_date = '', symbol = '', fields = '') 
	 */
	let code = _source.code + '.'+ _source.market ;
	let resp = await ts.daily(  code  , ''  , startDay ).catch( (a)=>{ console.log(333,a)} );
	let list = (resp.data.items || [] ).reverse().map((d)=>{
		return {
			marketCode: _source.market + _source.code ,
			date: d[1].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"),
			k:{ 
				open: d[2],
				high: d[3],
				low: d[4],
				close: d[5],
	
				chg: d[7],
				pchg: d[8],
	
				vol: d[9],
				amount: d[10]
			}
		}
	})
	// console.log( '  startatay = ', startDay , '  list.length = ',list  )
	return  list ;
}

// 获取复权因子; 
async function _getFq(){
	let list = await ts.adj_factor('000001.sz' ) .catch( (a)=>{ console.log(333,a)} );;

	console.log( list )
	
}


module.exports = {
	fetchStockList ,
	fetchHis,
} 
  


 