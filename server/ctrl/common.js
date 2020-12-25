
const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esCommon = require('../esModel/common');
const esHis = require('../esModel/his');
const { NLP_sentiment } = require('../utils/NlP');
const moment = require('moment');

class CommonCtrl {
	async  pushMessage( message ){
		await esCommon.createOrUpdate(message);
		
	}
}

const commonCtrl = new CommonCtrl();

module.exports = CommonCtrl;
