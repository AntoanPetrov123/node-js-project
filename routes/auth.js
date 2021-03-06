const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();


router.get('/login', authController.getLogin);
router.post('/login', [
    check('email')
    .isEmail()
    .withMessage('Incorrect email!'),
    body('password', 'Incorrect password or email!')
    .isLength({ min: 5 })
    .isAlphanumeric()
], authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
    '/signup', [
        check('email')
        .isEmail()
        .withMessage('Incorrect email!')

        .custom((value, { req }) => {
            return User.findOne({ email: value }) //chek if we already have user with this email
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email exists already!');
                    }
                });
        })
        .trim()
        .normalizeEmail(),
        body('password', 'Please enter a password at least 5 characters long, containing only numbers and letters!')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match!');
            }
            return true;
        })
    ],
    authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);





module.exports = router;