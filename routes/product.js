var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var products = require('../controllers/product');



//GET REQUESTS
//get all the products
router.get('/all',products.listAllProducts);
//get product by id
router.get('/:productName',products.findByName);

//POST REQUESTS
//insert product
router.post('/add', products.insertProduct);

//UPDATE REQUESTS
//update product by id
router.post('/:productId', products.updateProduct);
router.post('/push/:productId', products.updateProductArray);

//DELETE REQUESTS
//delete product by id
router.delete('/:productId',products.deleteProduct);


module.exports=router;