


/**
 * @description  'xx万' ,'xx亿' 转换成  xx , 单位亿;  'xxx%' 转换成数字;
 */
function parse2Num(str){
	if(/亿|%/.test( str )){
		return  parseFloat( str.replace(/亿|%/g , '') ) ;
	}
	if(/万/.test( str )){  
		return  parseFloat( str.replace( '万' , '') ) / 1000 ;
	}
}

module.exports = {
	parse2Num
	
}
