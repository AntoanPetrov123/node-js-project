const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');


const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "aa105b065e4674",
        pass: "4ed8993b4330cc"
    }
});
exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message, //use key
        oldInput: { email: '', password: '' },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: 'Incorrect password or email!',
            oldInput: { email: email, password: password },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {

            if (!user) {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: 'Incorrect password or email!',
                    oldInput: { email: email, password: password },
                    validationErrors: []
                });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        // console.log(user, 'USER');
                        return req.session.save(err => {
                            console.log(err);
                            return res.redirect('/');
                        });
                    }
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        path: '/login',
                        errorMessage: 'Incorrect password or email!',
                        oldInput: { email: email, password: password },
                        validationErrors: []
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        })
        .catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        );
};

exports.getSignup = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
        oldInput: { email: '', password: '', confirmPassword: '' },
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword },
            validationErrors: errors.array()
        });
    }


    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            return transport.sendMail({
                to: email,
                from: 'antoan@node-project.com',
                subject: 'Signedup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            });
        }).catch(err => {
            console.log(err);
        })
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message,
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User
            .findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transport.sendMail({
                    to: req.body.email,
                    from: 'antoan@node-project.com',
                    subject: 'Password reset',
                    html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password!</p>`
                });
            })
            .catch(
                err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                }
            );
    })
};

exports.getNewPassword = (req, res, next) => {

    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }) //greater than
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                pageTitle: 'Set new Password',
                path: '/new-password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
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

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User
        .findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(heshedPassword => {
            resetUser.password = heshedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        );
};