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
每分钟的1-10秒都会触发，其它通配符依次类推: '1-10,20-30 * * * * 1-5'

	{
		schedu:'0 20 20 1 3,6,9,12 *' ,
		taskName: TaskName.updateBusiness ,
		pubParams: {
			fields: esStock.forHisField,
			luceneStr:null ,
		},
		consumParams:{
			handler: stockCtrl.updateBusiness ,
			retry: 2 ,
			sleep: 200 ,  // retry 时  sleep ;
		}
	},

*/

const stockCtrl = require('../ctrl/stock');
const esStock = require('../esModel/stock')
var redis = require('../utils/redis');
var redis = require( '../utils/redis');
var  {TaskName} = require('./const');
const hisCtrl = require('../ctrl/his');
const analyseCtrl = require('../ctrl/analyse');



var {
    TaskName
} = require('./const');
const schedule = require('node-schedule');


const task = [

	// ================ 数据类 ===============
	// update business  ,财报;
	{
		schedu:'0 20 20 1 3,6,9,12 *' ,
		taskName: TaskName.updateBusiness ,
		pubParams: {
			fields: esStock.forHisField,
			luceneStr:null ,
		},
		consumParams:{
			handler: stockCtrl.updateBusiness ,
			retry: 2 ,
			sleep: 200 ,
		}
	},

	// update his:
	{
		schedu:'0 20 1 * * 1-5' ,
		taskName: TaskName.updateHis ,
		pubParams: {
			fields: esStock.forHisField,
			luceneStr:null ,
		},
		consumParams:{
			handler: hisCtrl.upDataStockHis 
		}
	},
	// calc ma 
	{
		schedu:'0 20 3 * * 1-5' ,
		taskName: TaskName.calcMa ,
		pubParams: {
			fields: esStock.forHisField,
			luceneStr:null ,
		},
		consumParams:{
			handler: hisCtrl.caclMaVal 
		}
	},
	// analiz his
	{
		schedu:'0 20 3 * * 1-5' ,
		taskName: TaskName.analyseHis ,
		pubParams: {
			fields: esStock.forHisField,
			luceneStr:null ,
		},
		consumParams:{
			handler: analyseCtrl.analyseHis 
		}
	},
	{
		schedu:'0 20 3 * * 1-5' ,
		taskName: TaskName.calcMa ,
		pubParams: {
			fields: esStock.forHisField,
			luceneStr:null ,
		},
		consumParams:{
			handler: hisCtrl.caclMaVal 
		}
	},

	// fetch news 
	{
		schedu:'0 20 1 * * *' ,
		taskName: TaskName.updateNews ,
		pubParams: {},
		consumParams:{
			handler: hisCtrl.upDataNews ,
		}
	},
 
	// ================ 报表类 =============
	//监视 历史,每天; 生成报表
	{
		schedu:'0 0 3 * * 1-5' ,
		taskName: TaskName.watchValDayly ,
		pubParams: {
			luceneStr:null ,
		},
		consumParams:{
			// handler: stockCtrl.upDataNews ,
		}
	},
	// 事实监控; 2 分钟 
	{
		schedu: '0 */3 9-12,13-15 * * 1-5',
		taskName: TaskName.watchValCurrent ,
		pubParams: {
			luceneStr:null ,
		},
		consumParams:{
			// handler: stockCtrl.upDataNews ,
		}
	}, 
]



task.forEach( (t)=>{
	if( pm2id === 0 ){
		// 发布任务,
		schedule.scheduleJob( t.schedu , async () => {
			stockCtrl.pubStockQueue({
				taskName: t.taskName ,
				luceneStr: t.pubParams.luceneStr ,
				fields: t.pubParams.fields
			});
		}); 
	}
	// 处理任务;
	let { handler , retry , sleep  } = t.consumParams ;
	redis.subTask( { 
		taskName: t.taskName ,
		consumHandler: reTryWarper(  handler , retry , sleep  )
	})

});
