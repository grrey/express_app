
/**
 * 
 */

let rp = require('request-promise');
let iconv = require("iconv-lite");
let ua = require('../utils/ua');
let cheerio = require('cheerio');
let pinyin = require('../utils/pinyin');
let common = require('../utils/common');


let stockType = /^[036]\d{5}$/

class Dfcfw {
	// 页面有编码;
	async getDfcfwHtml(uri, encode = 'gbk') {
		var html = await rp({
			url: uri,
			encoding: null,
			timeout: 3000,
			headers: {
				"User-Agent": ua.getRandomUserAgent()
			}
		})
		var text = iconv.decode(html, encode);
		return text;
	}

	async fetchStock() {
		var url = "http://quote.eastmoney.com/stock_list.html";
		var html = await this.getDfcfwHtml(url);
		let $ = cheerio.load(html);
		var uls = $(".quotebody ul");
		var data = []; 
		uls.each(function (i, $ul) {
			var lis = cheerio($ul).find("li");
			let text, stockName, stockCode;
			let market = i == 0 ? "sh" : "sz";
			lis.each(function (i, li) {
				text = cheerio(li).text();
				stockName = text.replace(/(.*)\((.*)\)/, "$1");
				stockCode = text.replace(/(.*)\((.*)\)/, "$2");

				if (stockType.test(stockCode)) {
					data.push({
						marketCode: market + stockCode,
						market: market,
						code: stockCode,
						name: stockName,
					})
				}
			})

		});
		return data;
	}
	// 所属板块, 经营范围
	async fetchF10({_source}) {
		var code = _source.code;
		var market = _source.market;

		// var url = `http://f9.eastmoney.com/F9/GetCoreContent?stockcode=600002.sh`;
		// var url = `http://f9.eastmoney.com/F9/GetCoreContent?stockcode=${code}.${market}`;
		var url = `http://140.207.218.10/F9/GetCoreContent?stockcode=${code}.${market}`;
		var resp = await rp({
			url,
			timeout: 10000,
			json: true,
			headers: {
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Upgrade-Insecure-Requests": 1,
				"Host": "f9.eastmoney.com",
				"Accept-Encoding": "gzip, deflate",
				"Accept-Language": "zh-cn",
				"Connection": "keep-alive", 
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6)",
			}
		});
		var { HXTC } = resp;
		if (!HXTC || !HXTC.hxtc) {
			return;
		}
		//所属板块;
		var SSBK = HXTC.hxtc[0] && HXTC.hxtc[0].ydnr && HXTC.hxtc[0].ydnr.split(" ");
		var JYFW = HXTC.hxtc[1] && HXTC.hxtc[1].ydnr;

		var F10 = {};
		if (SSBK) {
			F10.SSBK = SSBK
		}
		if (JYFW) {
			F10.JYFW = JYFW
		}
		return F10;
	};

	// 经营 比例;
	async  fetchBusiness( {_source }){
		// http://f10.eastmoney.com/BusinessAnalysis/BusinessAnalysisAjax?code=SZ000002
		// let url = `http://122.70.142.37/BusinessAnalysis/BusinessAnalysisAjax?code=${_source.market}${_source.code}`;
		let url = `http://f10.eastmoney.com/BusinessAnalysis/BusinessAnalysisAjax?code=${_source.market}${_source.code}`;
		let d  = await  rp({
			url ,
			json:true ,
			// encoding:null ,
			headers: {
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Upgrade-Insecure-Requests": 1,
				"Host": "f10.eastmoney.com",
				// "Accept-Encoding": "gzip, deflate", // 导致乱码;
				"Accept-Language": "zh-cn",
				"Connection": "keep-alive", 
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
			}
		})
		   
		let { zygcfx = []} = d ;
		 
		let business =   zygcfx.map(( { rq , hy=[] , cp =[] })=>{
			return {
				date: rq ,
				hy: hy.map((h)=>{
					return {
						zygc: h.zygc ,
						zysr: common.parse2Num( h.zysr),
						srbl: common.parse2Num( h.srbl),
					}
				}),
				cp: cp.map((c)=>{
					return {
						zygc: c.zygc ,
						zysr: common.parse2Num( c.zysr),
						srbl: common.parse2Num( c.srbl),
					}
				}),
			}
		});

		return {
			business ,
			zyhy:  ( business[0] && business[0].hy ) || [],
			zycp:  ( business[0] && business[0].cp ) || [],
		}
	}
}


module.exports = new Dfcfw();


