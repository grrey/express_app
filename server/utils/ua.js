/**
 * 随机获取 模拟的 userAgent 
 */
function getRandomUserAgent (){
    var  i =   parseInt( Math.random() * 10 );
    return  agentMap[ "" + i ]
}

//---------------------------------------------------------------------------------------------------------

var  agentMap = {
    0: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2924.87 Safari/537.36" ,
    1: "Mozilla/4.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2924.87 Safari/537.36" ,
    2: "Mozilla/4.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2924.87 Safari/537.36" ,
    3: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2924.87 Safari/537.36" ,
    4: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.2924.87 Safari/537.36" ,
    5: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2924.87 Safari/537.36" ,
    6: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2924.87 Safari/537.36" ,
    7: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2924.87 Safari/537.36" ,
    8: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2924.87 Safari/537.36" ,
    9: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2924.87 Safari/537.36" ,    
}

module.exports = {
	getRandomUserAgent ,
	
}