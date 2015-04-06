var express = require('express');
var friends = express.Router();

//  require user methods and database connection
var Users = require('../models/User');
var pg = require('pg');
var user = process.env.USER;
var pw = process.env.PW;
var conString = "postgres://" + user + ":" + pw + "@localhost/SUP";


//	GET the entire friends table
friends.get('/', function(req, res) {
	pg.connect(conString, function(err, client, done) {
    if(err) {
      res.json(500, err);
    }

    Users.getAllFriendships(client, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if (err) {
        res.json(500, err);
      }
      // console.log('success!\t', result);
      res.json(200, result);

      client.end();
    }); //  end Users.getAllFriendships
  }); //  end pg.connect
});

//	GET a list of one user's friends
friends.get('/:id', function(req, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			res.json(500, err);
		}

		var user_id = req.params.id;
		Users.getFriends(client, user_id, function(err, result) {
			done();

			//	TODO: verify whether the user actually exists first!
			if (!err && result.rowCount > 0) {
        res.json(200, result.rows);
      } else if (!err) {
        res.json(404, {error: "Error. User " + user_id + " has no friends at this time."});
      } else {
        res.json(500, {error: err});
      }

      client.end();
		});
	});
});

//	POST a new friend relationship (uni-directional)
friends.post('/:id', function(req, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			res.json(500, err);
		}

		var user_id = req.params.id;

		//	TODO: add a fake friend_id into req.body
		// var friend_id = req.body.friend_id;
		var friend_id = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;

		Users.addFriend(client, user_id, friend_id, function(err, result) {
			done();

			if (err) {
				res.json(500, err);
			}

			//	FIX ME: why does this not return the new friend id?
			res.json(200, result.rows);
			client.end();
		});
	});
});

//	DELETE a friend relationship (uni-directional)
friends.delete('/:id/:friend_id', function(req, res) {
	pg.connect(conString, function(err, client, done) {
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