var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_mkxf0znj:2a6li09f9smtu8i6nj1b8hnm7r@ds159776.mlab.com:59776/heroku_mkxf0znj');

var Toilet = require('../app/models/toilet');

/* GET home page. */
var returnRouter = function(io) {
	router.get('/', function (req, res, next) {
		Toilet.find()
			.sort({
			'timestamp': -1
		})
			.exec(function (err, toilets) {
			if (err)
				res.send(err);
			res.render('toilet', {
				status: toilets[0].status
			});
		});
	});

	router.get('/api', function (req, res, next) {
		Toilet.find()
			.sort({
			'timestamp': -1
		})
			.exec(function (err, toilets) {
			if (err)
				res.send(err);
			res.json(toilets);
		});
	});

	router.post('/api', function (req, res, next) {

		var toilet = new Toilet();

		if (req.body.status != null) {
			toilet.status = req.body.status;
			toilet.timestamp = Date.now();

			toilet.save(function (err) {
				if (err)
					res.send(err);
				res.json({
					message: 'success create toilet status.'
				});
			});
			 io.emit(`toilet`, toilet.status);
		} else {
			res.json({
				message: 'not found toilet status.'
			});
		}
	});
	
	return router;
}

module.exports = returnRouter;