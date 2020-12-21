/**
 * 
 */
let rp = require('request-promise');

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
		if( _source.latesHisDay ){ //latesHisDay
			startDay = moment( _source.latesHisDay ).add(1 ,'days').format('YYYYMMDD');
		}else{
		 	startDay = _source.latesHisDay || (moment().subtract(600, 'days').format('YYYYMMDD'));
		}
		let hislist = await tushare.fetchHis( {_id , _source }, startDay);
		return hislist
	}

	// 抓取 经营数据; 历史报表
	async  fetchBusiness (esobj ){
		let result =   await  dfcfw.fetchBusiness( esobj );
		return result ;
	}
	// 抓取新闻; [  ]
	async  fetchNews( esStock ){
		let newsList = await  dfcfw.fetchNews( esStock );
		console.log( 'fetch news' , esStock ,newsList )
		return  newsList ;
	}

	// 实时交易数据;
	async  fetchCurrentVal( esStock ){
		return  11.11
	}


}
 

module.exports = new NetFetch();



 