/**
 * elastic 文档: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/16.x/api-reference.html
 * lucence 文档: https://lucene.apache.org/core/3_0_3/queryparsersyntax.html#Range%20Searches
 * 
 *  字段是否存在用:   field:*  去过滤 
 * 
 */
const esHost = 'http://localhost:9200';

const { Client } = require('elasticsearch');
const client = new Client({ node: esHost });

module.exports = class esBase {
  constructor(){
    this.client = client ;
  }
  
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
		if(!entity.length){
			return ;
		}
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
	   * sort : demo { sort:"date:desc"  }  // desc , asc
	   * @param type
	   * @param page
	   * @param fields2return
	   * @param sort
	   * @returns {Promise<*>}
	   * 
	   */
	async search({ page = 1, size, luceneStr = '', q ="", fields2return, sort }) {
		var params = {
			index: this.indexName,
			from: (page - 1) * this.pageSize,
			size: size || this.pageSize,
			q: luceneStr || q 
		};

		if (fields2return) {
			// _source: fields2return
			params._source = fields2return;
		}
		if (sort) {
			params.sort = sort;
		}

		// if( this.indexName == 'stock'){
		// 	let subQ = " latesHisDay:>20201228  AND  macp:>50 "
		// 	params.q = ( params.q ? ( params.q +" AND " ): "" ) + subQ ; // 有历史的 stock ;
		// }

		console.log('search params = ',  JSON.stringify(params) );

		var { hits = {} } = await client.search(params);
 
		return {
			total: hits.total && hits.total.value,
			data: hits.hits || []
		};
	}
};
