const express = require('express');
const { body } = require('express-validator');

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
router.post('/add-product', [
    body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
    body('price')
    .isFloat(),
    body('description')
    .isLength({ min: 3, max: 100 })
    .trim(),
], isAuth, adminController.postAddProduct); //add product
router.post('/edit-product', [
    body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
    body('price')
    .isFloat(),
    body('description')
    .isLength({ min: 3, max: 100 })
    .trim(),
], isAuth, adminController.postEditProduct); //save edited
router.delete('/product/:productId', isAuth, adminController.deleteProduct);


// module.exports = router;
// exports.routes = router;
// exports.products = products;


module.exports = router;