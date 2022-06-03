const express = require('express');

// const path = require('path');
// const rootDir = require('../util/path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

//ROUTES
// /admin/PATH => GET
router.get('/add-product', isAuth, adminController.getAddProduct); //go for adding
router.get('/products', isAuth, adminController.getProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); //go for editing
// // /admin/PATH => POST
router.post('/add-product', isAuth, adminController.postAddProduct); //add product
router.post('/edit-product', isAuth, adminController.postEditProduct); //save edited
router.post('/delete-product', isAuth, adminController.postDeleteProduct);


// module.exports = router;
// exports.routes = router;
// exports.products = products;


module.exports = router;