
const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esHis = require('../esModel/his');
const { NLP_sentiment } = require('../utils/NlP');
const moment = require('moment');
class HisCtrl {
	
	// 更新历史 open.close , 值; 
	async  upDataAllStockHis(){ 
		await esStock.Iterator({
			t:200 ,
			dealEsEntity: async ( esObj ) => {
				var  list = await netFetch.fetchHis( esObj );
				if( list && list.length ){
					await  esHis.createOrUpdate( list );
					esObj._source.latesHisDay = list.pop().date.replace(/-/g , '') ; 
					await  esStock.createOrUpdate( esObj );
				}
			}
		}) 
	} 

	// 抓取新闻; 
	async  upDataAlNews(){
		await esStock.Iterator({
			t:1000 ,
			dealEsEntity: async ( esstock ) => {
				var  newsList = await netFetch.fetchNews( esstock  ); // [ {} , ];
				// 值抓取 当天的 ; 
				if( false ){
					let todayStr =  moment().format('YYYY-MM-DD');
					newsList = newsList.filter((n)=>{
						return  n.date == todayStr ;
					})
				} 

				var NewsByDay = _.groupBy( newsList ,  function(item){
					return  moment(item.date).format('YYYY-MM-DD')
				})  
				var dateList=  Object.keys( NewsByDay );
				
				await Iterator( dateList , async ( day , i )=>{
					let  dayNews =  NewsByDay[ day ]; 
					var totalScore = 0 ; 

					await  Iterator( dayNews , async ( news )=>{ 
						let  score   = await NLP_sentiment( news.summary ); ///{sentiment:up , confidence:down }
						news.score  = score  ;  
						totalScore += score ; 
					});
					// console.log( '    ----'  , esstock._source.marketCode , day )
					await  esHis.createOrUpdate( {
						marketCode:  esstock._source.marketCode ,
						date: day ,
						news: {
							score :totalScore ,
							list:dayNews
						}
					})
					
				});
			}
		}) 
	}
	
}

const hisCtrl = new HisCtrl();
module.exports = hisCtrl;
exports.HisCtrl = HisCtrl;

  