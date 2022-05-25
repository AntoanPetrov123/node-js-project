const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
// const expressHbs = require('express-handlebars');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


//SEQUEL
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-items');



const app = express();

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

//TEST CODE FOR MYSQL
// db.execute('SELECT * FROM products')
// .then(result => {
//     console.log(result);
// })
// .catch(err => {
//     console.log(err);
// });

app.use(bodyParser.urlencoded({ extended: false })); //parse only from forms
app.use(express.static(path.join(__dirname, 'public'))); //helps us for generate css

app.use((req, res, next) => {
    User.findById("628e67f6b1bc84495c31b974")
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

//ROUTES
app.use('/admin', adminRoutes); //this is from export in admins.js
app.use(shopRoutes);
app.use(errorController.get404);

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

mongoConnect(() => {
    app.listen(3000);
});