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
		
		var { data } = await esHis.search({ q:`marketCode:${ esst._id} AND k:*` , size:100,  sort:"date:desc"});


		// conti_close_up_X 指标
		await  ana.closeUp(  esst ,  _.takeRight( hisArr , 10 ) ,  5  );

		 
		let  arr = groupBy( hisArr  , '_source.k.chg' ); 
		arr.forEach((params) => {
			// console.log( JSON.stringify( params[0]._id ))
		})

		let  arr1 = smooth( hisArr ,  {path:'_source.k.chg'  , size:20 });
		let arr2 = groupBy( hisArr  , 'chg_smooth' ); 
		console.log('------ ssssss --------')
		arr2.forEach((params) => {
			console.log( JSON.stringify( params[0]._id ))
		})


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
		await  esStock.upDataTag( esst._id , TagName , hit );
 
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





// analyseCtrl.analyseHis( {_id:'sh600332'});

