var mongoose = require('mongoose');
var User = mongoose.model('User');



exports.listAllUsers = function(req, res) {
    User.find({}, function(err, users) {
        if (err)
            res.send(err);
        res.json(200, users);
    });
};
exports.findByEmail = function(req, res) {
    User.find({email:req.params.email}, function(err, user) {
        if (err)
            res.send(err);
        res.json(200, user);
    });
};
exports.findByName = function(req, res) {
    User.find({name:req.params.name}, function(err, user) {
        if (err)
            res.send(err);
        res.json(200, user);
    });
};

exports.registerUser = function(req, res) {
    var newUser = new User(req.body);
   newUser.save(function(err, user) {
        if (err)
            res.status(500).send({message: `Error when saving in database: ${err}`});
        res.json(200, user);
    });
};

exports.loginUser = function(req,res){
    var newUser = new User(req.body);
    User.find({email:newUser.email, password:newUser.password}, function(err,user){
        if (err)
            res.send(err);
        if (user.length==0)
            res.status(500).send({message: 'User not registered'});
        else
            res.json(200, user);
    });


};

exports.updateUser = function(req, res) {
    User.findOneAndUpdate({_id:req.params.userId}, req.body, {new: true}, function(err, user) {
        if (err)
            res.send(err);
        res.json(200, user);
    });
};

exports.deleteUser = function(req, res) {
    User.findByIdAndRemove(req.params.userId, function(err, user) {
        if (err)
            res.send(err);
        res.json(200, { message: 'User successfully deleted' });
    });
};