let  base = require('./base');
let ProgressBar = require('progress');
/**

 _id =  marketCode
 stock = {
    "marketCode": "sz002455",
    "market": "sz",
    "code": "002455",
    "name": "百川股份",
    "JYFW": "危险化学品经营(按许可证所列方式和项目经营);--经营的东西, 干什么的.",
	"SSBK": [ "化工行业", "江苏板块", "锂电池"],
 
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
        this.indexName = "stock";
        // type ;
        // this.stockType = "stock_";
        this.defaultTypeName = "stock_";

        // 查询是每页条数;
        this.pageSize = 200;

        // stock 基本字段;
        this.baseField = ["_id", 'marketCode' ,"market", "code", 'name' ,'latesHisDay'  ];
        this.forHisField = ["_id", 'marketCode' ,"market", "code", 'name' ,'latesHisDay'  ];

        // luceneStr 查询 短语;
		this.lucene_gp = "code:/[0,3,6]{1}.{5}/";
		
		// this.lucene_gp = "code:/[0,3,6]{1}.{5}/"
		this.allField = [
			'marketCode' ,"market", "code", 'name' ,'pinyin',
			'latesHisDay' ,
			'JYFW' , 'SSBK' ,
			'business','zyhy','zycp',
		]
	}
	

    // 生成id;
    _genId(entity) {
        return entity.market + entity.code ;
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
     * 更新tag , 
     * @param {*} _id 
     * @param {*} tagName 
     * @param {*} hit 
     */
    async upDataTag( _id ,  tagName  , hit ){
    	let {_source} = await this.getById( _id , ['tag']);
    	let { tag=[] } = _source ;
    	if( tag.length ){
    		tag = tag.filter((params) => {
    			return params != tagName ;
    		}); 
    	} 
    	if( hit ){
    		tag.push(tagName );
    		console.log( 'updata Tag' , _id , tagName ,hit )
    	} 
    	await  this.update( _id , { tag });
    }

}
 
module.exports = new Stock();