var express = require('express');
var sv = express.Router();

var pg = require('pg');
var Users = require('../models/User');
var Status = require('../models/Status');
var api = require('../models/intra');
var db = require('../db');

//  for testing/development only:
var makeRandomStatusView = require('../test/utils').makeRandomStatusView;


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
				res.json(200, result);   	
      }

      client.end();
		});	//	end Status.getAllViews
	});	//	end pg.connect
});

//	POST a new status-user relationship to the table
sv.post('/', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			done();
			return res.json(500, {error: err});
		}

		//	FIX ME: this route msut be private to the user_id,
		//					but the user_id param is mostly for other users
		var status_id = req.body.status_id;
		var user_id = req.body.user_id;

		//	verify that the user exists
		api.get('/users/' + user_id, function(err, result, statusCode) {
			if (err) {
				return res.json(500, {error: err});
			} else if (!err && result && statusCode === 200) {

				//	if true, verify that the status exists as well
				api.get('/status/' + status_id, function(err, result, statusCode) {
					if (err) {
						return res.json(500, {error: err});
					} else if (!err && result && statusCode === 200) {

						//	if the user exists AND the status exists, 
						//	verify that the user is the status's owner
						if ( !(user_id == result.status.owner_id) ) {
							
							//	if the user id != status.owner_id, the request is forbidden
							//	because only the owner can set view permissions
							res.json(403, {error: "user " +user_id + " does not have permission to share status " + status_id});
						} else {

							//	process the request
							Status.addStatusView(client, user_id, status_id, function(err, result) {
								done();

								if (err) {
									return res.json(500, err);
								} else {
									res.json(201, {result: "Added " + result.rowCount + " to the statusView table"});			
								}

								client.end();
							});	//	end Status.add

						}
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

							if (!err && result) {
								res.json(200, {rel: result});
							} else if (result) {
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


// GET a list of users who can view a given status
sv.get('/:status_id/viewers', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			done();
			return res.json(500, {error: err});
		}

		//	verify that the status exists
		var status_id = req.params.status_id;
		api.get('/status/' + status_id, function(err, result, statusCode) {
			if (err) {
				return res.json(500, {error: err});
			} else if (!err && result && statusCode === 200) {

				//	process the request
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
				});	//	end Status.getViewers
			} else {
				res.json(statusCode, result);
			}
		});	//	end api.get status id	
	});	//	end pg.connect
});

//	Get all statuses viewable to a given user
sv.get('/u/:user_id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			return res.json(500, {error: err});
		}

		//	verify that the user exists
		var user_id = req.params.user_id;
		api.get('/users/' + user_id, function(err, result, statusCode) {
			if (err) {
				return res.json(500, {error: err});
			}

			if (result && statusCode === 200) {

				//	process the request
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
				return res.json(statusCode, {error: err});
			}
		});	//	end api.get user id
	});	//	end pg.connect
});


module.exports = sv;