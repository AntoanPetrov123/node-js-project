const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) });
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