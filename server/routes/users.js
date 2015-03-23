var express = require('express');
var users = express.Router();
var Users = require('../models/User');

//  for testing/development only:
var makeRandomUser = require('../test/utils').makeRandomUser;


//Get all users in table
users.get('/', function(req, res) {
  Users.getAllUsers(function(err, result) {
    if (err) {
      res.json(500, err)
    } else {
      res.json(200, result)   
    }
  });
});

//add new user
users.post('/', function(req, res) {

  // TODO: when POSTing is set up on the client, uncomment the line below instead of makeRandomUser()
  var usrObj = req.body;
  // var usrObj = makeRandomUser()

  Users.addUser(usrObj, function(err, result) {
    if (err) {
      res.json(500, {error: err});
    } else {
      res.json(200, {message: "done."});
    }
  });
});

//Get single user by id
users.get('/:id', function(req, res) {
  var user_id = req.params.id;
  Users.getUserById(user_id, function(err, result) {
    if (!err && result.rowCount > 0) {
      res.json(200, result.rows[0]);
    } else if (!err) {
      res.json(404, {error: "Error. User '" + user_id + "' does not exists."});
    } else {
      res.json(500, {error: err});
    }
  });
});

module.exports = users;
