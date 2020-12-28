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

	business:[
		{   date:"" ,  
			hy: [ { zygc:"行业类别" zysr:"主营收入" , srbl:"收入比例"}  ] ,  
			cp:[ {zygc:"产品类别" ,  zysr:"主营收入" , srbl:"收入比例"} ]
		}
	],
	zyhy: [] // 最近时间 主营行业, 
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
    async Iterator( { dealEsEntity, esFields  , t=5 , barText="stock-Iterator"  , lucene }) {
		var allStork = await this.getIteratorArr({esFields , lucene });
		var length = allStork.data.length;
		
		var bar = new ProgressBar(`   ${barText} [:bar]  :index/${length}  :percent  :elapseds`, {
			complete: '#',
			incomplete: '-',
			width: 60,
			total: length
		});

		let reTryDelEsEntiy = reTryWarper(dealEsEntity);

        for (var i = 0; i < length; ++i) {
			let stock = allStork.data[i]; 
			if(t){
				await sleep( t );
			} 
			await reTryDelEsEntiy(stock); 

			await bar.tick({
				index: i + 1
			}) 
        }
    }

}
 
module.exports = new Stock();