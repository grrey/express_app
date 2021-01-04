/**
 * 分析
 * 
 */

const esHis = require('../esModel/his');
const esStock = require('../esModel/stock');
const _ =require('lodash'); 
const his = require('../esModel/his');

let day = 5 ; //连续几天; 
class AnalyseCtrl {

	async analyseHis (esst ){
		
		var { data } = await esHis.search({ q:`marketCode:${ esst._id} AND k:*` , size:50,  sort:"date:desc"});
		let hisArr = data.reverse(); 

		// conti_close_up_5
		await analyseCtrl.ContiCloseUp(  esst ,  _.takeRight( hisArr , 5 ) );
		
		// 

	}

	/**
	 * 连续上;
	 * @param {*} message 
	 */
	async  ContiCloseUp( esst  , hisArr ){

		const TagName = 'conti_close_up_5' 
		let c1 = _.get(  hisArr , '[0]._source.k.close' );
		let c2 = _.get(  hisArr , '[1]._source.k.close' );
		let c3 = _.get(  hisArr , '[2]._source.k.close' );
		let c4 = _.get(  hisArr , '[3]._source.k.close' );
		let c5 = _.get(  hisArr , '[4]._source.k.close' );

		console.log( 'close val=' ,c1 ,c2 ,c3 ,c4 ,c5 );

		let hit = false;
		if( c1<c2 && c2 <c3 && c3 <c4 && c4<c5 ){
			hit = true ;
		}
		await  upDataTag( esst._id , TagName , hit );
 
	}

	 /**
	  * 转折
	  * @param {*} esst 
	  * @param {*} hisArr 
	  */
	async CalcDD( esst , hisArr){
		

	}
}


/**
 * 更新tag , 
 * @param {*} _id 
 * @param {*} tagName 
 * @param {*} hit 
 */
async function upDataTag( _id ,  tagName  , hit ){
	let {_source} = await esStock.getById( _id , ['tag']);
	let { tag=[] } = _source ;
	if( tag.length ){
		tag = tag.filter((params) => {
			return params != tagName ;
		}); 
	} 
	if( hit ){
		tag.push(tagName );
		console.log( 'updata Tag' , _id , tagName ,hit )
	} 
	await  esStock.update( _id , { tag });
}
/**
 * 
 */
function groupBy(  dataArr ){
	let arr = [];

	dataArr.reduce((a ,b,) => {
		let ar = arr.pop();
		if(!ar){
			ar = [ a ];
			arr.push(ar)
		};

		let late = 


		return b ;
	})
	



}




const analyseCtrl = new AnalyseCtrl();

module.exports = analyseCtrl;


analyseCtrl.analyseHis( {_id:'sh601390'});
 

var a = [1,2,3,4,5,6,7,8];

a.reduce((a,b,c,d) => {
	console.log( '----' , a,b,c );

	return b ;
})