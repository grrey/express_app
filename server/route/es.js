var express = require('express');
var router = express.Router();
var request = require('request');
var  {stringify} = require('querystring')
// var intoStream = require('into-stream');
// var bodyParser = require('body-parser');
// var textParser = bodyParser.text({ limit: '50kb' });




const esHost = 'http://127.0.0.1:9200'
router.use('/', (req, res) => {


  // request(esHost + req.path + '?' + stringify( req.query)).pipe(res);

 req.pipe(request(esHost + req.path + '?' + stringify( req.query) )).pipe(res);

  // request({
  //   method: req.method ,
  //   uri: esHost + req.path ,
  //   // form: req.body,
  //   query: req.query 
  // }).pipe( res )
 



  // let text = req.body;
  // let stream     = intoStream(text);
  // stream.method  = req.method;
  // stream.headers = req.headers; 
  // stream.pipe(request(esHost + req.path )).pipe(res);


    // const esProxy = request(esHost + req.path )
    // req.pipe(esProxy)
    // esProxy.pipe(res) 

    // res.json({
    //   path:  req.path ,
    //   query :  req.query,
    //   a:11
    // })
    
})



module.exports = router;


 