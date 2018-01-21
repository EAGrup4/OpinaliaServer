var mongoose = require('mongoose');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var productsController = require('./product')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var nodemailer = require("nodemailer");
var async = require('async');
var crypto = require('crypto');
var request = require('request');

//Storage variable, for storin temporal images
var storage = multer.diskStorage({
  // destino del fichero
  destination: function (req, file, cb) {
    cb(null, './temp/')
  },
  // renombrar fichero
  filename: function (req, file, cb) {
    cb(null, req.params.userId + '-'+ Date.now()+ path.extname(file.originalname));
  }
});

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

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

exports.uploadImage = function(req, res) {
    var tokenInfo=req.user;
    var userId=req.params.userId;
    var upload = multer({ storage: storage
    }).array("uploads[]", 12);

    if(userId != tokenInfo.sub && !tokenInfo.admin){
        res.status(403).send({message: 'No privileges'});
    }
    else{
        upload(req, res, function(err) {
            if(err)
                res.status(500).send({message: `Internal server error: ${err}`})
            else{
                var file=req.files;
                //console.log(file[0].filename);
                cloudinary.uploader.upload(file[0].path, {folder: "opinalia/users"},function(err, result) {
                    if(err)
                        res.status(500).send({message: `Internal server error: ${err}`})
                    else{
                        var update = {};
                        update.profileImage=result.url;
                        update.imagePublicId=result.public_id;
                        console.log(result);

                        User.findOneAndUpdate({_id:userId}, update,{new: true})
                        .exec(function(err, user) {
                            if(err)
                                res.status(500).send({message: `Internal server error: ${err}`})
                            else{
                                console.log(file[0].path)
                                fs.unlink(file[0].path, function(error) {
                                    if (error) {
                                        throw error;
                                    }
                                    res.status(200).json(user)

                                });
                            }
                        })
                    }
                });
            }
        })
    }
};

/*exports.findByEmail = function(req, res) {
    var tokenInfo=req.user;
    var userId = req.params.userId;

    if(userId != tokenInfo.sub && !tokenInfo.admin){
        User.find({email:req.params.email}, function(err, user) {
            if (err)
                res.status(500).send({message: `Internal server error: ${err}`});
            else
                res.status(200).json(user);
        });
    }
};

exports.findByName = function(req, res) {
    var tokenInfo=req.user;
    var userId = req.params.userId;

    if(userId != tokenInfo.sub && !tokenInfo.admin){

        User.find({name:req.params.name}, function(err, user) {
            if (err)
                res.status(500).send({message: `Internal server error: ${err}`});
            else
                res.status(200).json(user);
        });
    }
};*/

exports.findById = function(req, res) {
    var tokenInfo=req.user;
    var userId = req.params.userId;

    if(userId != tokenInfo.sub && !tokenInfo.admin){
        res.status(403).send({message: 'No privileges'});
    }
    else{
        User.find({_id:userId}, function(err, user) {
            if (err)
                res.status(500).send({message: `Internal server error: ${err}`});
            else
                res.status(200).json(user);
        });
    }
};

exports.getProfile = function(req, res) {
    var userId = req.params.userId;

    User.find({_id:userId})
    .select({password:0, admin:0})
    .exec( function(err, user) {
        if (err)
            res.status(500).send({message: `Internal server error: ${err}`});
        else
            res.status(200).json(user);
    });
};

exports.registerUser = function(req, res) {
    bcrypt.hash(req.body.password, null, null, function (err, hash) {
        if (err)
            res.status(500).send({message: `Internal server error: ${err}`});
        else{
            var newUser = new User(req.body);
            newUser.password = hash;

            delete newUser.token;
            delete newUser.admin;
            newUser.profileImage="http://res.cloudinary.com/grup04ea/image/upload/v1515145634/opinalia/users/default.png";
            newUser.imagePublicId="opinalia/users/default.png";

            newUser.save(function (err, user) {
                if (err){
                    if(err.code==11000)
                        res.status(409).send({message: `User already exists`});
                    else
                        res.status(500).send({message: `Internal server error: ${err}`});
                }
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

    User.findOne({email: email}, function(err, user) {
        if(err){
            res.status(500).send({message: 'Internal server error'});
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
                res.status(404).send({message: 'User not found'});
            }
        }
    });
};

exports.loginUserFB=function(req,res){
    var params = req.body.userr;
    var email = params.email;

    User.findOne({email: email}, function(err, user) {
        if(err){
            res.status(500).send({message: 'Internal server error'});
        }else{
            if(user){
                user.token=jwt.createToken(user);
                res.status(200).json(user);

            }else{
                var newUser = new User(req.body.userr);
                delete newUser.admin;
                newUser.profileImage="http://res.cloudinary.com/grup04ea/image/upload/v1515145634/opinalia/users/default.png";
                newUser.imagePublicId="opinalia/users/default.png";
                newUser.save(function (err, user) {
                    if (err){
                        if(err.code==11000)
                            res.status(409).send({message: `User already exists`});
                        else
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

    //delete blank files
    for (var f in update) {
        
        if(!update[f]){
            delete update[f]
        }
    }

    if(userId != tokenInfo.sub && !tokenInfo.admin){
        res.status(403).send({message: 'No privileges'});
    }
    else{
        if(!tokenInfo.admin)
            delete update.admin;

        delete update.profileImage;
        delete update.imagePublicId;

        if (req.body.password)
            bcrypt.hash(req.body.password, null, null, function (err, hash) {
                if (err)
                    res.status(500).send({message: `Internal server error: ${err}`});
                else{
                    var update = req.body;
                    update.password=hash;

                    User.findByIdAndUpdate(userId, update, {new: true}, function(err, user) {
                        if (err){
                            if(err.code==11000)
                                res.status(409).send({message: `User already exists`});
                            else
                                res.status(500).send({message: `Internal server error: ${err}`});
                        }
                        else
                            res.status(200).json(user);
                    });

                }
            });

        else{
            var update = req.body;

            User.findByIdAndUpdate(userId, update, {new: true}, function(err, user) {
                if (err){
                    if(err.code==11000)
                        res.status(409).send({message: `User already exists`});
                    else
                        res.status(500).send({message: `Internal server error: ${err}`});
                }
                else
                    res.status(200).json(user);
            });

        }
    }
};

exports.deleteUser = function(req, res) {
    var userId = req.params.userId;
    var tokenInfo=req.user;

    User.findOne({_id:userId}, function(err,user){
        if(err)
            res.status(500).send({message: `Internal server error: ${err}`});
        else if(!user)
            res.status(504).send({message: `User not exists`});
        else{

            if (userId != tokenInfo.sub && !tokenInfo.admin){
                res.status(403).send({message: 'No privileges'});
            }
            else{

                Product.find({'ratings.userId':userId}, function(err, products) {
                    if (err)
                        res.status(500).send({message: `Internal server error: ${err}`});
                    else{
                        productsController.delAllUserRates(userId, products, function(err){
                            if(err)
                                res.status(500).send({message: `Internal server error: ${err}`});
                            else{
                                User.findByIdAndRemove(userId, function(err, user) {
                                    if (err)
                                        res.status(500).send({message: `Internal server error: ${err}`});
                                    else
                                        res.status(200).json({ message: 'User successfully deleted' });
                                });
                            }
                        });
                    }
                });


                /*User.findByIdAndRemove(userId, function(err, user) {
                    if (err)
                        res.status(500).send({message: `Internal server error: ${err}`});
                    else
                        res.status(200).json({ message: 'User successfully deleted' });
                });*/

            }
        }
    });
};

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
        var to = process.env.EMAIL_USER;
        var subject = 'Contact Form | Opinalia (' + name + ')';
        var html ='<b>Hola. <strong>'+name+'</strong>, con el email: ' +from+ ' te ha enciado el siguiente mensaje: <b>"'+body+'"</b></p>';

        var mailOptions = {
            to: to,
            from: from,
            subject: subject,
            text: body,
            html: html
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

exports.forgot_password = function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                email: req.body.email
            }).exec(function(err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('User not found.');
                }
            });
        },
        function(user, done) {
            // create the random token
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function(user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                done(err, token, new_user);
            });
        },
        function(token, user, done) {
            var data = {
                to: user.email,
                from: process.env.EMAIL_USER,
                template: 'forgot-password-email',
                subject: 'Password help has arrived!',
                context: {
                    url: 'http://localhost/reset_password?token=' + token,
                    name: user.name.split(' ')[0]
                },
                html: 'http://localhost/reset_password?token=' + token
            };

            smtpTransport.sendMail(data, function(err) {
                if (!err) {
                    return res.json({ message: 'Kindly check your email for further instructions' });
                } else {
                    return done(err);
                }
            });
        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
};

exports.reset_password = function(req, res, next) {
    User.findOne({
        reset_password_token: req.body.token,
        reset_password_expires: {
            $gt: Date.now()
        }
    }).exec(function(err, user) {
        if (!err && user) {
            bcrypt.hash(req.body.password, null, null, function (err, hash) {
                if (err)
                    res.status(500).send({message: `Internal server error: ${err}`});
                else{
                    user.password = hash;
                }
            });
            user.reset_password_token = undefined;
            user.reset_password_expires = undefined;
            user.save(function(err) {
                if (err) {
                    return res.status(422).send({
                        message: err
                    });
                } else {
                    var data = {
                        to: user.email,
                        from: 'ea.aleixguillemgurkeemikel@gmail.com',
                        template: 'reset-password-email',
                        subject: 'Password Reset Confirmation',
                        context: {
                            name: user.name.split(' ')[0]
                        }
                    };
                    smtpTransport.sendMail(data, function(err) {
                        if (!err) {
                            return res.json({ message: 'Password reset' });
                        } else {
                            return done(err);
                        }
                    });
                }
            });
        } else {
            return res.status(400).send({
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
};

