const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ = require('lodash');
const his = require('../../esModel/his');

const utils = require('./utils');


const TagName = 'xiangTi'

module.exports = async function xiangti(esst, hisArr) {
    // 15(totalDay) 天内最大的chg    > -5(mixChag) ,  是每个chg的 3倍大(chgTimes), 每个val是最大chg val的  +- 0.03 (offset)之间 ,  最后 2() 天看 突破;

    // hisArr = [新,旧 ,.... ]

    let totalDay = 15; // 15 天 
    let mixChag = 5; // -5
    let chgTimes = 3;
    let offset = 0.03;

    let judegData = hisArr[0]
    let anaData = _.slice(hisArr, 1, totalDay);

    let pchgKey = '_source.k.pchg'
    let closeKey = '_source.k.close'
    let openKey = '_source.k.open'

    let hitIndex = undefined;
    let hitData;
    // 留下第一天去判断


    let hitA = true;
    let hitB = true;
    let hitC = true;
    let hitD = true;

    for (let index = anaData.length - 1; index >= 0; index--) {
        let cDay = anaData[index]

        let pchg = _.get(cDay, pchgKey)
        let close = _.get(cDay, closeKey)
        let open = _.get(cDay, openKey)

        hitA = pchg < -mixChag;

        var avgPchg = _.meanBy(_.take(anaData, index), (v) => {
            return Math.abs(_.get(v, pchgKey));
        })

        for (let i = index - 1; i >= 0; i--) {
            let bd = anaData[i];
            let bpchg = _.get(bd, pchgKey);
            let bclose = _.get(bd, closeKey);
            let bopen = _.get(bd, openKey);

            let offset = bopen / close;
            let cffset = bclose / close;

            // hitChgTime = hitChgTime && ctime > chgTimes;
            hitB = hitB && (offset < 1.03 && offset > 0.97)
            hitC = hitC && (cffset < 1.03 && cffset > 0.97)
        }

        hitD = avgPchg < mixChag / 2;

        // if( hitA && hitB && hitC && hitD ){
        if (hitA && hitD) {
            hitIndex = index;
            hitData = cDay;
            break;
        }
    }

    var hitTag = false;
    if (hitData && _.get(judegData, closeKey) > _.get(hitData, closeKey) && hitIndex > 5) {
        hitTag = true;
    }

    await esStock.upDataTag(esst._id, TagName, hitTag)


}
