/**
 * 
 */

const dfcfw = require('./dfcfw');
const tushare = require('./tushare');

const moment = require("moment");
class NetFetch {
	async fetchStock() {
		let list = await dfcfw.fetchStock();
		return list;
	}
	// 抓取f10
	async fetchF10(esStock) {
		let result = await dfcfw.fetchF10(esStock);
		return result;
	}
	// 抓取 历史交易
	async fetchHis({ _id, _source }) {
		let startDay ; 
		if( _source.latesHisDay ){
			startDay = moment( _source.latesHisDay ).add(1 ,'days').format('YYYYMMDD');
		}else{
		 	startDay = _source.latesHisDay || (moment().subtract(600, 'days').format('YYYYMMDD'));
		}
		 
		let hislist = await tushare.fetchHis( {_id , _source }, startDay);
		return hislist
	}
	// 抓取 经营数据;
	async  fetchBusiness (esobj ){
		let result =   await  dfcfw.fetchBusiness( esobj );
		return result ;
	}
	// 抓取新闻; [  ]
	async  fetchNews( esStock ){
		let newsList = await  dfcfw.fetchNews( esStock );
		
		return  newsList ;
	}


}

var s = new NetFetch();

module.exports = new NetFetch();



 