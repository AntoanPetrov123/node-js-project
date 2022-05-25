const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart; //{items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            if (cp.productId.toString() === product._id.toString()) {
                return true;
            } else {
                return false;
            }
        });
        let updatedQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            updatedQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = updatedQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: updatedQuantity });
        }
        const updatedCart = { items: updatedCartItems }; //add product id and quantity key

        const db = getDb();
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });

    }

    getCart() {
        const db = getDb();
        //save all prods from current cart id in arr
        const cartProductsIdArr = this.cart.items.map(i => {
            return i.productId;
        })
        return db.collection('products')
            .find({ _id: { $in: cartProductsIdArr } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    //add quantity key back to every product product 
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                })
            });
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}


//SEQUEL
// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');
// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: Sequelize.STRING,
//     email: Sequelize.STRING
// });

module.exports = User;