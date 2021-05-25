const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ = require('lodash');
const his = require('../../esModel/his');

const utils = require('./utils');


const TagName = 'xiangTi'

module.exports = async function xiangti(esst, hisArr) {
    
    let hitTag = false ;

    // console.log( 111 , hisArr )

    // hisArr = [新,旧 ,.... ]

    let pchgKey = '_source.k.pchg'
    let closeKey = '_source.k.close'
    let openKey = '_source.k.open'
     
    let d0 = hisArr[0];
    let d1 = hisArr[1];
    let d2 = hisArr[2];
    let d3 = hisArr[3];

    let  pchg0 =  _.get( d0  , pchgKey );
    let  pchg1 =  _.get( d1  , pchgKey );
    let  pchg2 =  _.get( d2  , pchgKey );
    let  pchg3 =  _.get( d3  , pchgKey );

    let  c0 =  _.get( d0  , closeKey );
    let  c1 =  _.get( d1  , closeKey );
    let  c2 =  _.get( d2  , closeKey );
    let  c3 =  _.get( d3  , closeKey );


    // if( pchg1 < -4  && pchg0 >0.5 && pchg0 <2  &&   pchg2 < 1 & pchg3 < 1  ){
    if( pchg1 < -5  && pchg0 >0.5 && pchg0 <2  && c0 > c1  ){
        console.log(  d0 , d1 ,d2,d3)
        hitTag = true ;
    }


    await esStock.upDataTag(esst._id, TagName, hitTag)


}
