const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    }); //use path to make a.active() for current page
};

exports.postAddProduct = (req, res, next) => {
    // products.push({ title: req.body.title }); //add product to our list
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description
        })
        .then(result => {
            // console.log(result);
            console.log('Created Product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });

};


exports.getEditProduct = (req, res, next) => {
    const isEditMode = req.query.edit; //check if we have "edit" in our link
    if (!isEditMode) {
        return redirect('/');
    }
    const prodId = req.params.productId;
    //get params of a selected product for edit
    Product.findByPk(prodId)
        .then(product => {
            if (!product) {
                return redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: isEditMode,
                product: product
            });
        }).catch(
            err => console.log(err)
        )
};

//save edited products data
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId; //productId is hidden input where we store this value
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save(); //save to db
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(
            err => console.log(err)
        );
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};