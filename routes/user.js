var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../controllers/user');
var md_auth = require('../middlewares/authenticated')


//GET REQUESTS
//Get all the users
router.get('/all', md_auth.ensureAuth, users.listAllUsers);
//Get a user by email
//router.get('/email/:email', md_auth.ensureAuth, users.findByEmail);
//Get a user by name
//router.get('/name/:name',  md_auth.ensureAuth, users.findByName);
//Get a user by id
router.get('/id/:userId',  md_auth.ensureAuth, users.findById);
//Get a user by id
router.get('/profile/:userId', users.getProfile);

//POST REQUESTS
//Register a new user
router.post('/register', users.registerUser);
//Login a user
router.post('/login', users.loginUser);
router.post('/loginFB', md_auth.ensureAuthFB, users.loginUserFB);
//Contact
router.post('/contact', users.postContact);
//Forgot password
router.post('/auth/forgotPassword', users.forgot_password);
//Reset password
router.post('/auth/reset_password', users.reset_password);


//UPDATE REQUESTS
//Update user by id
router.post('/:userId', md_auth.ensureAuth, users.updateUser);
router.post('/image/add/:userId', md_auth.ensureAuth, users.uploadImage);

//DELETE REQUESTS
//Delete user by id
router.delete('/:userId', md_auth.ensureAuth, users.deleteUser);





module.exports=router;