var express = require('express');
var status = express.Router();
var pg = require('pg');
var forEachAsync = require('forEachAsync').forEachAsync;
var db = require('../db');
var Status = require('../models/Status');
var api = require('../models/api');

//  for development/testing only:
var makeRandomStatus = require('../test/fake').makeRandomStatus;


/**
  *
  * Basic status routes
  *
**/

//  GET all statuses in table
status.get('/', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      return res.json(500, {error: err});
    } 

    Status.getAllStatus(client, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        res.json(500, {error: err});
      } else {
        res.json(200, {statuses: result});
      }

      client.end();
    }); //  end Status.getAllStatus
  }); //  end pg.connect
});


//  POST a new status to the table, along with viewers
status.post('/', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      done();
      return res.json(500, {error: err});
    }

    var statusObj;
    if (process.env.NODE_ENV === 'production') {
      statusObj = {};
      statusObj.owner_id = req.body.owner_id;
      statusObj.latitude = req.body.latitude;
      statusObj.longitude = req.body.longitude;
      statusObj.duration = req.body.duration;
      statusObj.message = req.body.message;
    } else {
      statusObj = makeRandomStatus();
      statusObj.owner_id = req.body.fake_owner_id;
    }

    //  intialize an array of viewer_ids to be granted permission to view the new status
    //  will contain owner_id at a minimum, and selectedFriends if attached to the request
    var viewer_ids;
    if (req.body.selectedFriends) {
      viewer_ids = req.body.selectedFriends;
    } else {
      viewer_ids = [];
    }
    viewer_ids.push(statusObj.owner_id);

    //  verify that user exists
    api.get('/users/' + statusObj.owner_id, function(err, result, statusCode) {
      if (err) {
        done();
        return res.json(500, {error: err});

      //  if the user exists, add the status...
      } else if (!err && result && statusCode === 200) {

        var owner_name = result.user.first_name + " " + result.user.last_name;
        statusObj.owner_name = owner_name;

        Status.addStatus(client, statusObj, function(err, result) {

          if (err) {
            done();
            return res.json(500, {error: err});
          } else {

            var new_status = result[0];
            var new_status_id = new_status.status_id;
            var viewers = [];

            //  if posting is successful, add each viewer to status_view permissions
            forEachAsync(viewer_ids, function(next, viewer_id, i, array) {

              Status.addStatusView(client, viewer_id, new_status_id, function(err, result) {
                if (err) {
                  done();
                  client.end();
                  return res.json(500, {error: err.detail});
                } else {
                  // console.log(result[0]);
                  viewers.push(result[0].user_id);
                  next();
                }

              }); //  end Status.add
            }).then( function() {
              done();
              client.end();
              console.log('new_status: ' + new_status);
              console.log('viewers: ' + viewers);
              res.json(201, {
                new_status: new_status,
                viewers: viewers
              });
            });

          }
        });   //  end Status.addStatus

      //  ...otherwise forward the 404/500 error
      } else {
        res.json(statusCode, result);
      }
        }); //  end api.get owner id

  }); //  end pg.connect
});

//  GET one status
//    @param id: a status's ID number
status.get('/:id', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      return res.json(500, {error: err});
    }

    var status_id = req.params.id;
    Status.getStatusById(client, status_id, function(err, result) {
      if (!err && result.rowCount > 0) {
        res.json(200, {status: result.rows[0]});
      } else if (!err) {
        res.json(404, {error: "status " + status_id + " does not exist"});
      } else {
        res.json(500, {error: err});
      }

      client.end();
    });
  });
});


/**
  *
  * Viewing routes
  *
**/

//  GET a list of users who have permission to view a status
//    @param id: a status's ID number
status.get('/:id/viewers', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      done();
      return res.json(500, {error: err});
    }

    //  verify that the status exists
    var status_id = req.params.id;
    api.get('/status/' + status_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});
      } else if (!err && result && statusCode === 200) {

        //  process the request
        Status.getViewersByStatus(client, status_id, function(err, result) {
          done();

          if (!err && result.length > 0) {
            var viewer_ids = [];
            for (var rel in result) {
              viewer_ids.push(result[rel].user_id);
            }

            var viewers = [];
            forEachAsync(viewer_ids, function(next, id, i, array) {
              console.log(i, 'id', id);
              api.get('/users/' + id, function(err, user, statusCode) {
                if (!err && user && statusCode === 200) {
                  console.log(user.user);
                  viewers.push(user.user);
                } else {
                  console.log('error in api.get/', id, err);
                }
                next();
              })
              // api.get('/users/' + id)
            }).then( function() {
              res.json(200, {viewers: viewers}); 
            });

          } else if (!err) {
            res.json(404, {error: "status " + status_id + " has no viewers"});
          } else {
            res.json(500, {error: err});
          }

          client.end();
        }); //  end Status.getViewers
      } else {
        res.json(statusCode, result);
      }
    }); //  end api.get status id 
  }); //  end pg.connect
});

//  TODO: check to see if the relation already exists; return 403 if true

//  POST a new user to the list of viewers for a given status
//    @param id; a status's ID number
//    @param user_id: a user's id number to be given permission
status.post('/:id/viewers', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      done();
      return res.json(500, {error: err});
    }

    var status_id = req.params.id;
    var user_id = req.body.user_id;

    //  verify that the user exists
    api.get('/users/' + user_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});
      } else if (!err && result && statusCode === 200) {

        //  if true, verify that the status exists as well
        api.get('/status/' + status_id, function(err, result, statusCode) {
          if (err) {
            return res.json(500, {error: err});
          } else if (!err && result && statusCode === 200) {

              // verify that the relationship doesn't already exist
              api.getWithParams('/sv/' + status_id, {user_id: user_id}, function(err, result, statusCode) {
                if (!err && result && statusCode === 404) {

                  //  process the request
                  Status.addStatusView(client, user_id, status_id, function(err, result) {
                    done();

                    if (err) {
                      return res.json(500, {error: err});
                    } else {
                      res.json(201, {result: "Added " + result.rowCount + " user to status " + status_id + "'s visibility permissions"});     
                    }

                    client.end();
                  }); //  end Status.add
                  console.log(err);
                } else if (result) {
                  res.json(403, {error: "relationship already exists"});
                } else {
                  res.json(statusCode, {error: err});
                }
              });

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


module.exports = status;
