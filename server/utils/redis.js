 
var Redis = require('redis');

const pubclient = Redis.createClient({
  host: '127.0.0.1',
  port: 6379
})

const subClient = Redis.createClient({
	host: '127.0.0.1',
	port: 6379
})

const popClient = Redis.createClient({
	host: '127.0.0.1',
	port: 6379
})
const pushClient = Redis.createClient({
	host: '127.0.0.1',
	port: 6379
})


subClient.subscribe("notification");

// 逐个取任务;
function popTask( taskName ){
	return new Promise(resolve => 
		popClient.blpop(taskName, 1000, (err, [channel ,data]) =>{ 
			resolve( JSON.parse(data) )
		} )
	)
};

var getRedisValue = (key) => new Promise(resolve => subClient.get(key, (err, reply) => resolve(reply)))
var setRedisValue = (key ,value ) => new Promise(resolve => subClient.set(key,  JSON.stringify(value), resolve))
var delRedisKey = (key) => new Promise(resolve => subClient.del(key, resolve))

//  订阅 任务队列;
exports.subTask = async  function ( { taskName  , taskHandler }){ 
	await delRedisKey( taskName );
	log('subTask' , taskName   )
	async function fun(){
		let task = await popTask( taskName );
		if( task ){ 
			await taskHandler( task ) ;
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
		pushClient.lpush(taskName,  JSON.stringify(t) )
	});
	console.log('publishTask:' , taskName , '  tasksize=',taskArr.length )
	pubclient.publish( taskName  , 'start' );
}



 