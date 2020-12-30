/*
// marketCode,
// date: rd[0].replace(/\//g, "-"),  // moment(rd[0]).format("YYYY-MM-DD"),
 K :{
		// close: +rd[3], // 收盘价 ;
		// high: +rd[4],  //最高,
		// low: +rd[5],       // 最低
		// open: +rd[6],     // 开盘价

		// CHG: +rd[7], //  涨跌金额
		// PCHG: +rd[8], //  涨跌幅

		// rate: +rd[9], // 换手率    :   百分比;
		// volume:  parseFloat(  (+rd[10] / 1000000).toFixed(2) ), //  成交量     单位:万手
		// value:  parseFloat(  (+rd[11] / 100000000).toFixed(2) ), //  成交金额;   单位: 亿 ;


		// tcap: parseInt( +rd[12] / 100000000 ) , //   总市值 ;   单位: 亿 ;
		// mcap: parseInt( +rd[13] / 100000000 ) , //   流通市值,  单位: 亿 ;
 },
 ma: {
	
 },
 
 新闻类型 : 
news:{
	score: 
	list:[
		{ link:"" , title:"" , summary:"" ,  score }
	]
}


*/


let  base = require('./base');
let ProgressBar = require('progress');

class His extends base {

    constructor() {
        super()
        // index ;
        this.indexName = "his";
        // type ; 
        this.defaultTypeName = "his_";

        // 查询是每页条数;
        this.pageSize = 200; 

    }

    // 生成id;
    _genId(entity) {
        return entity.marketCode +"_" +  entity.date ;
    }

   
}
 
module.exports = new His();