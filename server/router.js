/*
 * @Author: your name
 * @Date: 2017-06-30 15:12:47
 * @LastEditTime: 2021-07-01 13:56:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /express_app/server/router.js
 */
var stockrouter = require('./route/stock')
var esrouter = require('./route/es');
var cluster = require('cluster')


module.exports = function(app) {

    // stockrouter ;
    app.use(stockrouter)

    // 透传到 elasticSearch 服务器;
    app.use('/es', esrouter);

    // 接口防刷~~
    app.use('/302test', (req, res, next) => {
        var s =  Math.random();
        // 搜索引擎;
        // 放行, 直接走缓存; 忽略url 参数,  模拟时 模拟 引擎agent 呢 ????

        if( req.cookies.cokkieName ){ 
            // 校验cookie ;

            // 放行, 有缓存走缓存, 没有就去新建;
            res.json(  Object.assign( {a:1} ,req.cookies  ) )
        }else {
            // 生成cookie ;
            res.cookie('cokkieName','randomNumber_'+s, {   httpOnly: false })
            res.redirect( './302test' );
        }
       
    });

    app.use('/302page', (req, res, next) => {
         res.json(  Object.assign( {a:1} ,req.cookies  ) )
    });

    

}

process.on('message', (params) => {
    console.log('mmmmmmm', params)

})
