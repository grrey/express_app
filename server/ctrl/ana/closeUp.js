	/**
	 * 连续上;
	 * @param {*} message 
	 */


const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ =require('lodash'); 
const his = require('../../esModel/his');


module.exports =	async function ContiCloseUp( esst  , hisArr  , size = 5 ){

		const TagName = 'conti_close_up_' + size ;
    let hit = true ;
    let vals = {} ;
    
    hisArr.reverse();

    for(let i =0 ; i < size ; ++i ){
      vals[i] = _.get( hisArr , `[${i}]._source.k.close` );
      if( i  > 0 ){ 
        hit =  hit && ( vals[i] < vals[ i - 1 ]  )
      } 
    }
		await  esStock.upDataTag( esst._id , TagName , hit );
 
	}