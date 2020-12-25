/**
 * 
 */
let rp = require('request-promise');

const dfcfw = require('./dfcfw');
const tushare = require('./tushare');

const moment = require("moment");

class NetFetch {
    async fetchStock() {
        let list = await dfcfw.fetchStock();
        return list;
    }
    // 抓取f10
    async fetchF10(esStock) {
        let result = await dfcfw.fetchF10(esStock);
        return result;
    }

    // 抓取 历史交易
    async fetchHis({
        _id,
        _source
    }) {
        let startDay;
        if (_source.latesHisDay) { //latesHisDay
            startDay = moment(_source.latesHisDay).add(1, 'days').format('YYYYMMDD');
        } else {
            startDay = _source.latesHisDay || (moment().subtract(600, 'days').format('YYYYMMDD'));
        }
        let hislist = await tushare.fetchHis({
            _id,
            _source
        }, startDay);
        return hislist
    }

    // 抓取 经营数据; 历史报表
    async fetchBusiness(esobj) {
        let result = await dfcfw.fetchBusiness(esobj);
        return result;
    }
    // 抓取新闻; [  ]
    async fetchNews(esStock) {
        let newsList = await dfcfw.fetchNews(esStock);
        log('fetch news', esStock, newsList)
        return newsList;
    }
 
    /**
     * 实时交易数据 , 批量
     * @param {
      	0：”大秦铁路”，股票名字；
    	1：”27.55″，今日开盘价；
    	2：”27.25″，昨日收盘价；
    	3：”26.91″，当前价格；
    	4：”27.55″，今日最高价；
    	5：”26.20″，今日最低价；
    	6：”26.91″，竞买价，即“买一”报价；
    	7：”26.92″，竞卖价，即“卖一”报价；
    	8：”22114263″，成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百；
    	9：”589824680″，成交金额，单位为“元”，为了一目了然，通常以“万元”为成交金额的单位，所以通常把该值除以一万；
    	10：”4695″，“买一”申请4695股，即47手；
    	11：”26.91″，“买一”报价；
    	12：”57590″，“买二”
    	13：”26.90″，“买二”
    	14：”14700″，“买三”
    	15：”26.89″，“买三”
    	16：”14300″，“买四”
    	17：”26.88″，“买四”
    	18：”15100″，“买五”
    	19：”26.87″，“买五”
    	20：”3100″，“卖一”申报3100股，即31手；
    	21：”26.92″，“卖一”报价
    	(22, 23), (24, 25), (26,27), (28, 29)分别为“卖二”至“卖四的情况”
    	30：”2008-01-11″，日期；
    	31：”15:05:32″，时间；
    }
    result = {  { _id , curr ,high , low }  , ...  }
    */
    async fetchCurrentVal(esStocks = []) {
        var idArr = esStocks.map((es) => {
            return es._source.marketCode;
        });
        var params = idArr.join(',');

        var data = await rp('http://hq.sinajs.cn/list=' + params);
        data = data.split(';');

        var result = [];
        data.map((cur, i) => {
            if (cur && cur.length > 10) {
                let currData = cur.split('=')[1].split(',');

                result.push({
                    entity: idArr[i],
					day: currData[30],
					
                    curr: currData[3],
                    high: currData[4],
                    low: currData[5],
                });
            }
        })
        return result;
    }

}


module.exports = new NetFetch();



// rp('http://hq.sinajs.cn/list=sh600000,sh600004').then((d) => {
//     var arr = d.split(';');
//     var result = [];
//     arr = arr.map((cur) => {
//         if (cur && cur.length > 10) {
//             let data = cur.split('=')[1].split(',');
//             log(1111, data)
//         }
//     })
// })