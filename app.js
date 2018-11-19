var express = require('express');
var app = express();
var http = require('http');

var path = require('path');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var methodOverride = require('method-override');
var flash = require("connect-flash");

var session = require("express-session");
var LocalStrategy = require('passport-local').Strategy;

// Create HTTP server.
var server = http.createServer(app);

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');

// Create server socket.io.
var io = require('socket.io')(server);

// Get routers
var index = require('./routes/index');
var request = require('./routes/request');
var toilet = require('./routes/toilet')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use('/', index);
app.use('/request', request);
app.use('/toilet', toilet);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        request_link: '/',
        status_link: '/',
        log_link: '/'
    });
});

// Listen on provided port, on all network interfaces.
server.listen(port);


// Normalize a port into a number, string, or false.
function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}