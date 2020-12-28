
const esStock = require('../esModel/stock');
const esDimension = require('../esModel/dimension');

const esResult = require('../esModel/result');
const _ = require('lodash');

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

	// 提取行业 总市值 排行 ; 
	async  parseHy(){
		let hy = {
			name:"行业排行榜",
			hy_list:[],
		} 
		let HyResult = [] ;
		await esDimension.Iterator({
			barText:" dimension ",
			t:10,
			lucene:`type:${esDimension.HY_TYPE}`,
			dealEsEntity: async( {_source} )=>{ 
				let stockLucen = `zyhy.zygc:"${_source.name}"`;
				let hyName = _source.name ;
				let  total = 0 ;
				let  stock_num = 0;
				await esStock.Iterator({ 
					esFields:['zyhy'],
					lucene: stockLucen ,
					dealEsEntity: async( {_source} )=>{
						let  hydata =  _source.zyhy.find((hy)=>{
							return  hy.zygc == hyName ;
						})
						total +=  (hydata && hydata.zysr ) || 0 ;
						stock_num++;
					}
				});
				HyResult.push({ hy_name: hyName ,   total , stock_num })

				console.log( '行业 = ' , hyName  , total )
			}
		})
		hy.hy_list = HyResult.sort( ( a, b)=>{
			return  a.total > b.total ? -1: 1 ;
		}).splice(0,400);
		await  esResult.createOrUpdate( hy );
	}





}

const dimensionCtrl = new DimensionCtrl();
module.exports = dimensionCtrl;
exports.DimensionCtrl = DimensionCtrl;
