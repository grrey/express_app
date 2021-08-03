const { fetchF10 } = require("../netFetch/f10");
const { fetchBusiness } = require("../netFetch/business");
const esStock = require('../esModel/stock');
const esHis = require('../esModel/his');
const esCommon = require('../esModel/common');
const stockListData = require('../../data/allStock');
const { getSM } = require('../utils/pinyin')
const utils = require('../utils')
require('../node_global');

 
class StockCtrl {
    // 获取所有列表
    async getAllList({
        luceneStr = esStock.lucene_gp,
        fields = esStock.allField
    } = {}) {
        let page = await esStock.search({
            luceneStr,
            size: 6000,
            fields2return: fields,
        });
        return page;
    }
    // 导入 数据; 
    async fetchStockLlist() {
        // let list = await netFetch.fetchStock(); 
        let list = stockListData.data.map((d) => {
            // d._source.code = d._source.market + d._source.code;
            // d._source.pinyin = getSM(d._source.name);
            // return d._source;
            d.pinyin = getSM( d.name);
            d.market =  utils.st.getMarket(d.code)
            return d ;
        })
        console.log('stock length = ', list.length);
        let result = await esStock.createOrUpdate(list);
        console.log(' es result ', result)
    }
    async dealSelf(esObj) {

        // console.log(111, esObj._id   )

        // ================更新 hisData 的hy字段============; 
 
        try {
            await esStock.update( esObj._id ,  { tag:[ ]   })

        }catch(e){
            console.log(111 , e );
        }

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
        console.log('ssss' , f10 )
        await esStock.update(esObj._id, f10);
    }
    // 跟新经营数据 比例; 
    async updateCaiwu(esObj) {
        let bus = await fetchBusiness(esObj);
        console.log(111 , JSON.stringify( bus ) )
        await esStock.update(esObj._id, bus);
        await new Promise((r, j) => {
            setTimeout(r, 200);
        })
    }
}
var stockCtrl = new StockCtrl();
module.exports = stockCtrl;

// 导入数据
// stockCtrl.fetchStockLlist();

// let stobj = { _id:'600827', _source: {market:"sh" , code:'600827'}}


//test 
// stockCtrl.updateCaiwu( stobj )