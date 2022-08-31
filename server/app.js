var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session')
var http = require("http");
var {Server} = require("socket.io");
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Create the http server
const server = require('http').createServer(app);

// Create the Socket IO server on
// the top of http server
const io = new Server(server);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors())
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
	// Set to true if you need the website to include cookies in the requests sent
	res.setHeader('Access-Control-Allow-Credentials', true);
  
	next();
  })

app.use('/', indexRouter);
app.use('/users', usersRouter);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {

	// Set locals, only providing error
	// in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env')
			=== 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = { app: app, server: server };
