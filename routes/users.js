var express = require('express');
var users = express.Router();
var pg = require('pg');
var db = require('../db');
var Users = require('../models/User');
var Status = require('../models/Status');
var api = require('../models/api');

//  for testing/development only:
var makeRandomUser = require('../test/fake').makeRandomUser;


/**
  *
  * Basic user routes
  *
**/

//  GET all users in table
users.get('/', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      return res.json(500, {error: err});
    }

    if (!req.query.phone) {
      Users.getAllUsers(client, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        res.json(500, {error: err});
      } else {
        res.json(200, {users: result});   
      }

      client.end();
    }); //  end Users.getAllUsers
    } else {
      var phone = req.query.phone;
      Users.getUserByPhone(client, phone, function(err, result) {
        done();

        if (!err && result.length > 0) {
          res.json(200, {user: result});
        } else if (!err) {
          res.json(404, {error: "user with phone number " + phone + " doesn't exist."});
        } else {
          res.json(500, {error: err});
        }

        client.end();
      });
    }
    
  }); //  end pg.connect
});

//  POST a new user to the table
users.post('/', function(req, res) {
  pg.connect(db, function(err, client, done) {

    if (err) {
      return res.json(500, {error: err});
    }

    // var usrObj = req.body.user;
    var usrObj = makeRandomUser();

    Users.addUser(client, usrObj, function(err, result) {
      done();

      if (err) {
        res.json(500, {error: err});
      } else {
        res.json(201, {
          message: "added new user with id: " + JSON.stringify(result.rows[0].user_id),
          new_id: JSON.stringify(result.rows[0].user_id)
        });      
      }

      client.end();
    });   //  end Users.addUser
  }); //  end pg.connect
});

//  GET single user by id
//    @param id; a user's ID number
users.get('/:id', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      return res.json(500, {error: err});
    }

    var user_id = req.params.id;
    Users.getUserById(client, user_id, function(err, result) {
      done();

      if (!err && result.rowCount > 0) {
        res.json(200, {user: result.rows[0]});

      } else if (!err) {
        res.json(404, {error: "user " + user_id + " does not exist"});

      } else {
        res.json(500, {error: err});
      }

      client.end();
    }); //  end Users.getUserById
  }); //  end pg.connect
});


/**
  *
  * Friend routes
  *
**/

//  GET a list of the user's friends
//    @param id: a user's ID number
users.get('/:id/friends', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      console.log('error connecting', err);
      done();
      return res.json(500, {error: err});
    }

    var user_id = req.params.id;

    //  verify that the user exists
    api.get('/users/' + user_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});
      }

      //  if true, query their friends
      if (result && statusCode === 200) {
        Users.getFriends(client, user_id, function(err, result) {
          done();

          if (!err && result.length > 0) {
            res.json(200, {friends: result});
          } else if (!err) {
            res.json(404, {error: "User " + user_id + " has no friends :/ "});
          } else {
            res.json(500, {error: err});
          }

          client.end();
        }); //  end Users.getFriends

      //  if false, forward the 404/500 error
      } else {
        return res.json(statusCode, result);
      }
    }); //  end api.get user id
  }); //  end pg.connect
});


//  POST a new user to a given user's list of friends
//    @param id: a user's ID number
//    @param friend_id: another user's ID number
users.post('/:id/friends', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      console.log('error connecting', err);
      done();
      return res.json(500, {error: err});
    }

    var user_id = req.params.id;
    var friend_id = req.body.friend_id;

    //  check to verify that a friend request exists
    api.getWithParams('/requests/' + friend_id, {user_id: user_id}, function(err, result, statusCode) {
      if (!err && result && statusCode === 200) {

        //  ...add the friendship to the table, and delete the friend request
        Users.approveFriendRequest(client, user_id, friend_id, function(err, result) {
          done();

          if (err) {
            return res.json(500, {error: err});
          } else {
            var res_uid = JSON.stringify(result.rows[0].user_id);
            var res_fid = JSON.stringify(result.rows[0].friend_id);
            res.json(201, {message: "User " + res_uid + " added user " + res_fid + " to their list of friends"});
          }

          client.end();
        }); //  end Users.addFriend
      } else if (!err) {
        res.json(403, {error: user_id + ' has not requested ' + friend_id});
      } else {
        res.json(statusCode, {error: err});
      }
    }); //  ned api.getWithParams


  }); //  end pg.connect
});

//  TODO: verify that the users are actually friends first

//  DELETE a friendship
//    @param id: a user's ID number
//    @param friend_id: the ID number of the friend to be deleted
users.delete('/:id/friends', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      console.log('error connecting', err);
      done();
      return res.json(500, {error: err});
    }

    var user_id = req.params.id;
    var friend_id = req.body.friend_id;

    //  verify that the user exists first
    api.get('/users/' + user_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});

      //  if the user exists...
      } else if (!err && result && statusCode === 200) {
        api.get('/users/' + friend_id, function(err, result, statusCode) {
          if (err) {
            return res.json(500, {error: err});
          } else if (!err && result && statusCode === 200) {
            Users.deleteFriend(client, user_id, friend_id, function(err, result) {
              done();

              if (err) {
                return res.json(500, {error: err});
              } else {
                res.json(204, {message: "friend relationship deleted"});
              }

              client.end();
            });
          } else {
            res.json(statusCode, result);
          }
        }); //  end api.get friend id
      } else {
        return res.json(statusCode, result);
      }
    }); //  end api.get user id
  }); //  end pg.connect
});


/**
  *
  * Status routes
  *
**/

//  TODO: filter this list to only return visible AND active statuses

//  GET a list of statuses visible to the user 
//    @param id; a user's ID number
users.get('/:id/visible', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      return res.json(500, {error: err});
    }

    //  verify that the user exists
    var user_id = req.params.id;
    api.get('/users/' + user_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});
      }

      if (result && statusCode === 200) {

        //  process the request
        Status.getVisibleStatuses(client, user_id, function(err, result) {
          done();

          if (!err && result.length > 0) {
            var statuses = [];
            for (var rel in result) {
              statuses.push(result[rel].status_id);
            }
            res.json(200, {statuses: statuses});
          } else if (!err) {
            res.json(404, {error: "user " + user_id + " has no visible statuses"});
          } else {
            res.json(500, {error: err});
          }

          client.end();
        });
      } else {
        return res.json(statusCode, result);
      }
    }); //  end api.get user id
  }); //  end pg.connect
});

//  GET a list of all statuses posted by the user
//    @param id: a user's ID number
users.get('/:id/status', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      return res.json(500, {error: err});
    }

    var id = req.params.id;

    //  make sure owner exists
    api.get('/users/' + id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});

      } else if (!err && result && statusCode === 200) {
        Status.getStatusesByOwner(client, id, function(err, result) {
          done();

          if (!err && result.rowCount > 0) {
            res.json(200, {statuses: result.rows});
          } else if (!err) {
            res.json(404, {error: "user " + id + " has no statuses"});
          } else {
            res.json(500, {error: err});
          }

          client.end();
        });   // end Status.getStatusByOwner
      } else {
        res.json(statusCode, result);
      }
    }); //  end api get owner id
  }); //  end pg.connect
});

//  TODO: return only a currently ACTIVE status, or 404 if none

//  GET a user's most recent status
//    @param id: a user's ID number
users.get('/:id/status/last', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      done();
      return res.json(500, {error: err});
    }

    var user_id = req.params.id;
    api.get('/users/' + user_id + '/status', function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});
      } else if (!err && result && statusCode === 200) {
        res.json(200, {last_status: result.statuses[0]});
      } else {
        return res.json(statusCode, result);
      }
    }); //  end api.get
  }); //  end pg.connect
}); 


module.exports = users;
