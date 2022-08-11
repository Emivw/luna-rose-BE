const mysql = require('mysql');
require('dotenv').config;
const connection = mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    database: process.env.db,
    password: process.env.dbpass,
    port: process.env.dbport
});
connection.connect();
module.exports = connection;