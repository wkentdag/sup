var express = require('express');
var requests = express.Router();
var pg = require('pg');
var db = require('../db');
var Users = require('../models/User');
var api = require('../models/api');


requests.route('/')
  .get(function(req, res) {
    pg.connect(db, function(err, client, done) {
      if (err) {
        return res.json(500, {error: err});
      }

      Users.getAllFriendRequests(client, function(err, result) {
        done();

        if (err) {
          res.json(500, {error: err});
        } else {
          res.json(200, {friend_requests: result});
        }

        client.end();
      }); //  end Users.getAllFR
    }); //  end pg.connect
  })  //  end .get
  .post(function(req, res) {
    pg.connect(db, function(err, client, done) {
      if (err) {
        return res.json(500, {error: err});
      }

      var user_id = req.body.user_id;
      var requested_id = req.body.requested_id;

      //  verify that the user exists
      api.get('/users/' + user_id, function(err, result, statusCode) {
        if (!err && result && statusCode === 200) {

          //  verify that the requested friend exists
          api.get('/users/' + requested_id, function(err, result, statusCode) {
            if (!err && result && statusCode === 200) {

              //  verify that the users aren't already friends
              api.getWithParams('/friends/' + user_id, {friend_id: requested_id}, function(err, result, statusCode) {
                if (!err && result && statusCode === 404) {

                  //  send the friend request
                  Users.requestFriend(client, user_id, requested_id, function(err, result) {
                    done();

                    if (err) {
                      res.json(500, {error: err});
                    } else {
                      res.json(201, {result: "User " + user_id + " has requested " + requested_id});
                    }

                    client.end();
                  }); //  end Users.request

                } else if (!err) {
                  return res.json(statusCode, {error: "users are already friends!"});
                } else {
                  return res.json(statusCode, {error: err});
                }
              }); //  end api.get friends/;id

            } else if (!err) {
              return res.json(statusCode, result);
            } else {
              return res.json(statusCode, {error: err});
            }
          }); //  end api.get requested id

        } else if (!err) {
          return res.json(statusCode, result);
        } else {
          return res.json(statusCode, {error: err})
        }
      }); //  end api.get user id


    }); //  end pg.connect 
  })  //  end .post

module.exports = requests;