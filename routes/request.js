var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_mkxf0znj:2a6li09f9smtu8i6nj1b8hnm7r@ds159776.mlab.com:59776/heroku_mkxf0znj');

var Request = require('../app/models/request');

router.get('/api', function (req, res, next) {
    Request.find()
        .sort({
            'timestamp': -1
        })
        .exec(function (err, requests) {
            if (err)
                res.send(err);
            res.json(requests);
        });
});

router.post('/api', function (req, res, next) {

    var request = new Request();

    request.user = req.body.user_name;
    request.equipment = req.body.equipment_name;
    request.quantity = req.body.quantity;
    request.remarks = req.body.remarks;
    request.url = req.body.url;
    request.timestamp = Date.now();
    request.status = 1;

    request.save(function (err) {
        if (err)
            res.send(err);
        res.redirect('/');
    });

});

router.put('/api', function (req, res, next) {

    Request.findById(req.body.request_id, function (err, request) {
        if (err)
            res.send(err);
        request.status = req.body.status;

        request.save(function (err) {
            if (err)
                res.send(err);
            res.redirect('/');
        });
    });

});

module.exports = router;
