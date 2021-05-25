/**
 *  拐弯向上
 */

const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ = require('lodash');
const his = require('../../esModel/his');
const utils = require('./utils');

module.exports = async function ztype(esst ) {

    

    let { zyhyT =[] , zycpT = [] } = esst._source ;
 
    let hy_sr_up = false , hy_lr_up = false ;
    let cp_sr_up = false , cp_lr_up = false ;

    hy_sr_up = utils.qushi({
        dataArr: zyhyT ,
        fieldPath:'zysr',
        upDirect:true ,
        size:2
    })
    
    hy_lr_up = utils.qushi({
        dataArr: zyhyT ,
        fieldPath:'zylr',
        upDirect:true ,
        size:2
    })

    cp_sr_up = utils.qushi({
        dataArr: zycpT ,
        fieldPath:'zysr',
        upDirect:true ,
        size:2
    })
    
    cp_lr_up = utils.qushi({
        dataArr: zycpT ,
        fieldPath:'zylr',
        upDirect:true ,
        size:2
    })
 

    await  esStock.upDataTag(  esst._id ,  { hy_sr_up , hy_lr_up ,cp_sr_up ,cp_lr_up })
    

}

 