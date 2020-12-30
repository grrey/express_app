
const netFetch = require("../netFetch");
const esStock = require('../esModel/stock');
const esHis = require('../esModel/his');
const { NLP_sentiment } = require('../utils/NlP');
const moment = require('moment');
const his = require("../esModel/his");
class HisCtrl {
	
	// 更新历史 open.close , 值; 
	async  upDataStockHis(esObj){ 
		
		var  list = await netFetch.fetchHis( esObj );
		if( list && list.length ){
			await  esHis.createOrUpdate( list );
			let latestHis = list.pop();
			let latesHisDay  = latestHis.date.replace(/-/g , '');
 
			console.log( 'upDataStockHis:' , esObj._id , list && list.length , latesHisDay );
			
			esObj._source = { 
				latesHisDay ,
				macp: latestHis.k.macp , 
				tcap: latestHis.k.tcap , 
				macp_rate: +( latestHis.k.macp / latestHis.k.tcap ).toFixed(2) 
			} ;
			await  esStock.createOrUpdate( esObj );

		} 
		await  sleep();

	}

	async caclMaVal(esObj){
		var { data } = await esHis.search({ q:`marketCode:${ esObj._id}` , size:100,  sort:"date:desc"});
		var ma = [ 5 , 10 ,  20 , 30 , 60 ];
		var maCal = ma.map((v) => {
			return { day: v , vals:[] , total:0};
		}); 
		// reverse() ...
		var hisMa =  data.reverse().map((his) => {
			// ma ----------------
			var ma = {};
			maCal.forEach(( maDay) => {
				let close = his._source.k.close ;
				maDay.vals.push( close );
				maDay.total += close;
				if( maDay.vals.length  > maDay.day ){
					let  head =  maDay.vals.shift();
					maDay.total -= head ;
					ma[ 'ma'+maDay.day ] =   + ( (maDay.total / maDay.day ).toFixed(2) )
				}
			}); 
			// boll ----------------
			var  boll = {}; 
			


			// ----------------------
			return { _id: his._id , _source:  { ma: Object.assign( his._source.ma || {} , ma )  }  };
		});
		console.log( 'clac ma  id = ' , esObj._id )
		await esHis.createOrUpdate( hisMa );
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

			console.log(  day , dayNews )

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


hisCtrl.caclMaVal( {_id:'sh603013' , _source: { }}) 