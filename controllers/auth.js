const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

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
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {

            if (!user) {
                req.flash('error', 'Invalid email or password!'); //key, message
                return res.redirect('/login');
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
                    req.flash('error', 'Invalid email or password!');
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        });
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
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const comfirmPassword = req.body.comfirmPassword;

    User.findOne({ email: email }) //chek if we already have user with this email
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email exists already!');
                return res.redirect('/signup');
            }

            return bcrypt.hash(password, 12)
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
                });
        })
        .catch(err => {
            console.log(err);
        });;
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
            .catch(err => {
                console.log(err);
            });
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
                userId: user._id.toString()
            });
        })
        .catch(err => {
            console.log(err);
        });


};