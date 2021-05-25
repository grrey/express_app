/**
 * 连续上; 的 V type ;
 * @param {*} message 
 */


const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ = require('lodash');
const his = require('../../esModel/his');

const utils = require('./utils')

module.exports = async function closeUp(esst, hisArr) {

    // hisArr = [ 新, 旧, ... ]
    const tagNameB = 'boll_b';
    const tagNameM = 'boll_m';

    let hitB = false;
    let hitM = false;

    let bf1   = hisArr[0];
    let bf2   = hisArr[1];
    let bf3   = hisArr[2];
    let bf4   = hisArr[3];

    let bo1 = bf1._source.boll ; // { b, u ,m }
    let bo2 = bf2._source.boll ;
    let bo3 = bf3._source.boll ;
    let bo4 = bf4._source.boll ;

    let c1 = bf1._source.k.close ;   // val
    let c2 = bf2._source.k.close  ;
    let c3 = bf3._source.k.close  ;
    let c4 = bf4._source.k.close  ;

    if( bo4.b <= bo1.b &&   ( c1 > bo1.b &&   c4<=bo4.b  )  ){
        hitB = true ;
    }

    if( bo4.m <= bo1.m &&   ( c1 > bo1.m &&   c4<=bo4.m  )  ){
        hitM = true ;
    }
 

    await esStock.upDataTag(esst._id, tagNameB,  hitB )
    await esStock.upDataTag(esst._id, tagNameM , hitM )
    
    // await esStock.upDataTag(esst._id, TagName + '_a4', avg > 5)
    // await esStock.upDataTag(esst._id, TagName + '_a8', avg > 8)
    // await esStock.upDataTag(esst._id, TagName + '_a10', avg >= 10)


}
