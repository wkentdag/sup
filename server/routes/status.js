var express = require('express');
var status = express.Router();
var Status = require('../models/Status');

//  for development/testing only:
var makeRandomStatus = require('../test/utils').makeRandomStatus;


//Get all statuses in table
status.get('/', function(req, res) {
  Status.getAllStatus(function(err, result) {
    if (err) {
      res.json(500, {error: err});
    } else {
      res.json(200, result);     
    }
  });
});

//Add new status with specified permission
status.post('/', function(req, res) {

  // TODO: when POSTing is set up on the client, use the line below instead of makeRandomStatus()
  // var usrObj = req.body.status;
  var statusObj = makeRandomStatus();

  Status.addStatus(statusObj, function(err, result) {
    if (err) {
      res.json(500, {error: err});
    } else {
      res.json(200, {message: "done."});    
    }
  });
});

//Get statuses visible to one user
status.get('/:id', function(req, res) {

  //  FIX ME: DB returns an error whether this variable \
  //          is a user ID or a status ID ...???
  var user_id = req.params.id;
  Status.getVisibleStatus(user_id, function(err, result) {
    console.log("Error:\t", err);
    console.log("Result:\t", result);

    if (!err && result.rowCount > 0) {
      res.json(200, result.rows);
    } else if (!err) {
      res.json(404, {error: "Error. No visible statuses for '" + user_id});
    } else {
      res.json(500, {error: err});
    }
  })
})


module.exports = status;
