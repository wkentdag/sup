var express = require('express');
var friends = express.Router();
var pg = require('pg');
var db = require('../db');
var Users = require('../models/User');
var api = require('../models/api');


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
	pg.connect(db, function(err, client, done) {
    if (err) {
      done();
      return res.json(500, {error: err});
    }

    var user_id = req.params.id;
    var friend_id = req.body.friend_id;

    //  verify that the user exists
    api.get('/users/' + user_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});
      } else if (!err && result && statusCode === 200) {

        //  if true, verify that the friend exists as well
        api.get('/users/' + friend_id, function(err, result, statusCode) {
          if (err) {
            return res.json(500, {error: err});
          } else if (!err && result && statusCode === 200) {

            Users.getOneFriendship(client, user_id, friend_id, function(err, result) {
              done();

              if (!err && result) {
                res.json(200, {rel: result});
              } else if (result) {
                res.json(404, {message: friend_id + ' is not in ' + user_id + 's friend list'});
              } else {
                res.json(500, {error: err});
              }

              client.end();
            }); //  end Status.getOne
          } else {
            return res.json(statusCode, result);
          }
        }); //  end api.get user id
      } else {
        return res.json(statusCode, result);
      }
    }); //  end api.get status id
  }); //  end pg.connect
});


module.exports = friends;