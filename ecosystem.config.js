/**
 * 
 * 
 * 
 * Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
 */
module.exports = {
    apps: [{
        name: 'lobaster_server',
        script: 'server/index.js',

        instances: 4,
        exec_mode: 'cluster',
        max_memory_restart: '200M',

        // autorestart: true ,
        // watch  : ['./server'],

        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        },

        log_file: 'logs/log.log',
        
        // 'pm2-logrotate': {
        //     max_size: '2M',
        //     compress: false
        // }

    }]
}