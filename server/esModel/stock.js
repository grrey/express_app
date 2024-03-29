let  base = require('./base');
let ProgressBar = require('progress');
let _ = require('lodash')
/**

 _id =  marketCode
 stock = {
    "marketCode": "sz002455",
    "market": "sz",
    "code": "002455",
    "name": "百川股份",
    "JYFW": "危险化学品经营(按许可证所列方式和项目经营);--经营的东西, 干什么的.",
	"SSBK": [ "化工行业", "江苏板块", "锂电池"],
    'hy':"锂电池" ,
	zyhy: [{ zygc:"行业类别" zysr:"主营收入" , srbl:"收入比例"},..] // 最近时间 主营行业, 
	zycp: [] // 最近时间 主营产品;,

	// 价格监控 , 实时的, 历史的 
	watchVal: { 
		curr_high , 
		curr_low  ,
		his_high ,
		his_low 
	}, 
	// 市值
	tcap: 总,
	mcap: 流通 ,
	macp_rate:   macp/tcap ;

	tag: [ '组1' , '组2' ,... ] , // 打的标签 ,
	current: {  // 监控的 实时 数据; 
    // hot 
    buy_sell_l: parseInt( current.buy1_l * current.sell1_l  / 10000  ) 
    //
    
	}
 }
 
 */
class Stock extends base {

    constructor() {
        super()
        // index ;
        this.indexName = "st";
        // type ;
        // this.stockType = "stock_";
        this.defaultTypeName = "st_";

        // 查询是每页条数;
        this.pageSize = 200;

        // stock 基本字段;
        this.baseField = ["_id", "market", "code", 'name' ,'latesHisDay' , 'tag'  ];
        this.forHisField = ["_id",  ,"market", "code", 'name' ,'latesHisDay'  ];

        // luceneStr 查询 短语;
		// this.lucene_gp = "code:/[0,3,6]{1}.{5}/ AND latesHisDay:>20201228 ";
		this.lucene_gp = "code:*";
		
		// this.lucene_gp = "code:/[0,3,6]{1}.{5}/"
		this.allField = [
			"market", "code", 'name' ,'pinyin',
			'latesHisDay' ,
			'JYFW' , 'SSBK' ,'ticai',
			'business','zyhyT','zycpT', 'hy',

		]
	}
	

    // 生成id;
    _genId(entity) {
        return  entity.code ;
    }

    // 从es中获取所有 stock ;
    getIteratorArr({esFields=[] , lucene }) {
		let params  = {
			page: 1,
            size: 4000,
			luceneStr: lucene || this.lucene_gp,
			fields2return: [ ...this.baseField , ...esFields ]
		} 
        return this.search( params );
    }

    /**
     * esFields 需要查询stock 的字段;
     * @param funcArray
     * @param dealData
     * @param esFields
     * @returns {Promise<void>}
     */
    async Iterator( { dealEsEntity,  stockList =[]  , t=5 }) { 
		var length = stockList.length; 
		let reTryDelEsEntiy = reTryWarper(dealEsEntity); 
        for (var i = 0; i < length; ++i) {
			let stock = allStork.data[i]; 
			if(t!= undefined){
				await sleep( t );
			} 
			await reTryDelEsEntiy(stock);  
        }
    }


    /**
     * 更新tag ,  tagName , || tagName= { tag: hit , A:false | true }
     * @param {*} _id 
     * @param {*} tagName 
     * @param {*} hit 
     */
    async upDataTag( _id ,  tagName  , hit ){
        
        let tagConf = {}
        if(  tagName instanceof Object ){
            tagConf = tagName ;
        }else {
            tagConf =  { [tagName]: hit }
        }
 
    	let {_source} = await this.getById( _id , ['tag']);
    	let { tag=[] } = _source ;

         
        for( let key in tagConf ){
            let  bool = tagConf[ key ];
            if( bool === true ){
                if( !tag.includes( key ) ){
                    tag.push( key )
                }
            } else if( bool === false ){
                let i =  tag.indexOf( key )
                if(  i >=0 ){
                    tag.splice( i , 1 )
                }
            }
        } 
        // console.log( _id  ,tag )
    	await  this.update( _id , { tag });
    }

  


}
 
module.exports = new Stock();