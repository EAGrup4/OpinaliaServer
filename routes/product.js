var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var products = require('../controllers/product');


//GET REQUESTS
//Get all the products
router.get('/all',products.listAllProducts);
//Get a product by name
router.get('/:productName',products.findByName);


//POST REQUESTS
//Add a new product
router.post('/add', products.addProduct);


//UPDATE REQUESTS
//Update a product by Id
router.post('/:productId', products.updateProduct);
//Add rating to a product
router.post('/rating/:productId', products.addRating);


//DELETE REQUESTS
//Delete a product by Id
router.delete('/:productId',products.deleteProduct);


module.exports=router;