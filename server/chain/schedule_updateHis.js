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

const { JobName  ,  runSchedule  } = require('./const') 

const maTask = {
    JobName: JobName.updateHis,
    enable: true,
    immediate: false,
    schedu: '0 0 1 */2 * 1-5',
    stockSearchParams: {},
}


runSchedule( maTask )