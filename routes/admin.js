const express = require('express');

// const path = require('path');
const adminController = require('../controllers/admin');

// const rootDir = require('../util/path');

const router = express.Router();

//ROUTES
// /admin/PATH => GET
router.get('/add-product', adminController.getAddProduct); //go for adding
router.get('/products', adminController.getProducts);
router.get('/edit-product/:productId', adminController.getEditProduct); //go for editing
// /admin/PATH => POST
router.post('/add-product', adminController.postAddProduct); //add product
router.post('/edit-product', adminController.postEditProduct); //save edited
router.post('/delete-product', adminController.postDeleteProduct);


// module.exports = router;
// exports.routes = router;
// exports.products = products;


module.exports = router;