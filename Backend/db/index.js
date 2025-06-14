const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('DB connection failed:', err.message);
    } else {
        console.log('MySQL connected successfully');
        connection.release();
    }
})

module.exports = pool.promise();