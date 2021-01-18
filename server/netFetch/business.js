/**
 * 更新: 产品, 行业, 季度报告,
 * 经营, 
 * @param {} param0 
 */

let rp = require('request-promise');
let _ = require('lodash');
let common = require('../utils/common');


async function fetchBusiness({
    _source
}) {
    // http://f10.eastmoney.com/BusinessAnalysis/BusinessAnalysisAjax?code=SZ000002
    // let url = `http://122.70.142.37/BusinessAnalysis/BusinessAnalysisAjax?code=${_source.market}${_source.code}`;
    let url = `http://f10.eastmoney.com/BusinessAnalysis/BusinessAnalysisAjax?code=${_source.market}${_source.code}`;
    let d = await rp({
        url,
        json: true,
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

    let { zygcfx = [] } = d;
    let zyhy = [],
        zycp = [];

    zygcfx.forEach(({
        rq,
        hy = [],
        cp = []
    }) => {
        zyhy.push({
            data: rq,
            hy: hy.map((h) => {
                return {
                    zygc: h.zygc,
                    zysr: common.parse2Num(h.zysr),
                    // srbl: common.parse2Num( h.srbl),
                }
            }),
        });
        zycp.push({
            data: rq,
            cp: cp.map((c) => {
                return {
                    zygc: c.zygc,
                    zysr: common.parse2Num(c.zysr),
                    // srbl: common.parse2Num( c.srbl),
                }
            }),
        });

    })

    return {
        zyhy,
        zycp,
    }
}

exports.fetchBusiness = fetchBusiness;


// (async () => {
//     var bus = await fetchBusiness({
//         _source: {
//             market: 'SH',
//             code: 600332
//         }
//     });

//     console.log(111, bus)

// })()