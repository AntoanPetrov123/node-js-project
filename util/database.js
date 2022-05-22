const Sequelize = require('sequelize');

const sequelize = new Sequelize('new_schema', 'root', '12345678', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize; //handle async tasks and data insted of callbacks