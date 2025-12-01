const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'madani_shop',
    password: 'Mani2004',
});

module.exports = pool.promise();