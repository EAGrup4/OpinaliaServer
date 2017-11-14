var mongoose = require('mongoose');
var User = mongoose.model('User');

//read methods
exports.listAllUsers = function(req, res) {
    User.find({}, function(err, users) {
        if (err)
            res.send(err);
        res.json(200, {users});
    });
};
exports.findByEmail = function(req, res) {
    User.find({email:req.params.email}, function(err, user) {
        if (err)
            res.send(err);
        res.json(200, {user});
    });
};


//insert methods
exports.registerUser = function(req, res) {
    var newUser = new User(req.body);
   newUser.save(function(err, user) {
        if (err)
            res.status(500).send({message: `Error when saving in database: ${err}`});
        res.json(200, {user});
    });
};


//update methods
exports.updateUser = function(req, res) {
    User.findOneAndUpdate({_id:req.params.userId}, req.body, {new: true}, function(err, user) {
        if (err)
            res.send(err);
        res.json(200, {user});
    });
};


//delete methods
exports.deleteUser = function(req, res) {
    User.findByIdAndRemove(req.params.userId, function(err, user) {
        if (err)
            res.send(err);
        res.json(200, { message: 'User successfully deleted' });
    });
};