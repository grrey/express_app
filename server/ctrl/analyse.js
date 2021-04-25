/**
 * 分析
 * 
 */

const esHis = require('../esModel/his');
const esStock = require('../esModel/stock');
const _ = require('lodash');
const his = require('../esModel/his');
const ana = require('./ana');
const stockCtrl = require('./stock');
const moment = require('moment')

class AnalyseCtrl {

    async analyseHis(esst, endDay = moment()) {

        var es = moment(endDay).format('YYYY-MM-DD')
        var ss = moment(endDay).subtract(60, 'days').format('YYYY-MM-DD')
        // [新 -> 旧]
        var { data: hisArr } = await esHis.search({ q: `marketCode:${ esst._id} AND k:* AND date:[${ ss} TO ${es}]`, size: 50, sort: "date:desc" });

        if (hisArr.length < 30) {
            return;
        }

        let shortHis = _.take(hisArr, 20);

        await ana.closeUp(esst, shortHis, 3);
        await ana.closeUp(esst, shortHis, 5);
        await ana.xiangti(esst, hisArr);

    }


    async judgeAna(esList) {
        let days = generateDays(10);
        let types = [
            //'xiangti',
            'close_up_3',
            //'close_up_5'
        ];
        let { data: sts } = esList || await stockCtrl.getAllList();

        let { pm_id = 0, instances = 1 } = process.env;
        if (pm_id == 0) {
            // 只在一个进程上跑

            let  tongji =  {};
            for (let j = 0; j < days.length; j++) {

                const day = days[j]; 

                for (let k = 0; k < sts.length; k++) {
                    const st = sts[k];
                    await this.analyseHis(st, day);
                }

                for (let i = 0; i < types.length; i++) {
                    const type = types[i];
                    let { total = 0, hit = 0 } = await this.checkRate(type, day);
                    tongji[ type ] = tongji[ type ] || { typetotal: 0 , typehit:0 }
                    tongji[ type ].typetotal += total 
                    tongji[ type ].typehit += hit 
                } 
            }

            for( let key in tongji ){
              let data = tongji[key]
              console.log(`${ key } analyse  end : ${ data.typehit } / ${ data.typetotal } = `, data.typehit / data.typetotal)

            }


        }
    }


    async checkRate(type, startDay) {
        let { data: sts, total } = await esStock.search({
            q: `tag:${type}`,
            size: 4000,
            fields2return: esStock.baseField
        })
        let hit = 0;
        for (let index = 0; index < sts.length; index++) {
            const st = sts[index];
            startDay = moment(startDay).format('YYYY-MM-DD');
            let endDay = moment(startDay).add(20, 'days').format('YYYY-MM-DD');

            let { data } = await esHis.search({ q: `marketCode:${ st._id} AND k:*  AND date:[ ${startDay} TO ${endDay}] `, size: 3, sort: "date:asc" })

            let c1 = _.get(data[0], '_source.k.close');
            let c2 = _.get(data[0], '_source.k.close');
            let c3 = _.get(data[0], '_source.k.close');

            let h1 = _.get(data[0], '_source.k.high');
            let h2 = _.get(data[0], '_source.k.high');
            let h3 = _.get(data[0], '_source.k.high');

            if (
                (c1 < c2 && c2 < c3) ||
                (h1 < h2 && h2 < h3)
            ) {
                hit++;
            }
        }

        return {
            total,
            hit
        }

    }
}


function generateDays(size) {
    let arr = [];
    for (let index = 0; index < size; index++) {
        arr.push(moment().subtract(index + 10 , 'days'))
    }
    
    // return arr ;

    // test ;
    return [moment().subtract(10, 'days')]
}



const analyseCtrl = new AnalyseCtrl();

module.exports = analyseCtrl;


// analyseCtrl.analyseHis( {_id:'sh600519'});

analyseCtrl.judgeAna([{_id:'sh600519'}])
