var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../controllers/user');
var md_auth = require('../middlewares/authenticated')


//GET REQUESTS
//Get all the users
router.get('/all', md_auth.ensureAuth, users.listAllUsers);
//Get a user by email
router.get('/email/:email', md_auth.ensureAuth, users.findByEmail);
//Get a user by name
router.get('/name/:name',md_auth.ensureAuth, users.findByName);


//POST REQUESTS
//Register a new user
router.post('/register', users.registerUser);
//Login a user
router.post('/login', users.loginUser);


//UPDATE REQUESTS
//Update user by id
router.post('/:userId', md_auth.ensureAuth, users.updateUser);
//Update provisional
router.post('/update/:userId', users.updateUser2);

//DELETE REQUESTS
//Delete user by id
router.delete('/:userId', md_auth.ensureAuth, users.deleteUser);
//Delete provisional
router.delete('/delete/:userId', users.deleteUser2);


module.exports=router;