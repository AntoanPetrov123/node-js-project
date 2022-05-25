const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = new mongodb.ObjectId(id);
    }

    //connect to mongodb and save new product or edit them
    save() {
        const db = getDb();
        let dbOperation;
        if (this._id) {
            dbOperation = db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOperation = db.collection('products').insertOne(this);
        }
        //connect to product collection
        return dbOperation
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            // .find({ _id: prodId }) //this wont work because _id: ObjectId("id") we need to parse
            .find({ _id: new mongodb.ObjectId(prodId) })
            .next()
            .then(product => {
                console.log(product, 'product');
                return product;
            })
            .catch(err => console.log(err));
    }
}

//SEQUEL
// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');
// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

module.exports = Product;




// const fs = require('fs');
// const path = require('path');

//METHODS WITH MYSQL
// |  |  |  |  |
// V  V  V  V  V
// const db = require('../util/database');

// const Cart = require('./cart');

// // const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
// //THIS IS HOW WE GET PRODUCTS FROM FILE
// // const getProductsFromFile = callback => {
// //     fs.readFile(p, (err, fileContent) => {
// //         if (err) {
// //             callback([]);
// //         } else {
// //             callback(JSON.parse(fileContent));
// //         }
// //     });
// // }

// module.exports = class Product {
//     constructor(id, title, imageUrl, price, description) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.price = price;
//         this.description = description;
//     }

//     save() {
//         return db.execute(
//             'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [this.title, this.price, this.imageUrl, this.description]
//         );
//     }

//     static deleteById(id) {

//     }

//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//     }

//     static findByPk(id) {
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//     }

//METHODS WITH FILES
// |  |  |  |  |
// V  V  V  V  V

//THIS IS HOW WE SAVE PRODUCTS IN FILE
// save() {
//     getProductsFromFile(products => {
//         if (this.id) {
//             const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//             const updatedProducts = [...products];
//             updatedProducts[existingProductIndex] = this; //this - updated product
//             fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//                 console.log(err);
//             });
//         } else {
//             this.id = Math.random().toString(); //generate random id
//             products.push(this);
//             fs.writeFile(p, JSON.stringify(products), (err) => {
//                 console.log(err);
//             });
//         }
//     });
// }
//THIS IS HOW WE DELETE PRODUCTS FROM FILE
// static deleteById(id) {
//     getProductsFromFile(products => {
//         const product = products.find(prod => prod.id === id);
//         const updatedProducts = products.filter(prod => prod.id !== id); //dont save product with this id
//         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//             if (!err) {
//                 Cart.deleteProduct(id, product.price); //delete product from cart if it was there
//             }
//         });
//     });
// }
//THIS IS HOW WE FETCH PRODUCTS FROM FILE
// static fetchAll(callback) {
//     getProductsFromFile(callback);
// }
//THIS IS HOW WE FIND PRODUCT BY ID IN FILE
// static findByPk(id, callback) {
//     getProductsFromFile(products => {
//         const product = products.find(p => p.id === id);
//         callback(product);
//     });
// }
// };