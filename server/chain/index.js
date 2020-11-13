/**
 *   消息中心;
 * 
 * 1: 提前 10 分钟 生成 任务列表;
 * 2: 10分钟后 ,其他进出处理任务;
 * .pupTask(  esType_taskType ) ;
 * 
 * 
 */

const stockCtrl = require('../ctrl/stock');
var redis = require( '../utils/redis')
 

if( 0 == global.pm2id ){
	log('ononon mm')
	process.on('message', function(m) {
		log('message ' , m ); 
	});
}else {

}

const TaskName = {
	updataF:'updataF', // 
}


var  taskConf  = [
	{
		taskName: TaskName.updataF ,
		taskHandler: stockCtrl.handF
	} 
];


//消费, 在所有进程
taskConf.forEach(( conf )=>{ 
	// 收到开始消息后, 处理队列;
	redis.subTask( conf )
})


// 成产, 在 pm2id = 0 的进程;