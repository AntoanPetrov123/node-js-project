const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'new_schema', //database name
    password: '12345678'
});

module.exports = pool.promise(); //handle async tasks and data insted of callbacks