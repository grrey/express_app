
/** 
 *  维度 ；
 * 
 *  type:"CP_TYPE_" || "BK_TYPE_"
 *  name:"BK_TYPE_" ,
 *  PH:[],
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

		this.HY_lucene = "type:HY_TYPE_";
		this.BK_lucene = "type:BK_TYPE_";
		this.CP_lucene = "type:CP_TYPE_";

		this.baseField = ['type', 'name'];
	}
	// 生成id;
	_genId(entity) {
		if (!entity.type || !entity.name) {
			throw (' Dimension no  type field | name !')
		}
		return entity.type + "_" + pinyin.getPinYin(entity.name);
	}
	// 从es中获取所有 stock ;
	getIteratorArr({ fields = [], lucene }) {
		let params = {
			page: 1,
			size: 10000,
			luceneStr: lucene,
			fields2return: [...this.baseField, ...fields]
		}
		return this.search(params);
	}

    /**
     * esFields 需要查询stock 的字段;
     * @param funcArray
     * @param dealData
     * @param esFields
     * @returns {Promise<void>}
     */
	async Iterator({ dealEsEntity, esFields, t = 5, barText = "dimen-Iterator", lucene = this.HY_TYPE }) {
		var allStork = await this.getIteratorArr({ esFields, lucene });
		var length = allStork.data.length;

		var bar = new ProgressBar(`   ${barText} [:bar]  :index/${length}  :percent  :elapseds`, {
			complete: '#',
			incomplete: '-',
			width: 60,
			total: length
		});

		for (var i = 0; i < length; ++i) {
			let stock = allStork.data[i];
			if (t) {
				await sleep(t);
			}
			await runWithReTry(dealEsEntity, [stock]);

			await bar.tick({
				index: i + 1
			})
		}
	}

}

module.exports = new Dimension();
