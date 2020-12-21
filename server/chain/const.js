/**
 * 任务队列名称: 
 * 1: redis pub /sub 用到;
 */

exports.TaskName = {
	updateBusiness:'queue_updateBusiness', // 
	updateHis:'queue_updateHis',
	updateNews:'queue_updateNews',

	watchValDayly:'queue_watchHisVal' , // 历史区间.
	watchValCurrent:'queue_watchCurrentVal' , //划定的界限;

}

exports.TableName = {
	valDayly: "valDayly" ,
	valMinutes: "valMinutes" ,

}




