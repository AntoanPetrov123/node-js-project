const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const app = express();

// app.engine('hbs',
    // expressHbs({
    //  layoutsDir: 'views/layouts/',
    //  defaultLayout: 'main-layout', 
    //  extname: 'hbs'})); //this is for handlebars

// app.set('view engine', 'hbs'); //name / value - for hbs files

app.set('view engine', 'ejs'); //name / value - for ejs files

// app.set('view engine', 'pug');//name / value - for pug files
app.set('views', 'views');// fist views is name of folder

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');


app.use(bodyParser.urlencoded({ extended: false }));//parse only from forms
app.use(express.static(path.join(__dirname, 'public'))); //helps us for generate css

app.use('/admin', adminRoutes); //this is from export in admins.js
app.use(shopRoutes);

app.use(errorController.get404);

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);


