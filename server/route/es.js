/*
 * @Author: your name
 * @Date: 2021-04-23 10:52:13
 * @LastEditTime: 2021-06-30 09:07:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /express_app/server/route/es.js
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var { stringify } = require('querystring')


const esHost = 'http://127.0.0.1:9200'

router.use('/', (req, res) => {


  req.pipe(request(esHost + req.path + '?' + stringify(req.query))).pipe(res);

})



module.exports = router;


