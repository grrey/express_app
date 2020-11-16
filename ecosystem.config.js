
/**
 * 
 * 
 * 
 * Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
 */
module.exports = {
	apps : [{
	  name: 'lobaster',
	  script: 'server/main.js',  
	  
	  instances: 4, 
	  exec_mode: 'cluster',
	  max_memory_restart: '1G',

	  autorestart: true,
	  watch  : ['./server'],

	  env: {
		NODE_ENV: 'development'
	  },
	  env_production: {
		NODE_ENV: 'production'
	  }
	}]
}