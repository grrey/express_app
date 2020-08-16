/**
 * 各种分析的结果; 
 */


/** 
 *  维度 ；
 *  
 *  name:"行业总经营排行" ,
 * 	desc:""
 *  hy_list:[ //行业排行榜
 * 		{ hy_name: , total:   , stock_num: 几家公司 }
 * 	],
 * 
 * 	 
 */

let base = require('./base');
let ProgressBar = require('progress');
let shortId = require("shortid")
var pinyin = require("../utils/pinyin");


class Dimension extends base {

	constructor() {
		super()
		// index ;
		this.indexName = "result";
		this.defaultTypeName = "result_"

 

		this.baseField = ['type', 'name'];
	}
	// 生成id;
	_genId(entity) {
		if ( !entity.name) {
			throw (' Dimension no  type   name !')
		}
		return "result_" + pinyin.getPinYin(entity.name);
	}
  

}

module.exports = new Dimension();
