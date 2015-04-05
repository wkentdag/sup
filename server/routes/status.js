var express = require('express');
var status = express.Router();
var Status = require('../models/Status');


//  require user methods and database connection
var Status = require('../models/Status');
var pg = require('pg');
var user = process.env.USER;
var pw = process.env.PW;
var conString = "postgres://" + user + ":" + pw + "@localhost/SUP";

//  for development/testing only:
var makeRandomStatus = require('../test/utils').makeRandomStatus;


//Get all statuses in table
status.get('/', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      res.json(500, err);
    } 

    Status.getAllStatus(client, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        res.json(500, {error: err});
      } else {
        res.json(200, result);
      }

      client.end();
    }); //  end Status.getAllStatus
  }); //  end pg.connect
});

//Add new status with specified permission
status.post('/', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      res.json(500, err);
    }

    // TODO: when POSTing is set up on the client, use the line below instead of makeRandomStatus()
    // var statusObj = req.body.status;
    var statusObj = makeRandomStatus();

    Status.addStatus(client, statusObj, function(err, result) {
      done();

      if (err) {
        res.json(500, {error: err});
      } else {
        res.json(200, {message: "done."});
      }

      client.end();
    });   //  end Status.addStatus
  }); //  end pg.connect
});

//  GET one status in the status table by its status_id
status.get('/:id', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      res.json(500, err);
    }

    var status_id = req.params.id;
    Status.getStatusById(client, status_id, function(err, result) {
      if (!err && result.rowCount > 0) {
        res.json(200, result.rows[0]);
      } else if (!err) {
        res.json(404, {error: "Error. Status " + status_id + " could not be found."});
      } else {
        res.json(500,{error: err});
      }

      client.end();
    });
  });
});

//Get all statuses posted by a user
status.get('/u/:owner_id', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      res.json(500, err);
    }

    var owner_id = req.params.owner_id;
    Status.getStatusByOwner(client, owner_id, function(err, result) {
      done();

      if (!err && result.rowCount > 0) {
        res.json(200, result.rows);
      } else if (!err) {
        res.json(404, {error: "Error. User " + owner_id + " has no viewable statuses at this time."});
      } else {
        res.json(500, {error: err});
      }

      client.end();
    });   // end Status.getStatusByOwner
  }); //  end pg.connect
});


module.exports = status;
