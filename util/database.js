//SEQUEL
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('new_schema', 'root', '12345678', { dialect: 'mysql', host: 'localhost' });
// module.exports = sequelize; //handle async tasks and data insted of callbacks

//MONGODB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
    MongoClient.connect(
            'mongodb+srv://antoanpetrov1:antoanpetrov1@cluster0.sxj1res.mongodb.net/shop?retryWrites=true&w=majority'
        )
        .then(client => {
            console.log('Connected!');
            //store to database - shop
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err)
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!'
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;