var express = require('express');
var router = express.Router();

var User = require('../models/user').User;

/* GET users listing. */


router.get('/', function(req, res) {
	User.find({}, function (err, docs) {
		if (!err) {
			res.json(200, {users: docs});
		} else {
			res.json(500, {message: err});
		}
	});
});

router.post('/', function(req, res) {
	var email = req.body.email,
	firstName = req.body.firstName,
	lastName = req.body.lastName,
	phone = req.body.phone,
	dateCreated = req.body.dateCreated

	User.findOne({email: email},
	function(err, doc) {
		if ( !err && !doc) {
			var newUser = new User();
			newUser.email = email,
			newUser.firstName = firstName,
			newUser.lastName = lastName,
			newUser.phone = phone,
			newUser.dateCreated = dateCreated

			newUser.save(function(err) {
				if ( !err ) {
					res.json(201, {message: "User created: " + newUser.firstName})
				} else {
					res.json(500, {message: "Could not create new user. Error: " + err});
				}
			});
		} else if ( !err ) {
			res.json(403, {message: "User already exists"});
		} else {
			res.json(500, {message: err});
		}
	});
});

router.put('/', function(req, res) {
	var id = req.body.id;

	User.findById(id, function(err, doc) {
		if (!err && doc) {
			doc.firstName = req.body.firstName;
			doc.lastName = req.body.lastName;
			doc.save(function(err, doc) {
				if (!err) {
					res.json(200, {message: 'User updated' + doc});
				} else {
					res.json(500, {message: 'Error updating.' + err});
				}
			});
		} else if (!err) {
			res.json(404, {message: 'Could not find user'});
		} else {
			res.json(500, {message: 'Error updating:' + err});
		}
	});
});

router.delete('/', function(req, res) {
	var id = req.body.id;
	User.findById(id, function(err, doc) {
		if(!err && doc) {
			doc.remove();
			res.json(200, { message: "User removed."});
		} else if(!err) {
			res.json(404, { message: "Could not find user."});
		} else {
			res.json(403, {message: "Could not delete user. " + err});
		}
	});
})



router.get('/:id', function(req, res) {
	var id = req.params.id;
	User.findById(id, function(err, doc) {
		if ( !err && doc) {
			res.json(200, doc);
		} else if ( err ) {
			res.json(500, {message: 'Error loading user:' + err});
		} else {
			res.json(404, {message: 'Error finding user.'});
		}
	});
});

router.get('/:id/friends', function(req, res) {
	var id = req.params.id;
	User.findById(id, function(err, doc) {
		
		if ( !err && doc) {
			if (doc.friends.length > 0) {
				// console.log(doc, 'got friends!!!');
				res.json(200, doc.friends);
			} else {
				// console.log('got no friends:(');
				res.json(200, {message: 'user has no friends :('});
			}
		} else if ( err ) {
			res.json(500, {message: 'Error loading user: ' + err});
		} else {
			res.json(404, {message: 'error finding user'});
		}
	});	
});

router.post('/:id/friends', function(req, res) {
	var id = req.params.id;
	User.findById(id, function(err, doc) {
		if (!err && doc) {
			// var friends = req.body.friends;	
			doc.friends = req.body.friends;
			doc.save(function (err, doc) {
				if (!err) {
					res.json(200, {message: 'User updated' + doc.friends});
				} else {
					res.json(500, {message: 'Error updating'});
				}
			});
		} else if (!err) {
			res.json(404, {message: 'Could not find user'});
		} else {
			res.json(500, {message: 'Error loading user: ' + err});
		}
	});
});

router.put('/:id/friends', function(req, res) {
	var id = req.params.id;
	var friends = req.body.friends;
	//	note: this method doesn't validate whether a friend is already on this list,
	//	so it duplicates them
	User.findByIdAndUpdate(id, {$pushAll: {friends: friends}}, function(err, doc) {
		if (!err && doc) {
			res.json(200, {message: 'User updated' + doc.friends});
		} else if (!err) {
			res.json(404, {message: 'Could not find user'});
		} else {
			res.json(500, {message: 'Error loading user: ' + err});
		}
	});
});

router.delete('/:id/friends', function(req, res) {
	var id = req.params.id;
	var friends = req.body.friends;
	User.findByIdAndUpdate(id, {$pullAll: {friends: friends}}, function(err, doc) {
		if (!err && doc) {
			res.json(200, {message: 'User updated' + doc.friends});
		} else if (!err) {
			res.json(404, {message: 'Could not find user'});
		} else {
			res.json(500, {message: 'Error loading user: ' + err});
		}
	});
});

module.exports = router;

