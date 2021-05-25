var stockrouter = require('./route/stock')
var esrouter = require('./route/es');
var cluster = require('cluster')


module.exports = function(app) {

    app.use(stockrouter)

    app.use('/es', esrouter);


    app.use('/test', (req, res, next) => {

        cluster.worker.send('12123')
        res.json({
            worker: cluster.worker.send.toString(),
            s: process.workers,
            ss: 3
        })

    })
}

process.on('message', (params) => {
    console.log('mmmmmmm', params)

})
