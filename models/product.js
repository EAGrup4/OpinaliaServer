var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userModel = require('./user');
var User = mongoose.model('User')

var imageSchema = mongoose.Schema({src:String},{ _id : false });

var ratings = mongoose.Schema({
	userId:{type:Schema.ObjectId, ref: 'User',required: true, unique: true},
	title:{type:String,required : true},
	comment:{type:String,required : true},
	rate:{type:Number,required : true},
	date: { type: Date, default: Date.now },
	},{ _id : false });

var product = mongoose.Schema({
    name: {type:String,required : true},
    category: { type: String, enum: ['desktop','laptop','tablet','phone','accessories'],required : true},
    company: {type:String,required : true},
	specifications:[],
	date: { type: Date, default: Date.now },
	images:[imageSchema],
	ratings:[ratings],
	numRates: {type:Number, default: 0},
	totalRate:{type:Number, default: 0},
	avgRate: {type:Number, default: -1}
	
	},{collection:'products'});

module.exports=mongoose.model('Product', product);
module.exports=mongoose.model('Rating', ratings);
