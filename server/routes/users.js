var express = require('express');
var users = express.Router();

//  require user methods and database connection
var Users = require('../models/User');
var pg = require('pg');
var user = process.env.USER;
var pw = process.env.PW;
var conString = "postgres://" + user + ":" + pw + "@localhost/SUP";

//  for testing/development only:
var makeRandomUser = require('../test/utils').makeRandomUser;


//Get all users in table
users.get('/', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      res.json(500, err);
    }

    Users.getAllUsers(client, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        res.json(500, err);
      }
      // console.log('success!\t', result);
      res.json(200, result);

      client.end();
    }); //  end Users.getAllUsers
  }); //  end pg.connect
});

//add new user
users.post('/', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      res.json(500, err);
    }

    // TODO: when POSTing is set up on the client, uncomment the line below instead of makeRandomUser()
    // var usrObj = req.body.user;
    var usrObj = makeRandomUser()

    Users.addUser(client, usrObj, function(err, result) {
      done();

      if (err) {
        res.json(500, err);
      }

      // console.log('success!\t', result);
      res.json(200, result);

      client.end();
    });   //  end Users.addUser
  }); //  end pg.connect
});

//Get single user by id
users.get('/:id', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      res.json(500, err);
    }

    var user_id = req.params.id;
    Users.getUserById(client, user_id, function(err, result) {
      if (!err && result.rowCount > 0) {
        // console.log('hello from no error and result! (200)');
        res.json(200, result.rows[0]);
      } else if (!err) {
        // console.log('hello from no error and no result! (404)');
        res.json(404, {error: "Error. User '" + user_id + "' does not exist."});
      } else {
        // console.log('hello from error and no result! (500)');
        res.json(500, {error: err});
      }
    }); //  end Users.getUserById
  }); //  end pg.connect

  var user_id = req.params.id;
  Users.getUserById(user_id, function(err, result) {
    if (!err && result.rowCount > 0) {
      res.json(200, result.rows[0]);
    } else if (!err) {
      res.json(404, {error: "Error. User '" + user_id + "' does not exists."});
    } else {
      res.json(500, {error: err});
    }

    client.end();
  });
});

module.exports = users;
