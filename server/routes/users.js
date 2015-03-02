var express = require('express');
var faker = require('faker')
var router = express.Router();
var Users = require('../models/usersModel')


/* GET users listing. */

router.get('/', function(req, res) {
  Users.initTable(function(err, result) {
    if (err) res.send(500, err)
    res.send(200, "Hi from users")
  })
});

router.get('/all', function(req, res) {
  Users.getAllUsers(function(err, result) {
    if (err) res.send(500, err)
    res.json(200, result)
  })
});

router.get('/new', function(req, res) {
  var usrObj = makeRandomUser()
  Users.addUser(usrObj, function(err, result) {
    if (err) res.send(500, err)
    res.send(200, "added user")
  })
});


function makeRandomUser() {
  var fakeUser = {}
  fakeUser.name = faker.name.findName()
  fakeUser.loc = faker.address.longitude() + " " + faker.address.latitude()
  fakeUser.time = faker.random.number(60)
  return fakeUser
}

module.exports = router;
