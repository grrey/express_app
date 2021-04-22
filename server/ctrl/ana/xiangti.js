const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ = require('lodash');
const his = require('../../esModel/his');

const utils = require('./utils');


const TagName = 'xiangTi'

module.exports = async function xiangti (esst, hisArr) {
    // 15(totalDay) 天内最大的chg    > -5(mixChag) ,  是每个chg的 3倍大(chgTimes), 每个val是最大chg val的  +- 0.03 (offset)之间 ,  最后 2() 天看 突破;

    // hisArr = [新,旧 ,.... ]

    let  totalDay = 15 ;  // 15 天
    let  judgeDay = 2 ;

    let  mixChag = 5 ;  // -5
    let  chgTimes = 3 ;
    let  offset = 0.03;

    let judgeData =  _.slice( hisArr , 0 ,2 );
    let anaData = _.slice(hisArr  ,2 , totalDay );
 
    let chgKey= '_source.k.chg'
    let closeKey = '_source.k.close'
    let openKey = '_source.k.open'
 
    let hitIndex = undefined ;
    let hitData ;

    for (let index = anaData.length -1 ;  index >=0 ; index--) {
      let  cDay = anaData[index]

      let  chg = _.get( cDay , chgKey )
      let  close = _.get( cDay , closeKey)
      let  open = _.get( cDay , openKey)

      let hitMinChg = chg < -mixChag ;
      let hitChgTime = true ; 
      let hitToffset  = true ;
      let hitBoffset  = true ;

      for (let i = index -1 ; i>=0  ; i-- ) {
        let  bd = anaData[ i ];
        let  bchg = _.get( bd ,chgKey);
        let  bclose = _.get(bd , closeKey); 
        let  bopen = _.get(bd , openKey); 
 
        let ctime =  Math.abs( chg / bchg );
        let Toffset =   Math.max( bclose ,bopen) / close ;
        let Boffset =   Math.min( bclose ,bopen) / close ;

        hitMinChg = hitMinChg && chg < bchg ; 
        hitChgTime = hitChgTime && ctime > chgTimes;
        hitToffset = hitToffset &&  ( Toffset <  ( 100 - mixChag*0.5 )/100 )
        hitBoffset = hitBoffset &&  ( Boffset > ( 100 - mixChag*1.5 )/100  )
        
        if( hitMinChg &&hitChgTime && hitToffset && hitBoffset  ){
          hitIndex = index;
          hitData = cDay;
          break;
        }
      }  
    }
    await esStock.upDataTag(esst._id,  TagName , !!hitData    )

    // await esStock.upDataTag(esst._id,  !!hitData ,  TagName , {
    //   hit: !!hitData ,
    //   date: _.get( hitData , '_source.date' )
    // });
     

    if(!!hitData){
      console.log("~~~~~~~~~~~~" , esst._id , TagName )
    }
}


 
 