var express = require('express')
var pg = require('pg')
var faker = require('faker')

var conString = "postgres://scotthurlow:1234@localhost/supUsers";
var app = express()
var PORT = process.env.PORT || 3000;



// connect to postgres, return client
var client;
pg.connect(conString, function(err, cl, done){
  if (err) return console.error('error connecting to postgres', err)
  client = cl
})


// API GET request that sets up table and says hi.
app.get('/', function(req, res) {
  client.query("CREATE TABLE IF NOT EXISTS users( name varchar(100), location varchar(100), time int )")
  res.send('Hi from SUP server')
})


// API GET to make new user (will become POST once we start posting to server)
app.get('/newUser', function(req, res) {
  var usrVals = makeRandomUser()
  var queryStr = "INSERT INTO users(name, location, time) VALUES($1, $2, $3)"
  client.query(queryStr, usrVals, function(err, result) {
    if (err) res.send(err)
    console.log('Added new user: ' + usrVals[0])
    res.send('Added: ' + usrVals[0] + " at (" + usrVals[1] + ") for " + usrVals[2] + " minutes\n")
  })
})


// API GET to get all users in database
app.get('/getAllUsers', function(req, res) {
  var query = client.query("SELECT name, location, time FROM users")
  query
  .on('error', function(err) {
    console.error('Error getting all users', err)
    res.send(err)
  })
  .on('row', function(row, result) {
    result.addRow(row)
  })
  .on('end', function(result) {
    console.error(result)
    res.json(result.rows)
  })
})


// helper function to create a random users data
function makeRandomUser() {
  var randName = faker.name.findName()
  var randLoc = faker.address.longitude() + " " + faker.address.latitude()
  var randTime = faker.random.number(60)
  return [randName, randLoc, randTime]
}


// Start webserber on PORT
app.listen(PORT)
console.log('running on', PORT)