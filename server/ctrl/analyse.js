/**
 * 分析
 * 
 */

class AnalyseCtrl {
	/**
	 * 
	 * @param {*} message 
	 */
	async  pushMessage( message ){
		await esCommon.createOrUpdate(message);


		
		
	}
}

const analyseCtrl = new AnalyseCtrl();

module.exports = analyseCtrl;