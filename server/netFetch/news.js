/**
* day: [
{
	link: n .url ,
	title: n.title ,
	summary: n.summary ,
	date:  moment(n.showDateTime).format('YYYY-MM-DD')  // timestamp ;
	},...
]
* @param {*} param0 
*/


let rp = require('request-promise');
let iconv = require("iconv-lite");
let moment = require('moment');
let _ = require('lodash');

/**
 * his: true 历史,  false: 当天
 * @param {*} param0 
 * @param {*} his 
 */
async function fetchNews({   _source }, his) {
    let stock = _source;
    // http://f10.eastmoney.com/NewsBulletin/NewsBulletinAjax?code=SH600519
    var url = `http://f10.eastmoney.com/NewsBulletin/NewsBulletinAjax?code=${ stock.market + stock.code }`;

    var newsList = await rp({
        url,
        timeout: 4000,
        json: true,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Connection": "keep-alive",
            "Host": "emweb.securities.eastmoney.com",
        }
    });
    // 只获取 新闻摘要;
    // gsxx: 新闻摘要.
    // gggg: 公司公告  

    let todayStr = moment().format('YYYY-MM-DD');

    var news = [];
    var gsxx = _.get(newsList || {}, 'ggxx.data.items', []).map( (params) => {
		params.type = '新闻';
		return params ;
	});
    var gggg = _.get(newsList || {}, 'gggg.data.items', []).map( (params) => {
		params.type = '公告';
		return params ;
	});;

    gsxx.concat(gggg).forEach((n) => {
		let date = moment(n.showDateTime).format('YYYY-MM-DD'); 

        let nn = {
            link: n.url,
            title: n.title,
			summary: n.summary,
			type:n.type,
			infoCode: n.infoCode,
            date,
        }
        if (his) {
            news.push(nn)
        } else if (date === todayStr) {
            news.push(nn)
        }
	})
	
    console.log("get news list , ", stock.code , 'news length=' ,news.length ) ;
    return news ;
}

exports.fetchNews = fetchNews;




// (async () => {
//     var news = await fetchNews({
//         _source: {
//             market: 'SH',
//             code: 600519
//         }
//     }, false );

//     console.log(111, news)

// })()

 