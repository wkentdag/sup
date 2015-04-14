var express = require('express');
var status = express.Router();

//  require user methods and database connection
var pg = require('pg');
var Status = require('../models/Status');
var db = require('../db');
var api = require('../models/intra');

//  for development/testing only:
var makeRandomStatus = require('../test/utils').makeRandomStatus;


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

//  POST a new status to the table
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

//  GET one status in the status table by its status_id
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

//  GET all statuses posted by a user
status.get('/u/:owner_id', function(req, res) {
  pg.connect(db, function(err, client, done) {
    if (err) {
      return res.json(500, {error: err});
    }

    var owner_id = req.params.owner_id;

    //  make sure owner exists
    api.get('/users/' + owner_id, function(err, result, statusCode) {
      if (err) {
        return res.json(500, {error: err});

      } else if (!err && result && statusCode === 200) {
        Status.getStatusesByOwner(client, owner_id, function(err, result) {
          done();

          if (!err && result.rowCount > 0) {
            res.json(200, {statuses: result.rows});
          } else if (!err) {
            res.json(404, {error: "user " + owner_id + " has no statuses"});
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


module.exports = status;
