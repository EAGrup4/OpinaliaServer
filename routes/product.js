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
//Get best 7 products
router.get('/best7',products.best7Products);


//Get by id
router.get('/id/:productId',products.findById);
//Get a product by name
router.get('/name/:productName',products.findByName);
//search products by any fileld
router.get('/search/:word',products.SearchAny);

//Get a product by category
router.get('/category/:productCategory', products.findByCategory);
//Get best products o a category**
router.get('/category/best/:productCategory',products.bestByCategory);
//Get best 7 products**
router.get('/category/best7/:productCategory',products.best7ByCategory);
//Get a product by name, category or company**
router.get('/category/:text/:category', products.findInCategory);

//Get a product by company
router.get('/company/:productCompany', products.findByCompany);
//Get best products of a company**
router.get('/company/best/:productCompany',products.bestByCompany);
//Get a product by name and/or company**
router.get('/company/:text/:company', products.findInCompany);

router.get('/new/:limit', products.getNew);

//Ratings options
router.get('/ratings/best/:productId', products.getRatingsBest);//ratings ordered by best
router.get('/ratings/worst/:productId', products.getRatingsWorst);//ratings ordered by worst
router.get('/ratings/new/:productId', products.getRatingsNew);//ratings ordered by new
router.get('/ratings/old/:productId', products.getRatingsOld);//ratings ordered by old




//POST REQUESTS
//Add a new product
router.post('/add', md_auth.ensureAuth, products.addProduct);


//UPDATE REQUESTS
//Update a product by Id
router.post('/:productId', md_auth.ensureAuth, products.updateProduct);
//Add rating to a product
router.post('/rating/:productId', md_auth.ensureAuth, products.addRating);
//Delete rating from product
router.post('/rating/pull/:productId', md_auth.ensureAuth, products.deleteRating);
//Like rating from product
router.post('/rating/like/:productId/:ratingId', md_auth.ensureAuth, products.likeRating);
//Dislike rating from product
router.post('/rating/dislike/:productId/:ratingId', md_auth.ensureAuth, products.dislikeRating);
//Report rating from product
router.post('/rating/report/:productId/:ratingId', md_auth.ensureAuth, products.reportRating);
//Upload an image to product
router.post('/image/add/:productId', md_auth.ensureAuth, products.uploadImage);


//DELETE REQUESTS
//Delete a product by Id
router.delete('/:productId', md_auth.ensureAuth, products.deleteProduct);




module.exports=router;