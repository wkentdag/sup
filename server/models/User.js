/*
Users Database Api
*/

/**
  *
  * Database Connection:
  *
**/
var pg = require('pg');
var user = process.env.USER;
var pw = process.env.PW;
var conString = "postgres://" + user + ":" + pw + "@localhost/SUP";
var Users = {};
var client;

pg.connect(conString, function(err, cl, d){
  if (err) {
    return console.error('Error connecting to postgres', err)
  } 
  client = cl;
});


/**
  *
  * User methods:
  *
**/

Users.addUser = function(usrObj, cb) {
  var usrArr = [ usrObj.id, usrObj.name, usrObj.email ]
  var qStr = "INSERT INTO users(user_id, name, email) VALUES($1, $2, $3)"
  client.query(qStr, usrArr, function(err, result){
    if (err) return cb(err)
    cb(null, result)
  })
}

Users.getUserById = function(user_id, cb) {
  var qStr = "SELECT user_id, name, email FROM users WHERE user_id = $1"
  client.query(qStr, [user_id], function(err, result){
    if (err) return cb(err)
    cb(null, result)
  })
}

Users.getAllUsers = function(cb) {
  var query = client.query("SELECT * FROM users")
  
  query.on('error', function(err) {
    cb(err)
  })
  query.on('row', function(row, result) {
    result.addRow(row)
  })
  query.on('end', function(result) {
    cb(null, result.rows)
  })
}


module.exports = Users;