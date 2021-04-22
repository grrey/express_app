/** 
 *  
6个占位符从左到右分别代表：秒、分、时、日、月、周几
每6秒运行  "*\/6 * 9-12,13-23 * * *"
每分钟的第30秒触发： '30 * * * * *'
每小时的1分30秒触发 ：'30 1 * * * *'
每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
每周1的1点1分30秒触发 ：'30 1 1 * * 1'
每分钟的1-10秒都会触发，其它通配符依次类推: '1-10,20-30 * * * * 1-5'

 
*/

const stockCtrl = require('../ctrl/stock');
const esStock = require('../esModel/stock')
const hisCtrl = require('../ctrl/his');
const analyseCtrl = require('../ctrl/analyse');
const watchCtrl = require('../ctrl/watch');
const _ = require('lodash')

const schedule = require('node-schedule');


const StockTask = [

    // update his:
    {
        name: "upDataStockHis",
        enable: true ,
        immediate: false ,
        schedu: '0 0 1 */2 * 1-5',
        stockSearchParams: {},
        handler: reTryWarper(hisCtrl.upDataStockHis, 2, 1000)
    },
    // calc ma 
    {
        name: "caclMa",
        enable: true ,
        immediate: false ,
        schedu: '0 0 3 */2 * 1-5',
        stockSearchParams: {},
        handler: hisCtrl.caclMaVal 
    },
    // analyse .js 
    {
      name: "analyseSt",
      enable: true ,
      immediate: false ,
      schedu: '0 0 4 */2 * 1-5',
      stockSearchParams: {},
      handler: reTryWarper(analyseCtrl.analyseHis, 2)
    },
    // update F10 ;
    {
        name: "upDataStock-F10",
        enable: false ,
        immediate: false ,
        schedu: '0 0 2 * 3,6,9,12 1',
        stockSearchParams: {},
        handler: reTryWarper(stockCtrl.updeF10, 2, 1000),
        sleep: 200,
    },

    // fetch news 
    {
        name: 'upDataNews',
        enable: false ,
        immediate: false ,
        schedu: '20 1 * * *',
        stockSearchParams: {},
        handler: reTryWarper(hisCtrl.upDataNews, 2, 1000),
        sleep: 200,
    },

    // 事实监控; 2 分钟 
    {
        name: "watchCurrent",
        enable: false ,
        immediate: false  ,
        schedu: '0 */10 9-12,13-15 * * *',
        stockSearchParams: {},
        handler: reTryWarper(watchCtrl.watchCurrentVal, 2),
        batch: 10
    },
  

    //==================== script ==============
    {
      name: "dealSelf",
      enable: false ,
      immediate: false ,
      schedu: '10 6 * * 1',
      stockSearchParams: {},
      handler: reTryWarper(stockCtrl.dealSelf, 2),
      sleep: 10,
    },


];



StockTask.forEach(({
    name,
    enable,
    immediate,
    schedu,
    stockSearchParams,
    handler,
    batch = 1,
    sleep: st
}) => {
    if (!enable) {
        return;
    }

    var taskFun = async () => {
        let stockList = await stockCtrl.getProcessStList(stockSearchParams);
        console.log(' run schedult = ', name, 'stock.lenght =', stockList.length);
        let stl = stockList.length;
        while (stockList.length) {
            let esObj;
            if (1 == batch) {
                esObj = stockList.splice(0, 1)[0];
            } else {
                esObj = stockList.splice(0, batch);
            }
            // console.log(`scheduleJob ${name} ,  process =  ${ stl - stockList.length} / ${stl} `)
            await handler(esObj);
            if (st) {
                await sleep(st)
            }
        }
    }
    console.log(' scheduleJob ', schedu, name)
    schedule.scheduleJob(schedu, taskFun);

    if (immediate) {
        taskFun();
    }


});