

var  processIndex = 0;
const workerList = [];

var workerFarm = require('worker-farm')
  , workers    = workerFarm( { 
    maxConcurrentWorkers: 5 ,
    onChild( work ){ 
      processIndex++
      console.log( 'onchild' , processIndex)
      work.send({p_id: processIndex})

    }
  },require.resolve('./child'))
  , ret        = 0

var cluster = require('cluster')

function sendM(i){
  if( i < 100){
    workers('#' + i + ' FOO', function (err, outp) { 
      if (++ret >= 90)
        workerFarm.end(workers)
    })
    setTimeout(() => {
      sendM(i++)
    }, 1000);
  }
}

sendM(1)
 


module.exports =  async function ClusterJOB( config ){


}
 