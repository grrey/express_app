 
/** 
 *  维度 ；
 * 
 *  type:"CP_TYPE_" || "BK_TYPE_"
 *  name:"BK_TYPE_" ,
 *  PH:[],
 * 
 * 	 
 */

let  base = require('./base');
let ProgressBar = require('progress');
let shortId = require("shortid")
var pinyin = require("../utils/pinyin");


class Dimension extends base {

    constructor() {
        super()
        // index ;
		this.indexName = "diman";
		this.defaultTypeName = "dimension_"


        // type ; 
		this.CP_TYPE = "CP_TYPE_";  //  产品; 
		this.HY_TYPE = "HY_TYPE_";  //  行业;
		/**
		 * @description 板块 类型
		 */
        this.BK_TYPE = "BK_TYPE_";  //  板块; 

        // 查询是每页条数;
        this.pageSize = 1000;
    } 
    // 生成id;
    _genId(entity) {
		if(!entity.type || !entity.name ){
			throw( ' Dimension no  type field | name !')
		}
        return  entity.type +"_" +   pinyin.getPinYin( entity.name);
	}
	

}
 
module.exports = new Dimension();
