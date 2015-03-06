var express = require('express');
var faker = require('faker')
var statuses = express.Router();
var Users = require('../models/usersModel')

/* GET statuses listing. */

//Get all statuses in table
statuses.get('/', function(req, res) {
  Users.getAllStatus(function(err, result) {
    if (err) res.json(500, {error: err})
    res.json(200, result)
  })
});

//This should be POST
//Add new status with specified permission
statuses.get('/new', function(req, res) {
  var usrObj = makeRandomStatus()
  Users.addStatus(usrObj, function(err, result) {
    if (err) res.json(500, {error: err})
    res.json(200, {message: "done."})
  })
});

//Get statuses visible to one user
statuses.get('/:id', function(req, res) {
  var user_id = req.params.id
  Users.getVisibleStatus(user_id, function(err, result) {
    console.log("Error", err)
    console.log("Result", result)
    if (!err && result.rowCount > 0) {
      res.json(200, result.rows)
    } else if (!err) {
      res.json(404, {error: "Error. No visible statuses for '" + user_id})
    } else {
      res.json(500, {error: err})
    }
  })
})


function makeRandomStatus() {
  var fakeStatus = {}
  fakeStatus.id = faker.finance.mask()
  fakeStatus.owner = faker.finance.mask()
  fakeStatus.loc = faker.address.longitude() + " " + faker.address.latitude()
  fakeStatus.time = faker.random.number(60)
  return fakeStatus
}

module.exports = statuses;
