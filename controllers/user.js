var mongoose = require('mongoose');
var User = mongoose.model('User');



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
    var newUser = new User(req.body);
   newUser.save(function(err, user) {
        if (err)
            res.status(500).send({message: `Error when saving in database: ${err}`});
        res.status(200).json(user);
    });
};

exports.loginUser = function(req,res){
    var newUser = new User(req.body);
    User.find({email:newUser.email, password:newUser.password}, function(err,user){
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        if (user.length==0)
            res.status(500).send({message: 'User not registered'});
        else
            res.status(200).json(user);
    });


};

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