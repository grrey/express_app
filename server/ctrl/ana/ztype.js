/**
 *  拐弯向上
 */

const esHis = require('../../esModel/his');
const esStock = require('../../esModel/stock');
const _ =require('lodash'); 
const his = require('../../esModel/his');
const utils = require('./utils');

module.exports =  async  function  ztype ( esst , hisArr ){

  const TagName = 'z_type' ; 

  var  madown =  utils.qushi({
    dataArr: hisArr ,
    fieldPath:"_source.ma.ma30",
    upDirect: false ,
    size: 10
  });
  var maup =  utils.zhedian({
    dataArr: hisArr ,
    fieldPath:"_source.ma.ma5",
    upDirect: true ,
    size: 2
  });

  let hit = madown && maup ;
  await esStock.upDataTag(esst._id, TagName ,  hit   );

 

  if(hit){
    console.log("~~~~~~~~~~~~" , esst._id , TagName , hit )
  }
  
}