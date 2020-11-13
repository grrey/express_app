const express = require('express');

var stock  = require('./route/stock')

module.exports = function (app) {
	app.use(  stock )
}

