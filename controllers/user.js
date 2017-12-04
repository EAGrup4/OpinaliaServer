var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');



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
            user.token=jwt.createToken(user);
            res.status(200).json(user);
        });
    });
};


exports.loginUser=function(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, function(err, user) {
        if(err){
            res.status(500).send({message: 'Error when checking in database'});
        }else{
            if(user){
                bcrypt.compare(password,user.password, function(err, check){
                    if(check) {

                        user.token=jwt.createToken(user);
                        res.status(200).json(user);

                    }else{
                        res.status(401).send({message: 'Incorrect credentials'});
                    }
                })
            }else{
                res.status(404).send({message: 'User not exists'});
            }
        }
    });
}


exports.updateUser = function(req, res) {
    var userId = req.params.userId;
    var update = req.body;

   if(userId != req.user.sub){
        res.status(500).send({message: 'You do not have enough capabilities'});
    }
    User.findOneAndUpdate(userId, update, {new: true}, function(err, user) {
        if (err)
            res.status(500).send({message: `Error when saving in database: ${err}`});
        res.status(200).json(user);
    });
};

exports.deleteUser = function(req, res) {
    var userId = req.params.userId;

    if (userId != req.user.sub){
        res.status(500).send({message: 'You do not have enough capabilities'});
    }
    User.findByIdAndRemove(req.params.userId, function(err, user) {
        if (err)
            res.status(500).send({message: `Error when deleting in database: ${err}`});
        res.status(200).json({ message: 'User successfully deleted' });
    });
};