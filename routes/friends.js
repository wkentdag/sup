var express = require('express');
var friends = express.Router();
var pg = require('pg');
var db = require('../db');
var Users = require('../models/User');


//	GET the entire friends table
friends.get('/', function(req, res) {
	pg.connect(db, function(err, client, done) {
    if(err) {
      return res.json(500, {error: err});
    }

    Users.getAllFriendships(client, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        return res.json(500, {error: err});
      }
      res.json(200, {friendships: result});

      client.end();
    }); //  end Users.getAllFriendships
  }); //  end pg.connect
});


//	TODO: add this route

//	GET one row/friend relationship (for sharing permissions)
friends.get('/:id', function(req, res) {
	res.json(500, {error: 'route yet to be implemented!'});
});


module.exports = friends;