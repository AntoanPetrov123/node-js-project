const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
// const expressHbs = require('express-handlebars');

// const db = require('./util/database');

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
app.set('views', 'views');// fist views is name of folder

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

app.use(bodyParser.urlencoded({ extended: false }));//parse only from forms
app.use(express.static(path.join(__dirname, 'public'))); //helps us for generate css

//ROUTES
app.use('/admin', adminRoutes); //this is from export in admins.js
app.use(shopRoutes);
app.use(errorController.get404);


// const server = http.createServer(app);
// server.listen(3000);
//CONNECT TO LOCALHOST
app.listen(3000);


