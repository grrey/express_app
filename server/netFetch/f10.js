let rp = require('request-promise');
let _ = require('lodash');

// 所属板块, 经营范围
async function fetchF10({
    _source
}) {
    var code = _source.code;
    var market = _source.market;

    // var url = `http://f9.eastmoney.com/F9/GetCoreContent?stockcode=600002.sh`; 
    var url = `http://114.141.154.22/F9/GetCoreContent?stockcode=${code}.${market}`;
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
    var {
        HXTC,
        BKMC = "",
    } = resp;
    if (!HXTC || !HXTC.hxtc) {
        return;
    }
    //所属板块;
    var SSBK = HXTC.hxtc[0] && HXTC.hxtc[0].ydnr && HXTC.hxtc[0].ydnr.split(" ");
    //经营范围
    var JYFW = HXTC.hxtc[1] && HXTC.hxtc[1].ydnr;

    // 题材;
    var ticai = _.get(HXTC, "hxtc", []);

    // 主要板块
    var hy = BKMC

    ticai = _.drop(ticai, 2).map(({
        gjc,
        ydnr
    }) => {
        return {
            gjc,
            ydnr
        }
    })

    var F10 = {
        hy
    };
    
    if (SSBK) {
        F10.SSBK = SSBK
    }
    if (JYFW) {
        F10.JYFW = JYFW
    }
    F10.ticai = ticai;

    return F10;
};



exports.fetchF10 = fetchF10;



// ( async () => {
// 	let d = await  fetchF10({_source:{market:"sh" , code:'600311', marketCode:"sh600311"}})
// 	console.log(111 , d )
// })()