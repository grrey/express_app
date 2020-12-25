/**
 
AppID:  16158372 
API Key : RBDNTSP2SzSfDN2i8GTHMGju
Secret Key : rE5fiUl2RUX2qrnbFzeknuZIFPqMW59C 

另一个: http://103.242.175.216:197/nlpir/


*/
 

var AipNlpClient = require("baidu-aip-sdk").nlp;
var  token = require('../../config');

var  baiduNlp = token.baiduNlp ;

// 设置APPID/AK/SK
var APP_ID = baiduNlp.APP_ID ; //  
var API_KEY = baiduNlp.API_KEY ; //  
var SECRET_KEY = baiduNlp.SECRET_KEY ; //  

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

/**
 * {
		nlp_positive: positive_prob ,
		nlp_negative: negative_prob
	}
 * @param {*} text 
 */
async function sentiment( text ){
	let result = await  client.sentimentClassify(text); 
	log( '  nlp result = ' , result )
	let {
		sentiment = 0 ,
		positive_prob = 0 ,
		confidence = 0 ,
		negative_prob = 0
	} = result.items[ 0 ] ||{} ;
	// let  s = sentiment * positive_prob - confidence * negative_prob ;
	// return  s? parseInt( s*1000 ) / 1000 : 0 ;
	return  {
		nlp_positive: positive_prob ,
		nlp_negative: negative_prob
	}
}

module.exports = {
	NLP_sentiment : sentiment
}



