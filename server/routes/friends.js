var express = require('express');
var friends = express.Router();
var superagent = require('superagent');
var root_url = require('../config/config').root_url;

//  require user methods and database connection
var pg = require('pg');
var Users = require('../models/User');
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
		console.log('friend id\t', friend_id);
		// var friend_id = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;

		//	verify that user exists
		superagent.get('http://' + root_url + '/users/' + user_id).end(function(err, result) {
			if (err) {
				return res.json(500, err);
			}

			var resJson = JSON.parse(result.text);
			var statusCode = result.statusCode;

			//	if the users exists, verify the friend as well
			if (resJson && statusCode === 200) {

				superagent.get('http://' + root_url + '/users/' + friend_id).end(function(err, result) {
					if (err) {
						return res.json(500, err);
					}

					resJson = JSON.parse(result.text);
					statusCode = result.statusCode;

					console.log('resJson\t', resJson, '\nstatusCode', statusCode);
					if (resJson && statusCode === 200) {
						Users.addFriend(client, user_id, friend_id, function(err, result) {
							console.log('hello from add friends', err, result);
							done();
							if (err) {
								return res.json(500, err);
							} else {
								res.json(201, result.rows);
							}
						});	//	end Users.addFriend
						
					} else {
						res.json(statusCode, resJson);
					}

				});	//	end SA.get friend id
			} else {
				//	if the user doesn't exist or there was a server error, forward it 
				res.json(statusCode, resJson);
			}	
		});	//	end SA.get user id


		//	TODO: should we verify if the friend exists too?
		// Users.getUserById(client, user_id, function(err, result) {
		// 	console.log('helo from inside getUserById');

		// 	if (!err && result.rowCount > 0) {
		// 		// done();
		// 		console.log('nest1', user_id, friend_id, err, result.rows);
		// 		res.send('success!', result.rows);
				

		// 	} else if (!err) {

		// 		console.log('nest2', user_id, friend_id, err, result);
		// 		done();
		// 		res.json(404, {error: "Error. User '" + user_id + "' does not exist."});

		// 	} else {

		// 		console.log('nest3', user_id, friend_id, err, result);
		// 		done();
		// 		res.json(500, err);

		// 	}

		// 	client.end();
		// });	//	end Users.getUesrById

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