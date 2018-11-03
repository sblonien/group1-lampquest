let mysql = require('mysql');
let credentials = require('../../credentials/config');

let pool = mysql.createPool(credentials.prod);

module.exports = { connection_pool: pool };

/* this is a comment */