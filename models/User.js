var forEachAsync = require('forEachAsync').forEachAsync;
var Users = {};

/**
	*
	* User methods:
	*
**/

Users.addUser = function(client, usrObj, cb) {
	var usrArr = [ usrObj.first_name, usrObj.last_name, usrObj.phone];
	var qStr = "INSERT INTO users(first_name, last_name, phone) VALUES($1, $2, $3) RETURNING *"
	client.query(qStr, usrArr, function(err, result){
		if (err) return cb(err)
		cb(null, result);
	});
}

Users.getUserById = function(client, user_id, cb) {
	var qStr = "SELECT * FROM users WHERE user_id = $1";
	client.query(qStr, [user_id], function(err, result){
		if (err) {
			return cb(err);
		} else {
			cb(null, result);
		}  
	});
}

Users.getUserByPhone = function(client, phone, cb) {
	var query = "SELECT * FROM users WHERE phone = $1";
	var values = [phone];
	client.query(query, values, function(err, result) {
		if (err) return cb(err);
		cb(null, result.rows);
	});
}

Users.getAllUsers = function(client, cb) {
	var query = client.query("SELECT * FROM users")
	
	query.on('error', function(err) {
		cb(err);
	});

	query.on('row', function(row, result) {
		result.addRow(row);
	});

	query.on('end', function(result) {
		cb(null, result.rows);
	});

}

/**
	*
	* Friendship methods:
	*
**/

//  SELECT ALL friend relations in the friend table
Users.getAllFriendships = function(client, cb) {
	var query = client.query("SELECT * FROM friends");
	
	query.on('error', function(err) {
		cb(err);
	});

	query.on('row', function(row, result) {
		result.addRow(row);
	});

	query.on('end', function(result) {
		cb(null, result.rows);
	});
}

//  SELECT all friend relations for one user
Users.getFriends = function(client, user_id, cb) {
	var getFriendIdsOfUser = "SELECT * FROM friends WHERE user_id = $1";
	var getInfoForUser = "SELECT * FROM users WHERE user_id = $1";
	client.query(getFriendIdsOfUser, [user_id],function(err, result) {
		if (err) return cb(err);

		var fids = [];
		for (var rel in result.rows) {
			fids.push(result.rows[rel].friend_id);
		}

		var friends = [];
		forEachAsync(fids, function(next, friend_id, i, array) {

			client.query(getInfoForUser, [friend_id], function(err, result) {
				if (err) return cb(err);
				friends.push(result.rows[0]);
				next();
			});
		}).then(function() {
			cb(null, friends);
		});

	});
}

Users.getOneFriendship = function(client, user_id, friend_id, cb) {
  var sv = [user_id, friend_id];
  var qStr = "SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2";
  client.query(qStr, sv, function(err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result.rows);
    }
  });
}

//  INSERT a new friendship into the friends table
Users.addFriend = function(client, user_id, friend_id, cb) {
	var friends = [user_id, friend_id];
	var qStr = "INSERT INTO friends(user_id, friend_id) VALUES($1, $2)";
	client.query(qStr, friends, function(err, result) {
		if (err) return  cb(err)
		cb(null, result);
	});
}

//  DELETE a friendship from the friends table
Users.deleteFriend = function(client, user_id, friend_id, cb) {
	var friends = [user_id, friend_id];
	var qStr = "DELETE FROM friends \
							WHERE user_id = $1 AND friend_id = $2";

	client.query(qStr, friends, function(err, result) {
		if (err) return cb(err);
		cb(null, result);
	});
}

Users.requestFriend = function(client, user_id, requester_name, requested_id, cb) {
	var values = [user_id, requester_name, requested_id];
	var query = "INSERT INTO requests(user_id, user_name, requested_id) VALUES($1, $2, $3)";
	client.query(query, values, function(err, result) {
		if (err) return cb(err);
		cb(null, result);
	})
}

Users.getAllFriendRequests = function(client, cb) {
	var query = "SELECT * FROM requests";
	client.query(query, function(err, result) {
		if (err) return cb(err);
		cb(null, result.rows);
	});
}

Users.getFriendRequest = function(client, user_id, requested_id, cb) {
	var query = "SELECT * FROM requests WHERE user_id = $1 AND requested_id = $2";
	var values = [user_id, requested_id];
	client.query(query, values, function(err, result) {
		if (err) return cb(err);
		cb(null, result.rows);
	});
}

Users.getPendingRequestsForUser = function(client, requested_id, cb) {
	var query = "SELECT * FROM requests WHERE requested_id = $1 ORDER BY created DESC";
	var values = [requested_id];
	client.query(query, values, function(err, result) {
		if (err) return cb(err);
		cb(null, result.rows);
	});
}

Users.approveFriendRequest = function(client, user_id, requested_id, cb) {
	var deleteReq = "DELETE FROM requests WHERE user_id = $1 AND requested_id = $2";
	var approveFriends = "INSERT INTO friends(user_id, friend_id) VALUES($1, $2) RETURNING *";
	var values = [user_id, requested_id];

	client.query(deleteReq, values, function(err, result) {
		if (err) {
			return cb(err);
		} else {
			client.query(approveFriends, values, function(err, result) {
				if (err) {
					return cb(err);
				} else {
					cb(null, result);
				}
			});	//	end query 2
		}
	});	//	end query 1
}


module.exports = Users;