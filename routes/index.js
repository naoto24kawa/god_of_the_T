var express = require('express');
var router = express.Router();

// DBへの接続
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_mkxf0znj:2a6li09f9smtu8i6nj1b8hnm7r@ds159776.mlab.com:59776/heroku_mkxf0znj');

// モデルの宣言
var Request = require('../app/models/request');
var User = require('../app/models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    Request.find()
        .sort({
            'timestamp': -1
        })
        .limit(20)
        .exec(function (err, requests) {
            if (err)
                res.send(err);
            res.render('index', {
                request_link: '#request',
                status_link: '#status',
                log_link: '#log',
                requests: requests
            });
        });
});

module.exports = router;
