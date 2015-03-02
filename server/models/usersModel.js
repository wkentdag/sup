/*
Users Database Api
Don't forget to change the conString to match your instance of postgres
*/

var pg = require('pg')
// var conString = "postgres://scotthurlow:1234@localhost/supUsers";
var user = process.env.USER
var pw = process.env.PW
var conString = "postgres://" + user + ":" + pw + "@localhost/supUsers";
var Users = {};
var client;

pg.connect(conString, function(err, cl, d){
  if (err) return console.error('error connecting to postgres', err)
  client = cl
})


// Only needs to be run once
Users.initTable = function(cb) {
  var qStr = "CREATE TABLE IF NOT EXISTS users(name varchar(80), location varchar(50), time int)"
  client.query(qStr, function(err, result){
      if (err) cb(err)
      cb(null, result)
  })
}


Users.addUser = function(usrObj, cb) {
  var usrArr = [ usrObj.name, usrObj.loc, usrObj.time ]
  var qStr = "INSERT INTO users(name, location, time) VALUES($1, $2, $3)"
  client.query(qStr, usrArr, function(err, result){
    if (err) cb(err)
    cb(null, result)
  })
}


Users.getAllUsers = function(cb) {
  var query = client.query("SELECT name, location, time FROM users")
  
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