 
var Redis = require('redis');

// 发布,
const pubClient = Redis.createClient({
  host: '127.0.0.1',
  port: 6379
})
// 订阅;
const subClient = Redis.createClient({
	host: '127.0.0.1',
	port: 6379
})
// 任务消费;
const consumerClient = Redis.createClient({
	host: '127.0.0.1',
	port: 6379
})
// 任务生产
const producterClient = Redis.createClient({
	host: '127.0.0.1',
	port: 6379
})


// subClient.subscribe("notification");

// 逐个取任务;
function popTask( taskName ){
	return new Promise(resolve => 
		consumerClient.blpop(taskName, 1000, (err, [channel ,data]) =>{ 
			resolve( JSON.parse(data) )
		} )
	)
};

var getRedisValue = (key) => new Promise(resolve => pubClient.get(key, (err, reply) => resolve( JSON.parse(reply))))
var setRedisValue = (key ,value ) => new Promise(resolve => pubClient.set(key,  JSON.stringify(value), resolve))
var delRedisKey = (key) => new Promise(resolve => pubClient.del(key, resolve))

//  订阅 任务队列;
exports.subTask = async  function ( { taskName  , consumHandler }){ 
 

	if( !taskName ){
		log.error( ' no task name !');
		return ;
	}
	await delRedisKey( taskName );
	log('subTask:' , taskName   )
	async function fun(){
		let task = await popTask( taskName );
		if( task ){ 
			await consumHandler( task ) ;
			fun();
		}
	}  
	subClient.on('message', function( channel , message ){ 
		if(channel === taskName && message ==='start'){
			fun();
		}
	});
	subClient.subscribe( taskName );
}

// 发布 任务队列
exports.publishTask = async function ( taskName , taskArr=[]){

	taskArr.forEach((t)=>{
		producterClient.lpush(taskName,  JSON.stringify(t) , function( err , result){ 
		})
	});
	console.log('publishTask:' , taskName , ', tasksize=',taskArr.length )
	pubClient.publish( taskName  , 'start' );

}



 