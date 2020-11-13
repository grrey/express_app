// invoked for any requests passed to this router
var express = require('express');
var router = express.Router();

 
router.get('/events', function(req, res, next) {
    res.json({
        f: 1
    })
})

module.exports = router;