var express = require('express');
var sv = express.Router();
var pg = require('pg');
var db = require('../db');
var Users = require('../models/User');
var Status = require('../models/Status');
var api = require('../models/api');

//  for testing/development only:
var makeRandomStatusView = require('../test/fake').makeRandomStatusView;


//	GET all rows in the table
sv.get('/', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			return res.json(500, {error: err});
		}

		Status.getAllViews(client, function(err, result) {
			//call `done()` to release the client back to the pool
      done();

      if (err) {
        res.json(500, err);
      } else {
				res.json(200, {permissions: result});   	
      }

      client.end();
		});	//	end Status.getAllViews
	});	//	end pg.connect
});

//	GET one row from the table 
sv.get('/:status_id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			done();
			return res.json(500, {error: err});
		}

		var status_id = req.params.status_id;
		var user_id = req.body.user_id;

		//	verify that the status exists
		api.get('/status/' + status_id, function(err, result, statusCode) {
			if (err) {
				return res.json(500, {error: err});
			} else if (!err && result && statusCode === 200) {

				//	if true, verify that the user exists as well
				api.get('/users/' + user_id, function(err, result, statusCode) {
					if (err) {
						return res.json(500, {error: err});
					} else if (!err && result && statusCode === 200) {

						Status.getOneView(client, user_id, status_id, function(err, result) {
							done();

							if (!err && result.length > 0) {
								res.json(200, {rel: result});
							} else if (result.length === 0) {
								res.json(404, {message: "user " + user_id + " cannot view status " + status_id});
							} else {
								res.json(500, {error: err});
							}

							client.end();
						});	//	end Status.getOne
					} else {
						return res.json(statusCode, result);
					}
				});	//	end api.get user id
			} else {
				return res.json(statusCode, result);
			}
		});	//	end api.get status id
	});	//	end pg.connect
});	


module.exports = sv;