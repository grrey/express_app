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
const table = require('table')



const AnaJudgeType =  [
    'boll_b',
    'boll_m',
    'xiangTi',
    'close_up_3',
    'close_up_3_a4',
    'close_up_3_a8',
    'close_up_3_a10',
    'close_up_5',
    'close_up_5_a4',
    'close_up_5_a8',
    'close_up_5_a10',
];

class AnalyseCtrl {

    async analyseHis(esst, endDay = moment()) {

        var es = moment(endDay).format('YYYY-MM-DD')
        var ss = moment(endDay).subtract(60, 'days').format('YYYY-MM-DD')
        // [新 -> 旧]

        var { data: hisArr } = await esHis.search({ q: `marketCode:${ esst._id} AND k:* AND date:[${ ss} TO ${es}]`, size: 50, sort: "date:desc" });

        if (hisArr.length < 30) {
            return;
        }

        let shortHis = _.take(hisArr, 50);
        // console.log('analyseHis day = ' , es , ss  )

        await ana.closeUp(esst, shortHis, 3);
        await ana.closeUp(esst, shortHis, 5);

        await ana.boll(esst, shortHis );

        await ana.xiangti(esst, hisArr );

    }

    async judgeAna(stock) {
        let days = generateDays(20);
        let tags = AnaJudgeType;

        // 只在一个进程上跑

        let tongji = {};

        for (let j = 0; j < days.length; j++) {

            const day = days[j];

            await analyseCtrl.analyseHis(stock, day);

            let newSt = await esStock.getById(stock._id);

            let hitTags = _.get(newSt, '_source.tag', []);

            let startDay = day.format('YYYY-MM-DD');
            let endDay = moment(day).add(10, 'days').format('YYYY-MM-DD');

            let { data } = await esHis.search({ q: `marketCode:${ stock._id} AND k:*  AND date:[ ${startDay} TO ${endDay}] `, size: 4, sort: "date:asc" })

            let c0 = _.get(data[0], '_source.k.close'); // hit Day ;
            let c1 = _.get(data[1], '_source.k.close'); // fater 1 day 
            let c2 = _.get(data[2], '_source.k.close'); // after 2 day 
            let c3 = _.get(data[3], '_source.k.close'); // after 3 day 

            // console.log(' check DAta = '   , c1 ,c2 ,c3 , hitTags  , tags , startDay ,  data  )

            let hit1 = c0 < c1
            let hit2 = c0 < c2
            let hit3 = c0 < c3

            for (let i = 0; i < tags.length; i++ ) {
                let tag = tags[i];
                if (hitTags.includes(tag)) {

                    console.log( 'hitttt' , tag ) 

                    tongji[tag] = tongji[tag] || { total: 0, hit1: 0, hit2: 0, hit3: 0 };
                    tongji[tag].total++;
                    hit1 && tongji[tag].hit1++
                    hit2 && tongji[tag].hit2++
                    hit3 && tongji[tag].hit3++
                }

            }
        }

        return tongji;
    }

    judgeAnaTongji(tongjiArr) {
        // tongjiArr = [  [ { type:{ total ,hit } , type1:{total ,hit },, },... ] , [ {},... ] ,  [ {},... ] , [ {},... ] ]
        // console.log(111111111, tongjiArr)

        let flat = _.flatMapDeep(tongjiArr).filter((o) => {
            return Object.keys(o).length;
        }); // [  {type:{total,hit}, type1:{total,hit} ,,,}  ... ]

        let anaArr = {};
        flat = flat.forEach((ana) => {
            for (let type in ana) {
                anaArr[type] = anaArr[type] || [];
                anaArr[type].push(ana[type])
            }
        })

        // console.log(111, anaArr);

        let tableData = [
            ['type', 'total', 'rate1', 'rate2', 'rate3']
        ];
        for (let type of  AnaJudgeType ) {
            let arr = anaArr[type] || [];

            let to = 1,
                d1 = 0,
                d2 = 0,
                d3 = 0;

            arr.forEach(({ total = 0, hit1 = 0, hit2 = 0, hit3 = 0 }) => {
                to += total;
                d1 += hit1;
                d2 += hit2;
                d3 += hit3;
            })

            tableData.push([
                type,
                to,
                d1 + " = " + (d1 / to * 100).toFixed(0) + "%",
                d2 + " = " + (d2 / to * 100).toFixed(0) + "%",
                d3 + " = " + (d3 / to * 100).toFixed(0) + "%"
            ])

            // console.log(type, to, d1, d2, d3)

        }
 
        let output = table.table(tableData);
        console.log('\b\r'+ output);

    }

}


function generateDays(size) {
    let arr = [];
    for (let index = 1; index <= size; index++) {
        arr.push(moment().subtract(index * 15 , 'days'))
    }

    return arr;

    // test ;
    // return [moment().subtract(10, 'days')]
}



const analyseCtrl = new AnalyseCtrl();

module.exports = analyseCtrl;
 
