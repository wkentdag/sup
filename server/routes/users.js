var express = require('express');
var faker = require('faker')
var users = express.Router();
var Users = require('../models/usersModel')

/* GET users listing. */

//Get all users in table
users.get('/', function(req, res) {
  Users.getAllUsers(function(err, result) {
    if (err) res.json(500, err)
    res.json(200, result)
  })
});

//This should be POST
//add new user
users.get('/new', function(req, res) {
  var usrObj = makeRandomUser()
  Users.addUser(usrObj, function(err, result) {
    if (err) res.json(500, {error: err})
    res.json(200, {message: "done."})
  })
});

//Get single user by id
users.get('/:id', function(req, res) {
  var user_id = req.params.id
  Users.getUserById(user_id, function(err, result) {
    if (!err && result.rowCount > 0) {
      res.json(200, result.rows[0])
    } else if (!err) {
      res.json(404, {error: "Error. User '" + user_id + "' does not exists."})
    } else {
      res.json(500, {error: err})
    }
  })
})


function makeRandomUser() {
  var fakeUser = {}
  fakeUser.id = faker.finance.mask()
  fakeUser.name = faker.name.firstName()
  fakeUser.email = faker.internet.email()
  return fakeUser
}


module.exports = users;
