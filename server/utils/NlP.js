/**
 
AppID:  16158372 
API Key : RBDNTSP2SzSfDN2i8GTHMGju
Secret Key : rE5fiUl2RUX2qrnbFzeknuZIFPqMW59C 

*/
 

var AipNlpClient = require("baidu-aip-sdk").nlp;
var token = require('../../token.json');

var  baiduNlp = token.baiduNlp ;

// 设置APPID/AK/SK
var APP_ID = baiduNlp.APP_ID ; //  
var API_KEY = baiduNlp.API_KEY ; //  
var SECRET_KEY = baiduNlp.SECRET_KEY ; //  

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

/**
	result =  {
		"text":"苹果是一家伟大的公司",
		"items":[
			{
				"sentiment":2,    //表示情感极性分类结果
				"confidence":0.40, //表示分类的置信度
				"positive_prob":0.73, //表示属于积极类别的概率
				"negative_prob":0.27  //表示属于消极类别的概率
			}
		]
	}
 */
async function sentiment( text ){
	let result = await  client.sentimentClassify(text); 
	let {
		sentiment = 0 ,
		positive_prob = 0 ,
		confidence = 0 ,
		negative_prob = 0
	} = result.items[ 0 ] ||{} ;
	let  s = sentiment * positive_prob - confidence * negative_prob ;
	return  s? parseInt( s*1000 ) / 1000 : 0 ;
}



// sentiment('主观观点信息的文本进行情感极性类别（积极、消极、中性）的判断，并给出相应的置信度。')

module.exports = {
	NLP_sentiment : sentiment
}