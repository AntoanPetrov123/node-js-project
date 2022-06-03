// const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    // console.log(adminData.products);//show our list of products
    // res.sendFile(path.join(rootDir, 'views', 'shop.html')); //this is for html file
    Product.find()
        .then(products => {
            // console.log(products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(
            err => console.log(err)
        );
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId) //method by mongoose
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));

};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products, //our products
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(
            err => console.log(err)
        );
};

exports.getCart = (req, res, next) => {
    // console.log(req);
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            // console.log(result);
            res.redirect('/cart');
        })
        .catch(err =>
            console.log(err)
        );
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc } }; //{...i.productId._doc } gives object with all keys
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            console.log(order);
            return order.save();
        })
        .then(result => {
            req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };

//MongoDB
// exports.getProducts = (req, res, next) => {
//     // console.log(adminData.products);//show our list of products
//     // res.sendFile(path.join(rootDir, 'views', 'shop.html')); //this is for html file
//     Product.fetchAll()
//         .then(products => {
//             res.render('shop/product-list', {
//                 prods: products,
//                 pageTitle: 'All Products',
//                 path: '/products'
//             });
//         })
//         .catch(
//             err => console.log(err)
//         );
// };

// exports.getProduct = (req, res, next) => {
//     const prodId = req.params.productId;
//     Product.findById(prodId)
//         .then(product => {
//             res.render('shop/product-detail', {
//                 product: product,
//                 pageTitle: product.title,
//                 path: '/products'
//             });
//         })
//         .catch(err => console.log(err));

// };

// exports.getIndex = (req, res, next) => {
//     Product.fetchAll()
//         .then(products => {
//             res.render('shop/index', {
//                 prods: products, //our products
//                 pageTitle: 'Shop',
//                 path: '/',
//             });
//         })
//         .catch(
//             err => console.log(err)
//         );
// };

// exports.getCart = (req, res, next) => {
//     // console.log(req.user.cart); //we cant load cart like this
//     req.user
//         .getCart()
//         .then(products => {
//             res.render('shop/cart', {
//                 path: '/cart',
//                 pageTitle: 'Your Cart',
//                 products: products
//             });
//         })
//         .catch(err => console.log(err));
//     // Cart.getProducts(cart => {
//     // Cart.getProducts(cart => {
//     //     const cartProducts = [];
//     //     Product.fetchAll(products => {
//     //         for (let product of products) {
//     //             const cartProductData = cart.products.find(prod => prod.id === product.id);
//     //             if (cartProductData) {
//     //                 cartProducts.push({ productData: product, qty: cartProductData.qty }); //this object is 'p' in cart.ejs
//     //             }
//     //         }
//     //         res.render('shop/cart', {
//     //             path: '/cart',
//     //             pageTitle: 'Your Cart',
//     //             products: cartProducts
//     //         });
//     //     });
//     // });
// };

// exports.postCart = (req, res, next) => {
//     const prodId = req.body.productId;
//     Product.findById(prodId)
//         .then(product => {
//             return req.user.addToCart(product);
//         })
//         .then(result => {
//             console.log(result);
//             res.redirect('/cart');
//         })
//         .catch(err =>
//             console.log(err)
//         );
//     // let fetchedCart;
//     // let newQuantity = 1;
//     // req.user.getCart()
//     //     .then(cart => {
//     //         fetchedCart = cart;
//     //         return cart.getProducts({ where: { id: prodId } });
//     //     })
//     //     .then(products => {
//     //         let product;
//     //         if (products.length > 0) {
//     //             product = products[0];
//     //         }
//     //         //if product is already in the cart
//     //         if (product) {
//     //             const oldQuantity = product.cartItem.quantity;
//     //             newQuantity = oldQuantity + 1;
//     //             return product;
//     //         }
//     //         return Product.findByPk(prodId)
//     //     }).then(product => {
//     //         //if product is not in the cart
//     //         return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
//     //     })
//     //     .then(() => {
//     //         res.redirect('/cart');
//     //     })
//     //     .catch(err => console.log(err));

//     // const prodId = req.body.productId;
//     // Product.findByPk(prodId, (product) => {
//     //     Cart.addProduct(prodId, product.price);
//     // });
//     // res.redirect('/cart');
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;

//     req.user.deleteItemFromCart(prodId)
//         .then(result => {
//             res.redirect('/cart');
//         })
//         .catch(err => console.log(err));
// };

// exports.postOrder = (req, res, next) => {
//     let fetchedCart;
//     req.user.addOrder()
//         .then(result => {
//             res.redirect('/orders');
//         })
//         .catch(err => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//     req.user.getOrders()
//         .then(orders => {
//             res.render('shop/orders', {
//                 path: '/orders',
//                 pageTitle: 'Your Orders',
//                 orders: orders
//             });
//         })
//         .catch(err => console.log(err));
// };

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };