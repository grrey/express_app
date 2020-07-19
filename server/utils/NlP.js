/**
 
AppID:  16158372 
API Key : RBDNTSP2SzSfDN2i8GTHMGju
Secret Key : rE5fiUl2RUX2qrnbFzeknuZIFPqMW59C 

*/
 

var AipNlpClient = require("baidu-aip-sdk").nlp;
var token = require('../../token.json')

// 设置APPID/AK/SK
var APP_ID =token.APP_ID ; //  
var API_KEY = token.API_KEY ; //  
var SECRET_KEY = token.SECRET_KEY ; //  

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
	console.log( 2222 , result );
}



sentiment('主观观点信息的文本进行情感极性类别（积极、消极、中性）的判断，并给出相应的置信度。')

module.exports = {

}