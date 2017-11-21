var mongoose = require('mongoose');
var User = mongoose.model('User');
const bcrypt = require('bcrypt-nodejs');



exports.listAllUsers = function(req, res) {
    User.find({}, function(err, users) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(users);
    });
};
exports.findByEmail = function(req, res) {
    User.find({email:req.params.email}, function(err, user) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(user);
    });
};
exports.findByName = function(req, res) {
    User.find({name:req.params.name}, function(err, user) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(user);
    });
};

exports.registerUser = function(req, res) {
    bcrypt.hash(req.body.password, null, null, function (err, hash) {
        var newUser = new User(req.body);
        newUser.password = hash;
        newUser.save(function (err, user) {
            if (err)
                res.status(500).send({message: `Error when saving in database: ${err}`});
            res.status(200).json(user);
        });
    });
};

exports.loginUser=function(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({email: email.toLowerCase()}, (err, user) =>{
        if(err){
            res.status(500).send({message: 'Incorrect credentials'});
        }else{
            if(user){
                bcrypt.compare(password,user.password, (err, check)=>{
                    if(check) {
                        res.status(200).send({user});
                    }else{
                        res.status(400).send({message: 'Error when checking user'});
                    }
                })
            }else{
                res.status(404).send({message: 'Login incorrect'});
            }
        }
    });
};
/*
exports.loginUser = function(req,res){
    var newUser = new User(req.body);
    User.find({email:newUser.email}, function(err,user){
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        if (user.length==0)
            res.status(500).send({message: 'User not registered'});
        else
            bcrypt.compare(req.body.password,user.password, (err, check)=> {
                if(check){
                    res.status(200).json(user);};

                else
                    res.status(400).send({message: 'Not correct login'});
                 });
    });

};
*/

exports.updateUser = function(req, res) {
    User.findOneAndUpdate({_id:req.params.userId}, req.body, {new: true}, function(err, user) {
        if (err)
            res.status(500).send({message: `Error when saving in database: ${err}`});
        res.status(200).json(user);
    });
};

exports.deleteUser = function(req, res) {
    User.findByIdAndRemove(req.params.userId, function(err, user) {
        if (err)
            res.status(500).send({message: `Error when deleting in database: ${err}`});
        res.status(200).json({ message: 'User successfully deleted' });
    });
};