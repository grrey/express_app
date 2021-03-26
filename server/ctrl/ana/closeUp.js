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
	    let hit = utils.qushi({
	        dataArr: hisArr,
	        fieldPath: '_source.k.close',
	        upDirect: true,
	        size
	    });
	    await esStock.upDataTag(esst._id, TagName, hit);

      if(hit){
        console.log("~~~~~~~~~~~~" , esst._id , TagName , hit )
      }
	}