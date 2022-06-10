const Product = require('../models/product');
// const mongodb = require('mongodb');
const fileHelper = require('../util/file');

const { validationResult } = require('express-validator');


// const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    }); //use path to make a.active() for current page
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path; //path in our file system

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            // console.log(result);
            // console.log('Created Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const isEditMode = req.query.edit; //check if we have "edit" in our link
    if (!isEditMode) {
        return redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: isEditMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        }).catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        );
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            // console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        );
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId; //productId is hidden input where we store this value
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => { //mongoose object

            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            //update if we give new image file
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }

            return product.save().then(() => {
                console.log('UPDATED PRODUCT!');
                res.redirect('/admin/products');
            });
        })
        .catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        );
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found!'));
            }
            fileHelper.deleteFile(product.imageUrl);
            Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(result => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        );
};


//MongoDB
// const Product = require('../models/product');
// const mongodb = require('mongodb');


// const ObjectId = mongodb.ObjectId;

// exports.getAddProduct = (req, res, next) => {
//     // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
//     res.render('admin/edit-product', {
//         pageTitle: 'Add Product',
//         path: '/admin/add-product',
//         editing: false
//     }); //use path to make a.active() for current page
// };

// exports.postAddProduct = (req, res, next) => {
//     // products.push({ title: req.body.title }); //add product to our list
//     const title = req.body.title;
//     const imageUrl = req.body.imageUrl;
//     const price = req.body.price;
//     const description = req.body.description;
//     const product = new Product(title, price, description, imageUrl, null, req.user._id);
//     product.save()
//         .then(result => {
//             // console.log(result);
//             console.log('Created Product!');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.log(err);
//         });

// };

// exports.getProducts = (req, res, next) => {
//     Product.fetchAll()
//         .then(products => {
//             res.render('admin/products', {
//                 prods: products,
//                 pageTitle: 'Admin Products',
//                 path: '/admin/products',
//             });
//         })
//         .catch(
//             err => console.log(err)
//         );
// };

// exports.getEditProduct = (req, res, next) => {
//     const isEditMode = req.query.edit; //check if we have "edit" in our link
//     if (!isEditMode) {
//         return redirect('/');
//     }
//     const prodId = req.params.productId;
//     //get params of a selected product for edit
//     // Product.findByPk(prodId)
//     Product.findById(prodId)
//         .then(product => {
//             if (!product) {
//                 return redirect('/');
//             }
//             res.render('admin/edit-product', {
//                 pageTitle: 'Edit Product',
//                 path: '/admin/edit-product',
//                 editing: isEditMode,
//                 product: product
//             });
//         }).catch(
//             err => console.log(err)
//         )
// };

// //save edited products data
// exports.postEditProduct = (req, res, next) => {
//     const prodId = req.body.productId; //productId is hidden input where we store this value
//     const updatedTitle = req.body.title;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedPrice = req.body.price;
//     const updatedDescription = req.body.description;

//     const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId);
//     product
//         .save()
//         .then(() => {
//             console.log('UPDATED PRODUCT!');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     Product.deleteById(prodId)
//         .then(result => {
//             console.log('DESTROYED PRODUCT');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

//SEQUEL
// exports.getEditProduct = (req, res, next) => {
//     const isEditMode = req.query.edit; //check if we have "edit" in our link
//     if (!isEditMode) {
//         return redirect('/');
//     }
//     const prodId = req.params.productId;
//     //get params of a selected product for edit
//     // Product.findByPk(prodId)
//     req.user.getProducts({ where: { id: prodId } })
//         .then(products => {
//             const product = products[0];
//             if (!product) {
//                 return redirect('/');
//             }
//             res.render('admin/edit-product', {
//                 pageTitle: 'Edit Product',
//                 path: '/admin/edit-product',
//                 editing: isEditMode,
//                 product: product
//             });
//         }).catch(
//             err => console.log(err)
//         )
// };

// //save edited products data
// exports.postEditProduct = (req, res, next) => {
//     const prodId = req.body.productId; //productId is hidden input where we store this value
//     const updatedTitle = req.body.title;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedPrice = req.body.price;
//     const updatedDescription = req.body.description;
//     Product.findByPk(prodId)
//         .then(product => {
//             product.title = updatedTitle;
//             product.price = updatedPrice;
//             product.imageUrl = updatedImageUrl;
//             product.description = updatedDescription;
//             return product.save(); //save to db
//         })
//         .then(result => {
//             console.log('UPDATED PRODUCT!');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

// exports.getProducts = (req, res, next) => {
//     req.user.getProducts()
//         .then(products => {
//             res.render('admin/products', {
//                 prods: products,
//                 pageTitle: 'Admin Products',
//                 path: '/admin/products',
//             });
//         })
//         .catch(
//             err => console.log(err)
//         );
// };

// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     Product.findByPk(prodId)
//         .then(product => {
//             return product.destroy();
//         })
//         .then(result => {
//             console.log('DESTROYED PRODUCT');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };