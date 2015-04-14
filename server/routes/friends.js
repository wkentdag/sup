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
			return res.json(500, err);
		}

		var user_id = req.params.id;

		Users.getUserById(client, user_id, function(err, result) {
			if (!err && result.rowCount > 0 ) {

				Users.getFriends(client, user_id, function(err, result) {
					done();

					if (!err && result.rowCount > 0) {
		        res.json(200, result.rows);
		      } else if (!err) {
		        res.json(404, {error: "Error. User " + user_id + " has no friends at this time."});
		      } else {

  					console.log('hello from getFriends 500\t', err);
		        res.json(500, {error: err});
		      }
				});	//	end Users.getFriends

			} else if (!err) {
        return res.json(404, {error: "Error. User '" + user_id + "' does not exist."});
			} else {

				console.log('hello from getUserById 500\t', err);
				return res.json(500, {error: err});
			}

			client.end();
		});	//	end Users.getUserById
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
					}

					//	if the friend exists too...
					if (result && statusCode === 200) {

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
friends.delete('/:id/:friend_id', function(req, res) {
	pg.connect(db, function(err, client, done) {
		if (err) {
			res.json(500, err);
		}

		var user_id = req.params.id;

		//	TODO: add a fake friend_id into req.body, remove
		//				friend_id from req.params
		// var friend_id = req.body.friend_id;
		// var friend_id = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
		//	^ random generator
		//	
		var friend_id = req.params.friend_id;

		Users.deleteFriend(client, user_id, friend_id, function(err, result) {
			done();

			if (err) {
				res.json(500, err);
			}

			//	TODO: verify that deletion has actually occurred;
			//				send 404 if no error but no deletion
			res.json(200, result.rows);
			client.end();
		});
	});
});

module.exports = friends;