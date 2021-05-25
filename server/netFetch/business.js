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


    let { zygcfx=[] } = d ;

    let thy = [] , tcp=[]; 
    let zyhyT  = [] , zycpT = [] ;

    zygcfx.forEach(({hy=[],cp=[]}) => {
        
        thy.push(...hy);
        tcp.push(...cp);
         
        _calcTdata( zyhyT , hy ) 
        _calcTdata( zycpT , cp ) 

    }); 
 

    return {
        zyhy: _group( thy),
        zycp: _group( tcp),
        zyhyT,
        zycpT
    }

  
}

exports.fetchBusiness = fetchBusiness;

function _group( g ){
    let gr = _.groupBy( g , (d) => {
        return  d.zygc ;   
    });

    return Object.values( gr).map( (g) => {
        return  { name: g[0].zygc , values: g  }
    })
    // .filter((g) => {
    //         return g.values.length >=2
    // })

} 

function _calcTdata( arr ,  data ){
    let res = {
        date:'',
        zysr:0,
        zylr:0
    }

    data.forEach((d) => { 
        res.date = d.rq ;
        
        res.zysr += _getNum( d.zysr )
        res.zylr +=_getNum( d.zylr ) 
    })
    
    if( res.date ){
        arr.push( res )
    }
}

function  _getNum( str = ""){
    let num  = 0 ;
    
    if( str.indexOf('万亿') >=0 ){
        num = ( + str.replace('万亿','') ) * 10000
    }else if( str.indexOf('亿')>=0  ){
        num =  + str.replace('亿','')
    } else if( str.indexOf('万') >=0 ) {
        num =   +(( +str.replace('万','') ) / 10000).toFixed(4)
    }  
    return num ;

}


// fetchBusiness({
//     _id:'sh600766',
//     _source: { 
//         marketCode:'sh600766',
//         market:'sh',
//         code:'600766'
//     }
// })
// .then( console.log );


