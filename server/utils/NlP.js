/**
 
AppID:  16158372 
API Key : RBDNTSP2SzSfDN2i8GTHMGju
Secret Key : rE5fiUl2RUX2qrnbFzeknuZIFPqMW59C 

http://103.242.175.216:197/nlpir/


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
	console.log( 11 , result )
	let {
		sentiment = 0 ,
		positive_prob = 0 ,
		confidence = 0 ,
		negative_prob = 0
	} = result.items[ 0 ] ||{} ;
	let  s = sentiment * positive_prob - confidence * negative_prob ;
	return  s? parseInt( s*1000 ) / 1000 : 0 ;
}

module.exports = {
	NLP_sentiment : sentiment
}


sentiment('经济学的核心是经济规律；在对称经济学看来，资源的优化配置与优化再生只是经济规律的展开和具体表现，经济学的对象应该是资源优化配置与优化再生后面的经济规律与经济本质，而不是停留在资源的优化配置与优化再生层面。停留在资源的优化配置与优化再生层面的，是政治经济学而不是科学的经济学。')
.then( console.log )



