var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var nodemailer = require("nodemailer");

exports.listAllUsers = function(req, res) {
    var tokenInfo=req.user;

    if(tokenInfo.admin){
        User.find({}, function(err, users) {
            if (err)
                res.status(500).send({message: `Internal server error: ${err}`});
            else
                res.status(200).json(users);
        });
    }

    else
        res.status(403).json({message: 'No privileges'});

};

exports.findByEmail = function(req, res) {
    User.find({email:req.params.email}, function(err, user) {
        if (err)
            res.status(500).send({message: `Internal server error: ${err}`});
        else
            res.status(200).json(user);
    });
};

exports.findByName = function(req, res) {
    User.find({name:req.params.name}, function(err, user) {
        if (err)
            res.status(500).send({message: `Internal server error: ${err}`});
        else
            res.status(200).json(user);
    });
};

exports.registerUser = function(req, res) {
    bcrypt.hash(req.body.password, null, null, function (err, hash) {
        if (err)
            s.status(500).send({message: `Internal server error: ${err}`});
        else{
            var newUser = new User(req.body);
            newUser.password = hash;
            newUser.save(function (err, user) {
                if (err)
                    res.status(500).send({message: `Internal server error: ${err}`});
                else{
                    user.token=jwt.createToken(user);
                    res.status(200).json(user);
                }
            });
        }
    });
};


exports.loginUser=function(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, function(err, user) {
        if(err){
            res.status(500).send({message: 'Internal server error'});
        }else{
            if(user){
                bcrypt.compare(password,user.password, function(err, check){
                    if(check) {

                        console.log(user);
                        user.token=jwt.createToken(user);
                        res.status(200).json(user);

                    }else{
                        res.status(401).send({message: 'Incorrect credentials'});
                    }
                })
            }else{
                res.status(404).send({message: 'User not found'});
            }
        }
    });
};
exports.loginUserFB=function(req,res){
    var params = req.body;
    var email = params.email;
    console.log(params);

    User.findOne({email: email.toLowerCase()}, function(err, user) {
        if(err){
            res.status(500).send({message: 'Internal server error'});
        }else{
            if(user){
                console.log(user);
                user.token=jwt.createToken(user);
                res.status(200).json(user);

            }else{
                var newUser = new User(req.body);
                console.log(newUser);
                newUser.save(function (err, user) {
                    if (err) {
                        console.log('error');
                        res.status(500).send({message: `Internal server error: ${err}`});
                    }
                    else{
                        user.token=jwt.createToken(user);
                        res.status(200).json(user);
                    }
                });
            }
        }
    });

};


exports.updateUser = function(req, res) {
    var userId = req.params.userId;
    var update = req.body;
    var tokenInfo=req.user;

    bcrypt.hash(req.body.password, null, null, function (err, hash) {
        var update = req.body;
        update.password=hash;
        if (err)
            res.status(500).send({message: `Internal server error: ${err}`});
        else{
            if(userId != tokenInfo.sub && !tokenInfo.admin){
                res.status(403).send({message: 'No privileges'});
            }
            else{
                User.findByIdAndUpdate(userId, update, {new: true}, function(err, user) {
                    if (err)
                        res.status(500).send({message: `Internal server error: ${err}`});
                    else
                        res.status(200).json(user);
                });
            }
        }
    });
};


exports.updateUser2 = function(req, res) {
    var userId = req.params.userId;


    bcrypt.hash(req.body.password, null, null, function (err, hash) {
        var update = req.body;
        update.password=hash;

            User.findByIdAndUpdate(userId, update, {new: true}, function(err, user) {
                if (err)
                    res.status(500).send({message: `Internal server error: ${err}`});
                res.status(200).json(user);
            });
        });
    };

exports.deleteUser = function(req, res) {
    var userId = req.params.userId;
    var tokenInfo=req.user;


   if (userId != tokenInfo.sub && !tokenInfo.admin){
        res.status(403).send({message: 'No privileges'});
    }
    
    User.findByIdAndRemove(userId, function(err, user) {
        if (err)
            res.status(500).send({message: `Internal server error: ${err}`});
        else
            res.status(200).json({ message: 'User successfully deleted' });
    });
    

};

exports.deleteUser2 = function(req, res) {

    User.findByIdAndRemove(req.params.userId, function(err, user) {
        if (err)
            res.status(500).send({message: `Internal server error: ${err}`});
        res.status(200).json({ message: 'User successfully deleted' });
    });
};

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    secure: false, // use SSL
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: "ea.aleixguillemgurkeemikel@gmail.com",
        pass: "proyectoea"
    }
});

exports.postContact = function(req, res) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('message', 'Message cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).send({message: errors});
    }else {
        var from = req.body.email;
        var name = req.body.name;
        var body = req.body.message;
        var to = 'ea.aleixguillemgurkeemikel@gmail.com';
        var subject = 'Contact Form | Opinalia (' + name + ')';

        var mailOptions = {
            to: to,
            from: from,
            subject: subject,
            text: body
        };

        smtpTransport.sendMail(mailOptions, function (err, response) {
            if (err) {
                res.status(500).send({message: `Internal server error: ${err}`});
            } else {
                res.status(200).json({message: "Message sent: " + response.message});
            }
        });
    }
};