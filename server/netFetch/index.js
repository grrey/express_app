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

	async fetchF10(esStock) {
		let result = await dfcfw.fetchF10(esStock);
		return result;
	}
 
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
	
	async  fetchBusiness (esobj ){
		let result =   await  dfcfw.fetchBusiness( esobj );
		return result ;
	}

}

var s = new NetFetch();

module.exports = new NetFetch();



 