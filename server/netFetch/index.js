/**
 * 
 */
let rp = require('request-promise');

const dfcfw = require('./dfcfw'); 
// const n163 = require('./n163')
const moment = require("moment");

class NetFetch {
    async fetchStock() {
        let list = await dfcfw.fetchStock();
        return list;
    }
   

 
    // 抓取 产品 经营数据; 历史报表
    async fetchBusiness(esobj) {
        let result = await dfcfw.fetchBusiness(esobj);
        return result;
    }
    // 抓取新闻; [  ]
    async fetchNews(esStock) {
        let newsList = await dfcfw.fetchNews(esStock);
       console.log('fetch news', esStock, newsList)
        return newsList;
    }
 

}


module.exports = new NetFetch();




// rp('http://hq.sinajs.cn/list=sh600000,sh600004').then((d) => {
//     var arr = d.split(';');
//     var result = [];
//     arr = arr.map((cur) => {
//         if (cur && cur.length > 10) {
//             let data = cur.split('=')[1].split(',');
//            console.log(1111, data)
//         }
//     })
// })