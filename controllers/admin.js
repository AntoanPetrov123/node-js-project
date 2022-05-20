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

    const product = new Product(null, title, imageUrl, price, description); //null is for id
    product.save();
    res.redirect('/');
};


exports.getEditProduct = (req, res, next) => {
    const isEditMode = req.query.edit; //check if we have "edit" in our link
    if (!isEditMode) {
        return redirect('/');
    }
    const prodId = req.params.productId;
    //get params of a selected product for edit
    Product.findById(prodId, product => {
        if (!product) {
            return redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: isEditMode,
            product: product
        });
    });
};

//save edited products data
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId; //productId is hidden input where we store this value
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription); //null is for id
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};