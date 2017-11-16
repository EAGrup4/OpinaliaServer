var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../controllers/user');


//GET REQUESTS
//Get all the users
router.get('/all',users.listAllUsers);
//Get a user by email
router.get('/:email',users.findByEmail);
//Get a user by email
router.get('/:name',users.findByName);


//POST REQUESTS
//Register a new user
router.post('/register', users.registerUser);
//Login a user
router.post('/login', users.loginUser);


//UPDATE REQUESTS
//Update user by id
router.post('/:userId', users.updateUser);


//DELETE REQUESTS
//Delete user by id
router.delete('/:userId',users.deleteUser);


module.exports=router;