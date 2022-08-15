const mysql = require('mysql');
require('dotenv').config;
const connection = mysql.createPool({
    host: process.env.dbhost,
    user: process.env.dbuser,
    database: process.env.database,
    password: process.env.dbpass,
    port: process.env.dbport,
    connectionLimit: 10
});
// connection.connect();
module.exports = connection;