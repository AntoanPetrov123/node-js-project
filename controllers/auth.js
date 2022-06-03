const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {

            if (!user) {
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
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getSignup = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const comfirmPassword = req.body.comfirmPassword;

    User.findOne({ email: email }) //chek if we already have user with this email
        .then(userDoc => {
            if (userDoc) {
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
                });
        })
        .catch(err => {
            console.log(err);
        });;
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    });
};