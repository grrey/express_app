
var redis = require( '../utils/redis');
var  {TaskName} = require('./const'); 
const stockCtrl = require('../ctrl/stock');
const hisCtrl = require('../ctrl/his');

 

// 所有进程上的消费 
var  taskConsumConf  = [
	{
		taskName: TaskName.updateBusiness ,
		consumHandler: reTryWarper( stockCtrl.updateBusiness , 2 )  
	},
	{
		taskName: TaskName.updateHis ,
		consumHandler: reTryWarper( hisCtrl.upDataStockHis , 2 )  
	},
	{
		taskName: TaskName.updateNews ,
		consumHandler: reTryWarper( hisCtrl.upDataNews , 2 )  
	}
	
]; 

//消费, 在所有进程
taskConsumConf.forEach(( {taskName , consumHandler } )=>{ 
	// 收到开始消息后, 处理队列;
	redis.subTask( { taskName , consumHandler } )
})