const express = require('express');

// const path = require('path');
const adminController = require('../controllers/admin');

// const rootDir = require('../util/path');

const router = express.Router();

//ROUTES
// /admin/PATH => GET
router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getProducts);

// /admin/PATH => POST
router.post('/add-product', adminController.postAddProduct);



// module.exports = router;
// exports.routes = router;
// exports.products = products;


module.exports = router;