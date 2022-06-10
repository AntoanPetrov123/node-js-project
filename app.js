/*
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBSessionStore = require('connect-mongodb-session')(session);
// const expressHbs = require('express-handlebars');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


//SEQUEL
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-items');

const MONGODB_URI = 'mongodb+srv://antoanpetrov1:antoanpetrov1@cluster0.sxj1res.mongodb.net/shop';

const app = express();
const store = new MongoDBSessionStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});



// app.engine('hbs',
// expressHbs({
//  layoutsDir: 'views/layouts/',
//  defaultLayout: 'main-layout', 
//  extname: 'hbs'})); //this is for handlebars

// app.set('view engine', 'hbs'); //name / value - for hbs files
// app.set('view engine', 'pug');//name / value - for pug files

//RENDERING EJS FILES
app.set('view engine', 'ejs'); //name / value - for ejs files
app.set('views', 'views'); // fist views is name of folder

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//TEST CODE FOR MYSQL
// db.execute('SELECT * FROM products')
// .then(result => {
//     console.log(result);
// })
// .catch(err => {
//     console.log(err);
// });

//MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false })); //parse only from forms
app.use(express.static(path.join(__dirname, 'public'))); //helps us for generate css
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

// get user for session
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    console.log(req.session, 'session');
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

//SEQUEL
//relations user and products and cart
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });


// sequelize
// // .sync({ force: true }) //override our table(optional)
//     .sync()
//     .then(
//         result => {
//             return User.findByPk(1);
//         }
//     )
//     .then(user => {
//         if (!user) {
//             return User.create({ name: 'Antoan', email: 'test@test.com' }); //create a basic user
//         }

//         return Promise.resolve(user);
//     })
//     .then(user => {
//         // console.log(user);
//         user.createCart(); //create basic cart to a user
//     })
//     .then(cart => {
//         app.listen(3000);

//     })
//     .catch(err => {
//         console.log(err);
//     })


// const server = http.createServer(app);
// server.listen(3000);
//CONNECT TO LOCALHOST

// mongoConnect(() => {
//     app.listen(3000);
// // });
// app.use((req, res, next) => {
//     User.findById("62977087d6a498b26e977c08")
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

//ROUTES
app.use('/admin', adminRoutes); //this is from export in admins.js
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Antoan',
                    email: 'antoan@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

*/

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');


const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
    'mongodb+srv://antoanpetrov1:antoanpetrov1@cluster0.sxj1res.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

//store uploaded files
const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getMilliseconds().toString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

//MIDDLEWARE
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); //this chek for specific type (file) with name="image"
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    console.log(req.session, 'user id');
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    res.status(500)
        .render('500', {
            pageTitle: 'Error!',
            path: '/500',
            isAuthenticated: req.session.isLoggedIn
        });
});

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });