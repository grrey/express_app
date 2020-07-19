var rp = require("request-promise");
var moment = require("moment");
var Iconv = require("iconv-lite")

/*
1: getStockHis 获取历史数据;
 
雪球网的数据格式是json字符串

https://xueqiu.com/stock/forchartk/stocklist.json?symbol=代码&period=1day&
        type=复权还是不复权&begin=开始时间时间戳&end=结束时间时间戳&_=结束时间时间戳

地址参数：
    上海股票在编号前加SH，深圳股票，在编号前加SZ，
    period代表的时间间隔，复权不复权使用after和before表示，
    开始时间和结束时间要用 时间戳表示。

注意访问下面的网址前要先点击https://xueqiu.com/，进入一次官网，然后在http头中才能记录你的数据，然后才能通过下面的网址获取数据。

https://xueqiu.com/stock/forchartk/stocklist.json?symbol=SH600756&period=1day&type=before&begin=1478620800000&end=1510126200000&_=1510126200000


 */
    /** 爬取历史数据 */
    async  function getHisData(stock) {
        stock = stock._source ;
        var end = moment().format('YYYYMMDD');
        var start = ""; 
        if ( !stock.latestHis) {
            // start = moment().subtract(365, 'days').format('YYYYMMDD');
            start = moment().subtract( 600, 'days').format('YYYYMMDD');
        } else {
            // latestHis ='2018-04-11'
            start = moment(stock.latestHis).format('YYYYMMDD');
        }
        if (start == end) {
            return {his: []}
        }

        var yahooCode = (stock.market == 'sh' ? 'SH' : 'SZ') + stock.code;

        // sh600010  , sh601208    sz002494
        // http://quotes.money.163.com/service/chddata.html?code=000024&start=20171227&end=20190511&fields=TCLOSE;HIGH;LOW;TOPEN;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP

        var url = `http://quotes.money.163.com/service/chddata.html?` +
            `code=${yahooCode}&start=${start}&end=${end}`
            + `&fields=TCLOSE;HIGH;LOW;TOPEN;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP`;


		start = moment().valueOf();
		end = moment().subtract(10 , 'days').valueOf();

		url = `https://xueqiu.com/stock/forchartk/stocklist.json?symbol=SH600756&period=1day&type=before&begin=${start}&end=${end}`



		console.log( url ) 

        var d = await rp({
            url,
            timeout: 10000,
            encoding: null,
            headers: {
				"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,hmn;q=0.6,la;q=0.5,vi;q=0.4",
				"Cache-Control": "no-cach",
				"Connection": "keep-alive",
                'accept-charset': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
				'Cookie':'aliyungf_tc=AQAAAGT0wX/ZwQ4Aj15I38PN+8Oys5Dc; acw_tc=2760820115950602369794069e9c89a594279ac958f8abecd69800b2b1719d; xq_a_token=ad923af9f68bb6a13ada0962232589cea11925c4; xqat=ad923af9f68bb6a13ada0962232589cea11925c4; xq_r_token=cf0e6f767c2318f1f1779fcee9323365f02e1b4b; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTU5NjE2MjgxNSwiY3RtIjoxNTk1MDYwNDM0NzIwLCJjaWQiOiJkOWQwbjRBWnVwIn0.Z6Q2k38TfrxInaL5Oi5s29hRmXvyci3MJuqXJmOk0ZtRf8RurbbjZwQGTlo5gHqkHkfTrECXDDsuPBCDjyQ5bC-bAbGh5OMezqkrEJvzUUhrLFAxor5pHvc2de5xESQEOACIwRhQL0bj2dCBkQY_587m7GCGopCq1Z5Aey3uR4Nh2aULto9vJAiw8vjwoFRtGVKucgWUUWB2bkal7NTPpCuFbgQPY3hKp1aRKM2BF9OzvH_k16NP7X3VovtSSZLHfUWrF7h-XtIwah1QIYyyOhfnbwAIR21yCpxLdC3FnnhJqbASWGls4Rt_17WtHcpdrnM69ncz7HRuPoN7YDX4hg; u=411595060438147; Hm_lvt_1db88642e346389874251b5a1eded6e3=1595060440; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1595060440; device_id=24700f9f1986800ab4fcc880530dd0ed'
			}
		});
		

		console.log( 8888 , d.length )
        d = Iconv.decode(d, 'GB2312');
        var arr = d.split('\r\n');
        arr.shift();
		arr.pop();
		

		console.log( 111 , arr )

        var hisData = [],
            length = arr.length;

        var marketCode = stock.market + stock.code;

        for (var i = length -1; i >=0 ; i--) {
            var record = arr[i];
            var rd = record.split(',');

            if (rd[3] == 0) {
                continue;
            }

            var d = {
                marketCode,
                date: rd[0].replace(/\//g, "-"),  // moment(rd[0]).format("YYYY-MM-DD"),

                close: +rd[3], // 收盘价 ;
                high: +rd[4],  //最高,
                low: +rd[5],       // 最低
                open: +rd[6],     // 开盘价

                chg: +rd[7], //  涨跌金额
                pchg: +rd[8], //  涨跌幅

                t_rate: +rd[9], // 换手率    :   百分比;
                t_volume:  parseFloat(  (+rd[10] / 1000000).toFixed(2) ), //  成交量     单位:万手
                t_value:  parseFloat(  (+rd[11] / 100000000).toFixed(2) ), //  成交金额;   单位: 亿 ;

                tcap: parseInt( +rd[12] / 100000000 ) , //   总市值 ;   单位: 亿 ;
                mcap: parseInt( +rd[13] / 100000000 ) , //   流通市值,  单位: 亿 ;

            }
            // 真实的品均价;
            d.avt =   parseFloat(  ( +rd[11] / +rd[10] ).toFixed(2)  );

            hisData.push(d);

        }

        console.log(`  net163 gethis  ${ marketCode }:  his data.length:  ${ hisData.length} , org arr.leng= ${arr.length}`);
        return  hisData 

    }

 

module.exports =  {
	getHisData 
}



getHisData({_id:"sh000001" , _source:{ market:"sz" , code:"000024" }})