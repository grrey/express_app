const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ = require('lodash');
const his = require('../../esModel/his');

const utils = require('./utils')

module.exports = async function xiangti (esst, hisArr) {
    // 15(totalDay) 天内最大的chg ,chg > -5(mixChag) ,  是每个chg的 3倍大(chgTimes), 每个val是最大chg val的  +- 0.03 (offset)之间 ,  最后 2() 天看 突破;

    // hisArr = [新,旧 ,.... ]

    let  totalDay = 15 ;  // 15 天
    let  mixChag = -5 ;
    let  chgTimes = 3 ;
    let  offset = 0.03;
    let  judgeDay = 2 ;

    let judgeData =  _.slice( hisArr , 0 ,2 );
    let anaData = _.slice(hisArr  ,2 , totalDay );
 

    let hit  = false ;
    let maxDay =  _.minBy( anaData , (o) => {
      let d = _.get( o , '_source.k.chg' );
      let d1 = _.get( o , '_source.date' );

      console.log('xxx' ,d1,d )
        return  d 
    });




    for (let index = anaData.length -1;  index >=0 ; index--) {
      let lastDay = anaData[index];


      const element = anaData[index];
      
    }
     


    console.log( 'xxx', maxDay , judgeDay ,anaData )



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


 
 