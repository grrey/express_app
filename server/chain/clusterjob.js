

const _ = require('lodash')
const ProgressBar = require('progress')

const { JobMap } = require('./const')



/**
 * 
 * @param {*} param0  message ;
 * @param {*} cb 
 */
module.exports = async function doJob( { JobName : jname ,esSts=[]  ,batch=1} , cb ){
    
    if( batch > 1 ){ 
        esSts = _.chunk( esSts , batch);
    }
    
    let result = [];
    while( esSts.length){
        let esSt = esSts.pop();
 
        try{
            let res = await JobMap[jname](esSt);
            result.push( res);
        }catch(e){
            console.log( e )
        }
  
        process.send( {  owner:"clusterjob", JobName:jname  , payload: batch  })
    }

    cb(result);
}
   