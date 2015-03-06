/*
Users Database Api
*/

var pg = require('pg')
var user = process.env.USER
var pw = process.env.PW
var conString = "postgres://" + user + ":" + pw + "@localhost/SUP";
var Users = {};
var client;

pg.connect(conString, function(err, cl, d){
  if (err) return console.error('Error connecting to postgres', err)
  client = cl
})


Users.addUser = function(usrObj, cb) {
  var usrArr = [ usrObj.id, usrObj.name, usrObj.email ]
  var qStr = "INSERT INTO users(user_id, name, email) VALUES($1, $2, $3)"
  client.query(qStr, usrArr, function(err, result){
    if (err) cb(err)
    cb(null, result)
  })
}


Users.addStatus = function(statusObj, cb) {
  var statusArr = [ statusObj.id, statusObj.owner, statusObj.loc, statusObj.time ]
  var qStr = "INSERT INTO status(status_id, owner_id, location, time) VALUES($1, $2, $3, $4)"
  client.query(qStr, statusArr, function(err, result){
    if (err) cb(err)
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

Users.getAllStatus = function(cb) {
  var query = client.query("SELECT * FROM status")
  
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


Users.getVisibleStatus = function(user_id, cb){
  var qStr = "SELECT * \
              FROM status, statusView \
              WHERE statusView.user_id = $1"
  
  client.query(qStr, [user_id],function(err, result){
    if (err) return cb(err)
    cb(null, result)
  })
}


module.exports = Users;