
/**
 * 
 */

let rp = require('request-promise');
let iconv = require("iconv-lite");
let ua = require('../utils/ua');
let cheerio = require('cheerio');
let pinyin = require('../utils/pinyin');


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

	async fetchF10({_source}) {
		var code = _source.code;
		var market = _source.market;
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
				// "Cache-Control": "no-cache",
				// "Pragma": "no-cache",
				// "Referer": `http://f10.eastmoney.com/${code}${market}.html`,

				//"User-Agent":  getUserAgent(),
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
}


module.exports = new Dfcfw();