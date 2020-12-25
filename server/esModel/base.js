
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

	async  isExist( luceneStr ){
		let arr =  this.search( { luceneStr , fields2return:['_id'] })
		return  !!arr.length ;
	}

	async  getById( id  , fields2return = this.baseField ){
	
		let obj =   await client.get({
			index: this.indexName ,
			id: id ,
			_source: fields2return
		});  
		return obj ;
	}
	/**
	 * id: _id  
	 * _source:  docJsonBody 
	 * @param {*} id 
	 * @param {*} _source 
	 */
	async update( id , _source ){
		return await client.update({ 
			body:{doc: _source } , 
			id: id,
			index: this.indexName ,
			type: this.defaultTypeName,
		})
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

		for( let i = 0 ; i < entity.length ; ++i ){
			let obj = entity[i];
			if (obj._id && obj._source) {
				body.push({ update: { _id: obj._id } });
				body.push({ doc: obj._source });
			} else{
				let _id = this._genId( obj ); 
				let  isExist = await  this.isIdExist( _id ); 
				if( isExist ){
					body.push({ update: { _id } });
					body.push({ doc: obj });
				}else { 
					body.push({ create: { _id } });
					body.push(obj);
				}
			}
		} 
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

		// log(' search params = ', params);

		var { hits = {} } = await client.search(params);
 
		return {
			total: hits.total && hits.total.value,
			data: hits.hits || []
		};
	}
};
