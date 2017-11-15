var mongoose = require('mongoose');
var Product = mongoose.model('Product');

//read methods
exports.listAllProducts = function(req, res) {
    Product.find({}, function(err, products) {
        if (err)
            res.send(err);
        res.json(200, {products});
    });
};

exports.findByName = function(req, res) {
    Product.find({name:req.params.productName}, function(err, product) {
        if (err)
            res.send(err);
        res.json(200, {product});
    });
};


//insert methods
exports.insertProduct= function(req, res) {
    var newProduct = new Product(req.body);
   newProduct.save(function(err, product) {
        if (err)
            res.status(500).send({message: `Error when saving in database: ${err}`});
        res.json(200, {product});
    });
};


//update methods
exports.updateProduct = function(req, res) {
    Product.findOneAndUpdate({_id:req.params.productId}, req.body, {new: true}, function(err, product) {
        if (err)
            res.send(err);
        res.json(200, {product});
    });
};

exports.addRating = function(req, res) {
    Product.findOneAndUpdate({_id:req.params.productId}, {$push: {ratings: req.body.ratings}}, {new: true}, function(err, product) {
        if (err)
            res.send(err);
        res.json(product);
    });
};

//delete methods
exports.deleteProduct = function(req, res) {
    Product.findByIdAndRemove(req.params.productId, function(err, product) {
        if (err)
            res.send(err);
        res.json(200, { message: 'Product successfully deleted' });
    });
};