/**
 *   消息中心;
 * 
 * 1: 提前 10 分钟 生成 任务列表;
 * 2: 10分钟后 ,其他进出处理任务;
 * .pupTask(  esType_taskType ) ;
  
6个占位符从左到右分别代表：秒、分、时、日、月、周几
每分钟的第30秒触发： '30 * * * * *'
每小时的1分30秒触发 ：'30 1 * * * *'
每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
每周1的1点1分30秒触发 ：'30 1 1 * * 1'
每分钟的1-10秒都会触发，其它通配符依次类推: '1-10 * * * * *'

*/

const stockCtrl = require('../ctrl/stock');
const esStock = require('../esModel/stock')
var redis = require( '../utils/redis');
var  {TaskName} = require('./const'); 
const schedule = require('node-schedule');

//buiss
schedule.scheduleJob('0 20 20 1 3,6,9,12 *', async ()=>{
	stockCtrl.pubStockQueue( { taskName:  TaskName.updateBusiness  } );
}); 
// his 
schedule.scheduleJob('0 20 20 1 3,6,9,12 *', async ()=>{
	stockCtrl.pubStockQueue( { taskName:TaskName.updateHis , fields: esStock.forHisField } );
});

// news :
schedule.scheduleJob('0 20 1 * * *', async ()=>{
	stockCtrl.pubStockQueue( { taskName:TaskName.updateNews , fields: esStock.forHisField } );
});


