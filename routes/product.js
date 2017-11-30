var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var products = require('../controllers/product');


//GET REQUESTS
//Get all the products
router.get('/all',products.listAllProducts);
//Get a product by name
router.get('/:productName',products.findByName);
//Get a product by name, category or company
router.get('/searchProduct/:text/:category', products.findText);


//POST REQUESTS
//Add a new product
router.post('/add', products.addProduct);


//UPDATE REQUESTS
//Update a product by Id
router.post('/:productId', products.updateProduct);
//Add rating to a product
router.post('/rating/:productId', products.addRating);
//Delete rating from product
router.post('/pullRating/:productId/', products.deleteRating);


//DELETE REQUESTS
//Delete a product by Id
router.delete('/:productId',products.deleteProduct);

router.post('/rating/:productId', products.addRating);



module.exports=router;