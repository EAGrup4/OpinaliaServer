var mongoose = require('mongoose');

var user = mongoose.Schema({
    name: String,
    email: { type : String , unique : true, required : true},
    password: String,
	profileImage:String,
	admin:{type: Boolean, default:false}
},{collection:'users'});

module.exports=mongoose.model('User', user);