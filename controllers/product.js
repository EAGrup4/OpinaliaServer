var mongoose = require('mongoose');
var Product = mongoose.model('Product');



exports.listAllProducts = function(req, res) {
    Product.find({}, function(err, products) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(products);
    });
};

exports.findByName = function(req, res) {
    Product.find({name:req.params.productName}, function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(product);
    });
};


exports.addProduct= function(req, res) {
    var newProduct = new Product(req.body);
   newProduct.save(function(err, product) {
        if (err)
            res.status(500).send({message: `Error when saving in database: ${err}`});
        res.status(200).json(product);
    });
};


exports.updateProduct = function(req, res) {
    Product.findOneAndUpdate({_id:req.params.productId}, req.body, {new: true}, function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(product);
    });
};

exports.addRating = function(req, res) {
    Product.findOneAndUpdate({_id:req.params.productId}, {$push: {ratings: req.body.ratings}}, {new: true}, function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(product);
    });
};

exports.deleteProduct = function(req, res) {
    Product.findByIdAndRemove(req.params.productId, function(err, product) {
        if (err)
            res.status(500).send({message: `Error when deleting in database: ${err}`});
        res.status(200).json({ message: 'Product successfully deleted' });
    });
};