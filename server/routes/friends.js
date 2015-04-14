var express = require('express');
var friends = express.Router();
var superagent = require('superagent');

//  require user methods and database connection
var pg = require('pg');
var Users = require('../models/User');
var api = require('../models/intra');
var db = require('../db');


//	GET the entire friends table
friends.get('/', function(req, res) {
	pg.connect(db, function(err, client, done) {
    if(err) {
      return res.json(500, err);
    }

    Users.getAllFriendships(client, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        return res.json(500, err);
      }
      res.json(200, result);

      client.end();
    }); //  end Users.getAllFriendships
  }); //  end pg.connect
});

//	GET a list of one user's friends
friends.get('/:id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			console.log('error connecting', err);
			done();
			return res.json(500, err);
		}

		var user_id = req.params.id;

		//	verify that the user exists
		api.get('/users/' + user_id, function(err, result, statusCode) {
			if (err) {
				return res.json(500, err);
			}

			//	if true, query their friends
			if (result && statusCode === 200) {
				Users.getFriends(client, user_id, function(err, result) {
					done();

					if (!err && result.rowCount > 0) {
						var friends = [];
						for (var rel in result.rows) {
							friends.push(result.rows[rel].friend_id);
						}
		        res.json(200, {"friends": friends});
		      } else if (!err) {
		        res.json(404, {error: "User " + user_id + " has no friends :/ "});
		      } else {
		        res.json(500, {error: err});
		      }

    			client.end();
				});	//	end Users.getFriends

			//	if false, forward the 404/500 error
			} else {

				//	FIXME: why does err === null?
				return res.json(statusCode, {error: err});
			}
		});	//	end api.get user id
	});	//	end pg.connect
});

//	POST a new friend relationship (uni-directional)
friends.post('/:id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			console.log('error connecting', err);
			done();
			return res.json(500, err);
		}

		var user_id = req.params.id;
		var friend_id = req.body.friend_id;

		//	verify that user exists
		api.get('/users/' + user_id, function(err, result, statusCode) {
			if (err) {
				return res.json(500, err);
			}

			//	if the users exists...
			if (result && statusCode === 200) {

				//	...verify that the friend exists as well
				api.get('/users/' + friend_id, function(err, result, statusCode) {
					if (err) {
						return res.json(500, err);

					//	if the friend exists...
					}	else if (!err && result && statusCode === 200) {

						//	...add the friendship to the table
						//	FIXME: verify that they aren't already friends & return 403 if they are
						Users.addFriend(client, user_id, friend_id, function(err, result) {
							done();

							if (err) {
								return res.json(500, err);
							} else {
								res.json(201, "Added " + result.rows + " friend relationship");
							}

							client.end();
						});	//	end Users.addFriend
					} else {
						res.json(statusCode, result);
					}
				});	//	end api.get friend id
			} else {
				//	if the user doesn't exist or there was a server error, forward it 
				res.json(statusCode, result);
			}	
		});	//	end api.get user id
	});	//	end pg.connect
});

//	DELETE a friend relationship (uni-directional)
friends.delete('/:id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			console.log('error connecting', err);
			done();
			return res.json(500, err);
		}

		var user_id = req.params.id;
		var friend_id = req.body.friend_id;

		//	verify that the user exists first
		api.get('/users/' + user_id, function(err, result, statusCode) {
			if (err) {
				return res.json(500, err);

			//	if the user exists...
			} else if (!err && result && statusCode === 200) {
				api.get('/users/' + friend_id, function(err, result, statusCode) {
					if (err) {
						return res.json(500, err);
					} else if (!err && result && statusCode === 200) {
						Users.deleteFriend(client, user_id, friend_id, function(err, result) {
							done();

							if (err) {
								return res.json(500, err);
							} else {
								res.json(204, "Friend relationship deleted");
							}

							client.end();
						});
					} else {
						res.json(statusCode, result);
					}
				});	//	end api.get friend id
			} else {
				return res.json(statusCode, result);
			}
		});	//	end api.get user id
	});	//	end pg.connect
});

module.exports = friends;