// invoked for any requests passed to this router
var express = require('express');
var router = express.Router();
var stockCtrl  = require('../../ctrl/stock')
 
router.get('/events', async function(req, res, next) {
	let d = await  stockCtrl.getProcessStList();

    res.json(  d )
})

module.exports = router;