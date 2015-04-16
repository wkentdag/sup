var express = require('express');
var status = express.Router();
var pg = require('pg');
var db = require('../db');
var Status = require('../models/Status');
var api = require('../models/api');

//  for development/testing only:
var makeRandomStatus = require('../test/utils').makeRandomStatus;


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

//    TODO: in production, change owner_id to status, when
//          the details of the status besides the owner_id are not fake

//  POST a new status to the table
//    @param owner_id: ID number of the user who is posting the status
status.post('/', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      done();
      return res.json(500, {error: err});
    }

    var owner_id = req.body.owner_id;

    // TODO: when POSTing is set up on the client, use the line below instead of makeRandomStatus()
    // var statusObj = req.body.status;
    var statusObj = makeRandomStatus();
    statusObj.owner = owner_id;

    //  verify that user exists
    api.get('/users/' + owner_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});

      //  if the user exists, add the status...
      } else if (!err && result && statusCode === 200) {
        Status.addStatus(client, statusObj, function(err, result) {
          done();

          if (err) {
            res.json(500, {error: err});
          } else {
            res.json(201, {message: "added " + result.rowCount + " new status"});
          }

          client.end();
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
            var viewers = [];
            for (var rel in result) {
              viewers.push(result[rel].user_id);
            }
            res.json(200, viewers);
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

              //  process the request
              Status.addStatusView(client, user_id, status_id, function(err, result) {
                done();

                if (err) {
                  return res.json(500, err);
                } else {
                  res.json(201, {result: "Added " + result.rowCount + " user to status " + status_id + "'s visibility permissions"});     
                }

                client.end();
              }); //  end Status.add
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
