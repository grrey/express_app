
const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esHis = require('../esModel/his');
const { NLP_sentiment } = require('../utils/NlP');
const moment = require('moment');
class HisCtrl {
	
	// 更新历史 open.close , 值; 
	async  upDataStockHis(esObj){ 
		
		var  list = await netFetch.fetchHis( esObj );
		if( list && list.length ){
			await  esHis.createOrUpdate( list );
			let latesHisDay  = list.pop().date.replace(/-/g , '');
 
			log( 'upDataStockHis:' , esObj , list && list.length , latesHisDay );
			
			esObj._source = { latesHisDay  } ; 
			await  esStock.createOrUpdate( esObj );


		} 
		await  sleep();

	}

	// 抓取新闻; 
	async  upDataNews( esstock ){
 
		var  newsList = await netFetch.fetchNews( esstock  ); // [ {} , ];
		// 值抓取 当天的 ; 
		if( true ){
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
			var total_nlp_positive = 0 ; 
			var total_nlp_negative= 0 ; 

			await  Iterator( dayNews , async ( news )=>{ 
				let   resp   = await NLP_sentiment( news.summary ); ///{sentiment:up , confidence:down }
				Object.assign( news , resp );
				await sleep(200); 
				total_nlp_positive+= resp.nlp_positive;
				total_nlp_negative+= resp.nlp_negative;

			});
  
			await sleep(1000); 

			log(  day , dayNews )

			await  esHis.createOrUpdate( {
				marketCode: esstock._source.marketCode ,
				date: day ,
				news: {
					total_nlp_positive,
					total_nlp_negative,
					list:dayNews
				}
			})
			
		}); 
	}
	
}

const hisCtrl = new HisCtrl();

module.exports = hisCtrl;
