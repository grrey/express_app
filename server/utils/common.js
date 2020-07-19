


/**
 * @description  'xx万' ,'xx亿' 转换成  xx , 单位亿;  'xxx%' 转换成数字;
 */
function parse2Num(str){
	 
	let num  =  parseFloat( str ) || 0  ;  
	if(/万/.test( str )){  
		num =  num/1000 ; 
	} 
	return  + ( num.toFixed(2) ) ;
}

module.exports = {
	parse2Num
	
}

 
