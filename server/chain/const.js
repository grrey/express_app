const workerFarm = require('worker-farm'); 
const schedule = require('node-schedule')
const _ = require('lodash') 
const ProgressBar = require('progress');  


const stockCtrl = require('../ctrl/stock');
const esStock = require('../esModel/stock')
const hisCtrl = require('../ctrl/his');
const analyseCtrl = require('../ctrl/analyse');
const watchCtrl = require('../ctrl/watch');


// 进程间发消息用;
const JobName = {
    updateHis: 'updateHis',
    calcMa: 'calcma',
    analyseSt: 'analyseSt',

    analyseCheck:'analyseCheck',
    analyseCheckTongji:'analyseCheckTongji' , // 分析结果.

    updateCaiwu:'updateCaiwu',

    dealSt:"dealSt"
}

const JobMap = {
    [JobName.updateHis]:  hisCtrl.upDataStockHis,
    [JobName.calcMa]: hisCtrl.caclMaVal ,
    [JobName.analyseSt]: analyseCtrl.analyseHis, 

    [JobName.analyseCheck]: analyseCtrl.judgeAna,
    [JobName.analyseCheckTongji]: analyseCtrl.judgeAnaTongji,

    [JobName.updateCaiwu]: stockCtrl.updateBusiness ,
    [JobName.dealSt]: stockCtrl.dealSelf

}


const barMap = {};
const workerSize = 6 ;

const worker = workerFarm({
    maxConcurrentWorkers: workerSize,
    onChild: function(child) {
        child.on('message', (data) => {
            if (data.owner === 'clusterjob') {
                barMap[data.JobName].tick(data.payload)
            }
        })
    }
}, require.resolve('./clusterjob'));


async function runSchedule({
    JobName,
    anaResult, 
    enable, 
    schedu,
    stockSearchParams,
    batch = 1,
    sleep: st
}) {
 
    if (!enable) {
        return;
    }
    var taskFun = async () => {

        let { data } = await stockCtrl.getAllList(stockSearchParams);

        // data =  _.take(data , 20 )

        barMap[JobName] = new ProgressBar(`${JobName} [:bar] :current/:total :percent :elapseds`, {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: data.length
        });

        let perChunk = parseInt(data.length / workerSize) + 1;
        let esStsGroup = _.chunk(data, perChunk);

        let batchResult = await Promise.all(esStsGroup.map((esSts) => {
            return new Promise((r, j) => {
                worker({ JobName, esSts, batch }, r);
            })
        }))

        // 主进程上缝隙结果. 各个子进程上的结果;
        if( anaResult ){
            JobMap[ anaResult]( batchResult )
        }

        if( process.env.NODE_ENV != 'production' ){
            workerFarm.end(worker);
            process.exit()
        }

    }

    console.log(' scheduleJob ', schedu , JobName )

    schedule.scheduleJob(schedu, taskFun);

    if ( process.env.NODE_ENV != 'production' ) {
        taskFun();
    }

}


exports.JobName = JobName;
exports.runSchedule = runSchedule;
exports.JobMap = JobMap ;