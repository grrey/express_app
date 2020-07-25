
const esStock = require('../esModel/stock');
const esDimension = require('../esModel/dimension');


class DimensionCtrl {
	// 提取 产品/行业/板块数据 字段  ;
	async extractDimen(){
		let  bk = {} , cp = {} , hy = {} ;
		await esStock.Iterator({ 
			t:1 ,
			esFields:['SSBK' , 'zycp' ,'zyhy' ],
			dealEsEntity: async ({_id , _source })=>{
				let { SSBK=[] ,zycp = [] ,zyhy =[] }  = _source ; 
				
				SSBK.forEach(( bkname )=>{
					bk[bkname] = {
						name: bkname ,
						type: esDimension.BK_TYPE ,
					} ;
				});
				zycp.forEach(( cpObj )=>{
					cp[cpObj.zygc] = {
						name: cpObj.zygc ,
						type: esDimension.CP_TYPE ,
					} ;
				});
				zyhy.forEach(( hyObj )=>{
					hy[hyObj.zygc] = {
						name: hyObj.zygc ,
						type: esDimension.HY_TYPE
					} ;
				}); 
			}
		})
		let ds =  [  ...Object.values( bk ) , ...Object.values( cp ) , ...Object.values( hy )  ]; 
		await   esDimension.createOrUpdate( ds );


	}

}

const dimensionCtrl = new DimensionCtrl();
module.exports = dimensionCtrl;
exports.DimensionCtrl = DimensionCtrl;
