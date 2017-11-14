var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../controllers/user');



//GET REQUESTS
//get all the users
router.get('/all',users.listAllUsers);
//get user by id
router.get('/:email',users.findByEmail);

//POST REQUESTS
//register a user
router.post('/register', users.registerUser);
//login a user
router.post('/login', users.loginUser);

//UPDATE REQUESTS
//update user by id
router.post('/:userId', users.updateUser);

//DELETE REQUESTS
//delete user by id
router.delete('/:userId',users.deleteUser);


module.exports=router;