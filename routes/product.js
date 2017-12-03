var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var products = require('../controllers/product');


//GET REQUESTS
//Get all the products
router.get('/all',products.listAllProducts);
//Get by id
router.get('/id/:productId',products.findById);
//Get a product by name
router.get('/name/:productName',products.findByName);
//Get a product by name, category or company
router.get('/searchProduct/:text/:category', products.findText);
//Get best products
router.get('/best',products.bestProducts);
//Get best products
router.get('/best/:productCategory',products.bestTypeProducts);
//Get a product by name and/or company
router.get('/searchProduct2/:text/:company', products.findTextCompany);
//Get a product by category
router.get('/category/:productCategory', products.findByCategory);


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