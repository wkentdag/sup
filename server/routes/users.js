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
    // var usrObj = req.body;
    var usrObj = makeRandomUser();

    Users.addUser(client, usrObj, function(err, result) {
      done();

      if (err) {
        res.json(500, err);
      }

      // console.log('success!\t', result);
      res.json(200, "done.");

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
      done();

      if (!err && result.rowCount > 0) {
        res.json(200, result.rows[0]);

      } else if (!err) {
        res.json(404, {error: "Error. User '" + user_id + "' does not exist."});

      } else {
        res.json(500, {error: err});
      }

      client.end();
    }); //  end Users.getUserById
  }); //  end pg.connect
});

module.exports = users;
