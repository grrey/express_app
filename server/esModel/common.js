/**
 * 各种分析,监控 的结果;  消息通知 ,
 * 
 * 
 * 	type:    'stock_search_profile'  : 搜索条件,
 * 	entity : '' 
 * 	day:'',  日期 到天;  2020-11-11,
 *  date:'' 日期 到 小时,秒
 * 
 *  title:""
 * 	desc: '',
 * 	value:'',
 * 
 */
 
let base = require('./base');
let ProgressBar = require('progress');
let shortId = require("shortid")
var pinyin = require("../utils/pinyin");


class Common extends base {

	constructor() {
		super()
		// index ;
		this.indexName = "common";
		this.defaultTypeName = "common_"
 
		this.baseField = ['type', 'endity' , 'day'];

		this.TYPE = {
			stock_search_profile:'stock_search_profile' , // 搜索条件  
			watch_curr_val_message:"watch_curr_val_message" , // 
			watch_his_val_message:"watch_his_val_message" , // 
			
		}
	}
	_genId( doc ){
		if(!doc.type){
			throw  new Error( 'escommon  no  type value');
		}
		if( doc.type ==  this.TYPE.stock_search_profile){ 
			return  doc.type +  Math.random();
		}
		if( doc.type == this.type.watch_curr_val_message || doc.type == this.type.watch_his_val_message  ){
			return  doc.type + doc.entity + doc.day ;
		}
	}
  

}

module.exports = new Common();
