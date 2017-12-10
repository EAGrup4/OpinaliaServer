var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var products = require('../controllers/product');
var md_auth = require('../middlewares/authenticated')


//GET REQUESTS
//Get all the products
router.get('/all',products.listAllProducts);
//Get best products
router.get('/best',products.bestProducts);
//Get best products
router.get('/best7',products.best7Products);
//Get by id
router.get('/id/:productId',products.findById);
//Get a product by name
router.get('/name/:productName',products.findByName);
//Get a product by category
router.get('/category/:productCategory', products.findByCategory);
//Get a product by company
router.get('/company/:productCompany', products.findByCompany);
//Get best 7 products
router.get('/best7/:productCategory',products.best7TypeProducts);
//Get best products
router.get('/bestCategory/:productCategory',products.bestTypeProducts);
//Get best products
router.get('/bestCompany/:productCompany',products.bestCompaniesProducts);
//Get a product by name, category or company
router.get('/searchProduct/:text/:category', products.findTextCategory);
//Get a product by name and/or company
router.get('/searchProduct2/:text/:company', products.findTextCompany);



//POST REQUESTS
//Add a new product
router.post('/add', md_auth.ensureAuth, products.addProduct);


//UPDATE REQUESTS
//Update a product by Id
router.post('/:productId', md_auth.ensureAuth, products.updateProduct);
//Add rating to a product
router.post('/rating/:productId', md_auth.ensureAuth, products.addRating);
//Delete rating from product
router.post('/pullRating/:productId/', md_auth.ensureAuth, products.deleteRating);


//DELETE REQUESTS
//Delete a product by Id
router.delete('/:productId', md_auth.ensureAuth, products.deleteProduct);




module.exports=router;