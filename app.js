var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.load();
var cloudinary = require('cloudinary').v2;

var productModel = require('./models/product');
var productRoutes = require('./routes/product');
var userModel = require('./models/user');
var userRoutes = require('./routes/user');
var validator = require('express-validator');

var app = express();

//allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());


//Load cloudinary configuration
if (typeof(process.env.CLOUDINARY_URL)=='undefined'){
	console.warn('!! cloudinary config is undefined !!');
	console.warn('export CLOUDINARY_URL or set dotenv file')
}else{
	console.log('cloudinary config:');
	console.log(cloudinary.config())
}



//Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

//conect the database
DATABASE=process.env.DATABASE;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://'+DATABASE,  { useMongoClient: true });
console.log("Database connected");
console.log('mongodb://'+DATABASE);

//error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

//start server
app.listen(3000);

console.log("Server listeneing on port 3000");

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});