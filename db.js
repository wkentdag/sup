var pg = require('pg');

//	DB connection

var user = process.env.USER;
var pw = process.env.PW;
var db = process.env.DB;
var conString = "postgres://" + user + ":" + pw + "@localhost/" + db;

module.exports = conString;