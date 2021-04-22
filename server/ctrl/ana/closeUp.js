	/**
	 * 连续上; 的 V type ;
	 * @param {*} message 
	 */


	const esHis = require('../../esModel/his');
	const esStock = require('../../esModel/stock');
	const _ = require('lodash');
	const his = require('../../esModel/his');

	const utils = require('./utils')

	module.exports = async function closeUp(esst, hisArr, size = 5) {

       
	    const TagName = 'close_up_' + size;

      let hit = true ;
      hisArr.forEach((v , i) => {
        if( i < size && i > 0 ){
          let b = _.get( v , '_source.k.close')
          let a = _.get(  hisArr[ i -1 ] , '_source.k.close')
          hit =  hit && ( a > b )
        }
      });

      let  avg =  _.meanBy(  _.take( hisArr , size ) , (v) => {
        let  s =  _.get( v , '_source.k.pchg' ) 
        return s 
      })
 
	    await esStock.upDataTag(esst._id, TagName, hit)
      await esStock.upDataTag(esst._id, TagName +'_a4', avg > 5 )
      await esStock.upDataTag(esst._id, TagName +'_a8', avg > 8 )
      await esStock.upDataTag(esst._id, TagName +'_a10',avg >= 10 )
 

	}