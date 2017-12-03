var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Rating = mongoose.model('Rating')



exports.listAllProducts = function(req, res) {
    Product.find()
    //.populate({ path: 'ratings.userId' })
    .exec(function(err, products) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(products);
    });
};

exports.findByName = function(req, res) { 
    name=req.params.productName
    Product.find({name:{ "$regex": name, "$options": "i" }})
    //.populate({ path: 'ratings.userId' })
    .exec(function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(product);
    });
};

exports.findByCategory = function(req, res) {
    Product.find({category:req.params.productCategory})
    //.populate({ path: 'ratings.userId' })
    .exec(function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(product);
    });
};

exports.findById = function(req, res) {
    Product.findOne({_id:req.params.productId})
    .populate({ path: 'ratings.userId' })
    .exec(function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(product);
    });
};

exports.findText = function(req, res) {
    if (req.params.category === 'Todos' && req.params.text === '0'){
        Product.find()
        .populate({ path: 'ratings.userId' })
        .exec(function(err, products) {
            if (err)
                res.status(500).send({message: `Error when finding in database: ${err}`});
            res.status(200).json(products);
        });
    } else if (req.params.category === 'Todos'){
        Product.find({name:req.params.text}, function(err, product) {
            if (product.length === 0){
                Product.find({company:req.params.text})
                .populate({ path: 'ratings.userId' })
                .exec(function(err, product) {
                    if (product.length === 0) {
                        res.status(500).send({message: `Error when finding in database: ${err}`});
                    } else {
                        res.status(200).json(product);
                    }
                });
            } else {
                res.status(200).json(product);
            }
        });
    } else if (req.params.text === '0') {
        Product.find({category:req.params.category})
        .populate({ path: 'ratings.userId' })
        .exec(function(err, product) {
            if (product.length === 0) {
                res.status(500).send({message: `Error when finding in database: ${err}`});
            } else {
                res.status(200).json(product);
            }
        });
    } else {
        Product.find({name: req.params.text, category: req.params.category})
        .populate()
        .exec(function (err, product) {
            if (product.length === 0) {
                Product.find({company: req.params.text, category: req.params.category}, function (err, product) {
                    if (product.length === 0) {
                        res.status(500).send({message: `Error when finding in database: ${err}`});
                    } else {
                        res.status(200).json(product);
                    }
                });
            } else {
                res.status(200).json(product);
            }
        });
    }
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
    Product.findOneAndUpdate({_id:req.params.productId}, req.body, {new: true})
    .populate({ path: 'ratings.userId' })
    .exec(function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});
        res.status(200).json(product);
    });
};

exports.addRating = function(req, res) {
    var rating=req.body
    var productId=req.params.productId;
    
    Product.findOne({_id:req.params.productId, 'ratings.userId':rating.userId}).
    exec(function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});

        else if (!product){
            Product.findOneAndUpdate({_id:productId}, {$addToSet: {ratings: rating}}, {new: true}, function(err, product) {
                if (err)
                    res.status(500).send({message: `Error when finding in database: ${err}`});                

                this.getAvgR(product,rating, function(prod){
                    Product.findOneAndUpdate({_id:productId}, prod, {new: true})
                    .populate({ path: 'ratings.userId' })
                    .exec(function(err, product) {
                        if (err)
                            res.status(500).send({message: `Error when finding in database: ${err}`});
                        res.status(200).json(product);
                    });
                });
            })
        }
        else
            res.status(409).send({message: `Already rated`});
            //res.status(200).json(product);
        });

    /*
    Product.findOneAndUpdate({_id:req.params.productId}, {$addToSet: {ratings: req.body}}, {new: true}, function(err, product) {
        if (err)
            res.status(500).send({message: `Error when finding in database: ${err}`});

        product.numRates++;
        product.totalRate=product.totalRate+req.body.rate;
        product.avgRate=(product.totalRate/product.numRates).toFixed(1);

        Product.findOneAndUpdate({_id:req.params.productId}, product, {new: true})
        .populate({ path: 'ratings.userId' })
        .exec(function(err, product) {
            if (err)
                res.status(500).send({message: `Error when finding in database: ${err}`});
            res.status(200).json(product);
        });
        //res.status(200).json(product);
    });*/
};

exports.deleteRating = function(req, res) {   
   var rating=req.body
   var productId=req.params.productId;

   Product.findOneAndUpdate({_id:productId}, {$pull: {ratings: rating}}, {new: true}, function(err, product) {
    if (err)
        res.status(500).send({message: `Error when finding in database: ${err}`});

    this.getAvgR(product,rating, function(prod){
        Product.findOneAndUpdate({_id:productId}, prod, {new: true})
        .populate({ path: 'ratings.userId' })
        .exec(function(err, product) {
            if (err)
                res.status(500).send({message: `Error when finding in database: ${err}`});
            res.status(200).json(product);
        });
    });
        //res.status(200).json(product);
    });
};

exports.deleteProduct = function(req, res) {
    Product.findByIdAndRemove(req.params.productId, function(err, product) {
        if (err)
            res.status(500).send({message: `Error when deleting in database: ${err}`});
        res.status(200).json({ message: 'Product successfully deleted' });
    });
};

//private

getAvgR = function(product, rating, callback){

    var total = 0;
    var ratings=[]
    ratings=product.ratings;
    if(ratings.length>0){
        for(var i = 0; i < ratings.length; i++) {
            total += ratings[i].rate;
        }

        product.avgRate = (total / ratings.length).toFixed(1);
    }

    else
        product.avgRate = 0;
        //console.log("total: "+total)
        //console.log (product)
        
        //product.avgRate=(product.totalRate/product.numRates).toFixed(1);

        callback(product)

        
        //res.status(200).json(product);
    };