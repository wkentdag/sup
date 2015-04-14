var express = require('express');
var sv = express.Router();

var pg = require('pg');
var Users = require('../models/User');
var Status = require('../models/Status');
var db = require('../db');

//  for testing/development only:
var makeRandomStatusView = require('../test/utils').makeRandomStatusView;


//	Get all rows in the table
sv.get('/', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			return res.json(500, err);
		}

		Status.getAllViews(client, function(err, result) {
			//call `done()` to release the client back to the pool
      done();

      if (err) {
        return res.json(500, err);
      }
      // console.log('success!\t', result);
      res.json(200, result);

      client.end();
		});	//	end Status.getAllViews
	});	//	end pg.connect
});

sv.post('/', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			return res.json(500, err);
		}

		// var statusView = makeRandomStatusView;
		var statusView = {};
		statusView.status_id = req.body.status;
		statusView.user_id = req.body.user;

		Users.getUserById(client, statusView.user_id, function(err, result) {
			// done();

			if (!err && result.rowCount > 0) {
				Status.addStatusView(client, statusView.user, statusView.status, function(err, result) {
					done();

					if (err) {
						return res.json(500, err);
					}

					res.json(201, {result: "Added " + result.rowCount + " to the statusView table"});
				});	//	end Status.add

			} else if (!err) {
				res.json(404, {error: "user " + statusView.user_id + " not found"});
			} else {
				res.json(500, err);
			}
		});	//	end getUserById

		client.end();
	});	//	end pg.connect
});


// Get all users who can view a given status
sv.get('/s/:status_id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			return res.json(500, err);
		}

		var status_id = req.params.status_id;

		Status.getViewersByStatus(client, status_id, function(err, result) {
			done();

			if (err) {
				return res.json(500, err);
			}

			res.json(200, result);

			client.end();
		});	//	end Status.getViewers
	});	//	end pg.connect
});

//	Get all statuses viewable to a given user
sv.get('/u/:user_id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			return res.json(500, err);
		}

		var user_id = req.params.user_id;

		Status.getStatusByUser(client, user_id, function(err, result) {
			done();

			if (err) {
				return res.json(500, err);
			}

			res.json(200, result);

			client.end();
		});	//	end Status.getViewers
	});	//	end pg.connect
});


module.exports = sv;