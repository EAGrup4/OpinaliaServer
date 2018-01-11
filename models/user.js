var mongoose = require('mongoose');

var user = mongoose.Schema({
    name: {type:String, required : true},
    email: { type : String , unique : true, required : true},
    password: {type:String,required : true},
	profileImage:String,
	imagePublicId:String,
	admin:{type: Boolean, default:false},
	token:String,
    reset_password_token: String,
    reset_password_expires: Date
},{collection:'users'});

module.exports=mongoose.model('User', user);