var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModel = require('./user');
var User = mongoose.model('User')

var imageSchema = mongoose.Schema({src:String},{ _id : false });

var ratings = mongoose.Schema({
	userId:{type:Schema.ObjectId, ref: 'User'},
	comment:String,
	mark:Number
	},{ _id : false });

var product = mongoose.Schema({
    name: String,
    category: String,
    company: String,
	specifications:[],
	images:[imageSchema],
	comments:[ratings]
	
	},{collection:'products'});

module.exports=mongoose.model('Product', product);