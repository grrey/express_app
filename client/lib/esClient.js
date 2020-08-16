import  his  from '../../server/esModel/his'
import  stock  from '../../server/esModel/stock'
import  dimension  from '../../server/esModel/dimension'
 

function tr( obj ){
	if( obj._source){
		return  Object.assign( { _id: obj._id} , obj._source)
	}
	return obj ;
}

export default {
	install: function(vue , options ){
		vue.prototype.$esStock = stock ;
		vue.prototype.$esHis = his ;
		vue.prototype.$esDime = dimension ;

		vue.prototype.$transEsObj = function( arr ){
			
			if( arr.forEach){
				return arr.map( tr );
			}
			return tr( arr )
		}
	}
}