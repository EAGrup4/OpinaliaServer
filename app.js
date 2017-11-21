var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var productModel = require('./models/product');
var productRoutes = require('./routes/product');
var userModel = require('./models/user');
var userRoutes = require('./routes/user');

var app = express();

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


//Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

//conect the database
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/opinalia',  { useMongoClient: true });
console.log("Database connected");

//start server
app.listen(3001);

console.log("Server listeneing on port 3000");