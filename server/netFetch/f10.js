let rp = require('request-promise');

// 所属板块, 经营范围
async function fetchF10({
    _source
}) {
    var code = _source.code;
    var market = _source.market;

    // var url = `http://f9.eastmoney.com/F9/GetCoreContent?stockcode=600002.sh`; 
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
    var {
        HXTC
    } = resp;
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



exports.fetchF10 = fetchF10;