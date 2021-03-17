const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ = require('lodash');
const his = require('../../esModel/his');

const utils = require('./utils')

module.exports = async function xiangti (esst, hisArr) {
    // 2-5天内最大的chg > 3 ,  之后的在箱体内跳动, 当天的靠近 箱体顶部
    const TagName = 'xiang_ti';
 
    
    let hIndex ;
    let hs
    hisArr.find( (item ,i ) => {
      if( item._source.k.chg > 3 ){
        hIndex = i ;
        hs = item ;
        return true ;
      }
    })

    let inXT = false ;
    if( hIndex < 10 && hIndex > 2 ){
      inXT = true ;
      let h = hs._source.k.high;
      let l = hs._source.k.low;

 
      for(let i = 0 ; i < hIndex ; ++ i ){
        let chisk = hisArr[ i ]._source.k ;
        
        // let ch = chisk.high ;
        // let cl = chisk.low ; 

        let ch = chisk.open ;
        let cl = chisk.close ; 


        inXT = inXT && ( h > ch && h > cl && l < ch  && l < cl )
      } 
    }

    await esStock.upDataTag(esst._id, TagName, inXT );

    if(inXT){
      console.log("~~~~~~~~~~~~" , esst._id , TagName , inXT )
    }
}


 