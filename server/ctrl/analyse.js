/**
 * 分析
 * 
 */

const esHis = require('../esModel/his');
const esStock = require('../esModel/stock');
const _ =require('lodash'); 
const his = require('../esModel/his');
const ana = require('./ana');
  
class AnalyseCtrl {

	async analyseHis (esst ){
		
    // [新 -> 旧]
		var { data:hisArr } = await esHis.search({ q:`marketCode:${ esst._id} AND k:*` , size:50,  sort:"date:desc"});
 
    if( hisArr.length < 30 ){
      return ;
    }
    
    let shortHis = _.take( hisArr , 20) ;
 
    await  ana.closeUp(  esst ,  shortHis ,  3 );
    await  ana.closeUp(  esst ,  shortHis ,  5 ); 
  
    await ana.xiangti( esst , hisArr  );


	}
  

  
}


/**
 *  正反 分向
 */
function groupBy(  dataArr  , path ){
	let arr = [];
	// a,b,c,d,new 
	function compare( a , b ){
		if( a == null || b == null ){
			return true ;
		}
		if( a * b >= 0 ){
			return true ;
		}
		if( Math.abs( b/a) < 0.2){
			return true 
		}
		return false ;
	}

	dataArr.reduce((a ,b,) => {
		let bv = b ; 
		
		let bool = compare( _.get( a , path , null ) , _.get( b , path , null ) ) ;

		if( bool ){
			// 同方
			let ar = arr.pop();
			if(!ar){
				ar = [ bv ];
			}else {
				ar.push(bv)
			}
			arr.push(ar);
		}else {
			// 反向;
			arr.push([ bv ]);
		} 
		return b ;
	}) 
	return arr ;
}


function smooth( dataArr ,  { path='_source.k.chg' , size  = 4 } ){
	dataArr = dataArr.map( (o,i) => {
		if( i > size ){
			let total = 0 ;
			for(let j = 0 ; j < size ; ++j){ 
				total += _.get( dataArr[ i - j ] , path , 0 )
			}
			o.chg_smooth = +( total/size ).toFixed(2);
			return o ;
		}else{
			return o 
		}
	})
	return dataArr
}

 
const analyseCtrl = new AnalyseCtrl();

module.exports = analyseCtrl;





analyseCtrl.analyseHis( {_id:'sh600519'});

