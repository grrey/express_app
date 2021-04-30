const {
    fetchF10
} = require("../netFetch/f10");
const {
    fetchBusiness
} = require("../netFetch/business");
const esStock = require('../esModel/stock');
const esHis = require('../esModel/his');
const esCommon = require('../esModel/common');
const stockListData = require('../../data/allStock');
const {
    getSM
} = require('../utils/pinyin')
require('../node_global')
class StockCtrl {
    // 获取所有列表
    async getAllList({
        luceneStr = esStock.lucene_gp,
        fields = esStock.allField
    } = {}) {
        let page = await esStock.search({
            luceneStr,
            size: 4000,
            fields2return: fields,
        });
        return page;
    }
    // 导入 数据;
    async fetchStockLlist() {
        // let list = await netFetch.fetchStock(); 
        let list = stockListData.data.map((d) => {
            d._source.marketCode = d._source.market + d._source.code;
            d._source.pinyin = getSM(d._source.name);
            return d._source;
        })
        console.log('stock length = ', list.length);
        let result = await esStock.createOrUpdate(list);
        console.log(' es result ', result)
    }
    async dealSelf(esObj) {
        // ================更新 hisData 的hy字段============; 
        // let {
        //     marketCode,
        //     hy
        // } = esObj._source; 
        // console.log( marketCode, hy ); 
        // var s = await esHis.client.updateByQuery({
        //   index: esHis.indexName,
        //   type: esHis.defaultTypeName, 
        //   q:`marketCode:${marketCode}`,
        //   body:{  
        //     script: `ctx._source.hy='${hy}'`   
        //   }
        // }); 
        // == 删除tag ;
    }
    /**
     * 4个进程 , process 内的st ;
     * @param {*} param0 
     */
    async getProcessStList({ luceneStr = esStock.lucene_gp, fields = esStock.allField } = {}) {
        let { total, data } = await this.getAllList({ luceneStr, fields });
        let { pm_id = 0, instances = 1 } = process.env;
        pm_id = +pm_id;
        instances = +instances;
        let w = Math.ceil(total / instances);
        return data.slice(pm_id * w, (pm_id + 1) * w);
    }
    // fetch 10 ;
    async updeF10(esObj) {
        let f10 = await fetchF10(esObj);
        await esStock.update(esObj._id, f10);
    }
    // 跟新经营数据 比例; 
    async updateBusiness(esObj) {
        let bus = await fetchBusiness(esObj);
        console.log( 111 , JSON.stringify( bus ) )
        await esStock.update(esObj._id, bus);
    }
}
var stockCtrl = new StockCtrl();
module.exports = stockCtrl;


// stockCtrl.watchCurrentVal( [{_source:{ marketCode:"sh600311"}}] )
// stockCtrl.getProcessStList({}).then(  (params) => {
// 	console.log('rrrr' , params )
// } )
// stockCtrl.getAllList({}).then((data) => { 
// 	var d = data.data.map((d) => {
// 		return d._source ;
// 	})
// 	console.log( JSON.stringify( d ))
// })
// stockCtrl.dealSelf({
//     _source: {
//         marketCode: "sh600311",
//         hy: "hhhhhx1"
//     }
// });
