
const esHost = 'http://localhost:9200';

const { Client } = require('elasticsearch');
const client = new Client({ node: esHost });

module.exports = class esBase {
	async isIdExist(id) {
		var isExist = await client.exists({
			index: this.indexName,
			type: this.defaultTypeName,
			id: id
		});
		return isExist;
	}

	/**
	   * 创建; 支持批量; 
	   *  entity =  { _id , _source } ||  { ... }
	   * @param type
	   * @param entity
	   * @returns {Promise<void>}
	   */
	async createOrUpdate(entity) {
		entity = entity.forEach ? entity : [entity];
		// 批量创建;
		let body = []; 
		entity.forEach((obj) => {
			if (obj._id && obj._source) {
				body.push({ update: { _id: obj._id } });
				body.push({ doc: obj._source });
			} else{
				body.push({ create: { _id: this._genId(obj) } });
				body.push(obj);
			}
		});
		await client.bulk({
			index: this.indexName,
			type: this.defaultTypeName,
			body
		}); 
	}
	
	async remove(luceneStr) {
		if (!luceneStr) {
			return;
		}
		var result = await client.deleteByQuery({
			index: this.indexName,
			type: this.defaultTypeName,
			q: luceneStr
		});
		return result;
	}

	/**
	   * sort :  A comma-separated list of <field>:<direction> pairs
	   * demo :   { sort:"date:desc"  }  // desc , asc
	   * @param type
	   * @param page
	   * @param fields2return
	   * @param sort
	   * @returns {Promise<*>}
	   *
	   *  sort = "date:-"
	   */
	async search({ page = 1, size, luceneStr = '', fields2return, sort }) {
		var params = {
			index: this.indexName,
			from: (page - 1) * this.pageSize,
			size: size || this.pageSize,
			q: luceneStr
		};

		if (fields2return) {
			// _source: fields2return
			params._source = fields2return;
		}
		if (sort) {
			params.sort = sort;
		}

		// console.log(' search params = ', params);

		var { hits = {} } = await client.search(params);
 
		return {
			total: hits.total && hits.total.value,
			data: hits.hits || []
		};
	}
};
