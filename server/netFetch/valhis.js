/**
 * 
 * @param {*} param0 
 * @returns []
 */



let rp = require('request-promise');
let iconv = require("iconv-lite");
let moment = require('moment');


async function fetchHis({
    _id,
    _source
}) {
    let startDay;
    if (appConfig.forceHis) {
        startDay = moment().subtract(600, 'days').format('YYYYMMDD')
    } else if (_source.latesHisDay) {
        startDay = moment(_source.latesHisDay).add(1, 'days').format('YYYYMMDD');
    } else {
        startDay = moment().subtract(600, 'days').format('YYYYMMDD');
    }


    let hislist = await fetchHis163({
        _id,
        _source
    }, startDay);

    return hislist
}

exports.fetchHis = fetchHis;



//==============================================================================



async function fetchHis163(esStockObj, start) {

    let stock = esStockObj._source;

    var end = moment().format('YYYYMMDD');

    if (start == end) {
        return {
            his: []
        }
    }

    var yahooCode = (stock.market == 'sh' ? '0' : '1') + stock.code;

    // sh600010  , sh601208    sz002494
    // 查看   600260 的前后复权 ;  8.27-8.28 复权期 
    // http://quotes.money.163.com/service/chddata.html?code=0600260&start=20190826&end=20190829&fields=TCLOSE;HIGH;LOW;TOPEN;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP


    var url = `http://quotes.money.163.com/service/chddata.html?` +
        `code=${yahooCode}&start=${start}&end=${end}` +
        `&fields=TCLOSE;HIGH;LOW;TOPEN;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP`;

    console.log(`  net163 gethist params :  ${stock.market }  : ${yahooCode}&start=${start}&end=${end} `);

    var d = await rp({
        url,
        timeout: 10000,
        encoding: null,
        headers: {
            // 'accept-charset': "utf-8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    });

    d = iconv.decode(d, 'GB2312');
    var arr = d.split('\r\n');
    arr.shift();
    arr.pop();


    var hisData = [],
        length = arr.length;

    var marketCode = stock.market + stock.code;

    for (var i = length - 1; i >= 0; i--) {
        var record = arr[i];
        var rd = record.split(',');

        if (rd[3] == 0) {
            continue;
        }

        var d = {
            marketCode,
            date: rd[0].replace(/\//g, "-"), // moment(rd[0]).format("YYYY-MM-DD"),
            k: {
                close: +rd[3], // 收盘价 ;
                high: +rd[4], //最高,
                low: +rd[5], // 最低
                open: +rd[6], // 开盘价

                chg: +rd[7], //  涨跌金额
                pchg: +rd[8], //  涨跌幅

                rate: +rd[9], // 换手率    :   百分比;
                amount: parseFloat((+rd[10] / 1000000).toFixed(2)), //  成交量     单位:万手
                value: parseFloat((+rd[11] / 100000000).toFixed(2)), //  成交金额;   单位: 亿 ;

                tcap: parseInt(+rd[12] / 100000000), //   总市值 ;   单位: 亿 ;
                macp: parseInt(+rd[13] / 100000000), //   流通市值,  单位: 亿 ;
            }

        }
        // 真实的品均价;
        d.k.avg = parseFloat((+rd[11] / +rd[10]).toFixed(2));

        hisData.push(d);

    }

    console.log(` net163 gethis  ${ marketCode }:  his data.length:  ${ hisData.length} , org arr.leng= ${arr.length}`);
    return hisData;

}