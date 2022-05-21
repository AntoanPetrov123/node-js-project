const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
    // console.log(adminData.products);//show our list of products
    // res.sendFile(path.join(rootDir, 'views', 'shop.html')); //this is for html file
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All Products',
                path: '/products',
                // hasProducts: rows.length > 0, //this is for rendering pug file
                // activeShop: true,
                // productCSS: true,
                //layout: false  //special key
            });
        })
        .catch(
            err => console.log(err)
        );
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product]) => {
            res.render('shop/product-detail', {
                product: product[0],
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(
            err => console.log(err)
        );

};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                prods: rows, //rows - our products
                pageTitle: 'Shop',
                path: '/',
                // hasProducts: products.length > 0, //this is for rendering pug file
                // activeShop: true,
                // productCSS: true,
                // //layout: false  //special key
            });
        })
        .catch(
            err => console.log(err)
        );
};

exports.getCart = (req, res, next) => {
    // Cart.getProducts(cart => {
    Cart.getProducts(cart => {
        const cartProducts = [];
        Product.fetchAll(products => {
            for (let product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty }); //this object is 'p' in cart.ejs
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

