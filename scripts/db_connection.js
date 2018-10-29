var mysql = require('mysql');
var credentials = require('../../credentials/config');

var pool = mysql.createPool(credentials.prod);

module.exports = { connection_pool: pool };