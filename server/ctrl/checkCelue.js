/**
 * 检查策略 , 
 * 每个方案,在当前, 半年前 测试各测试一次; 
 * 
 */
var stockCtrl = require('./stock');
var  moment = require('moment');
 
class CheckCeLue {
    async check() {
        let {
            total,
            data
        } = await stockCtrl.getAllList({
            luceneStr,
            fields
        });

    }

    async runCeLue( esObj , asyncFn ) { 
        data.asyncForEach(async (st) => {
            let result = await asyncFn(st);


        })
    }
}

const checkCeLue = new CheckCeLue();
module.exports = checkCeLue;



async function yingXian( st ){
  let data =  123
}



