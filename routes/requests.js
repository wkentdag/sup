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

          var requester_name = result.user.first_name + " " + result.user.last_name;

          //  verify that the requested friend exists
          api.get('/users/' + requested_id, function(err, result, statusCode) {
            if (!err && result && statusCode === 200) {

              //  verify that the users aren't already friends
              api.getWithParams('/friends/' + user_id, {friend_id: requested_id}, function(err, result, statusCode) {
                if (!err && result && statusCode === 404) {
                                  
                  Users.requestFriend(client, user_id, requester_name, requested_id, function(err, result) {
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

requests.route('/:requested_id')
  .get(function(req, res) {
    pg.connect(db, function(err, client, done) {
      if (err) {
        return res.json(500, {error: err});
      }

      var requested_id = req.params.requested_id;

      if (req.body.user_id) {
        user_id = req.body.user_id;
        Users.getFriendRequest(client, user_id, requested_id, function(err, result) {
          done();

          if (!err && result.length > 0) {
            res.json(200, {pending_requests: result});
          } else if (!err) {
            res.json(404, {error: "user " + user_id + " has not requested " + requested_id});
          } else {
            res.json(500, {error: err});
          }

          client.end();
        }); //  end .getFriendReq
      } else {
        Users.getPendingRequestsForUser(client, requested_id, function(err, result) {
          done();

          if (!err && result.length > 0) {

            //  convert ISO8601 to unix for parsing on the client w/YLMoment
            for (var user in result) {
              result[user].created = Date.parse(result[user].created) / 1000;
            }

            res.json(200, {pending_requests: result});
          } else if (!err) {
            res.json(404, {error: "user " + requested_id + " has not been requested"});
          } else {
            res.json(500, {error: err});
          }

          client.end();
        })
      }

    }); //  end pg.connect
  });

module.exports = requests;




