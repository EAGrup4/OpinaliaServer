var mongoose = require('mongoose');

var user = mongoose.Schema({
    name: {type:String,required : true},
    email: { type : String , unique : true, required : true},
    password: {type:String,required : true},
	profileImage:String,
	admin:{type: Boolean, default:false}
},{collection:'users'});

module.exports=mongoose.model('User', user);