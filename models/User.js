var Users = {};

/**
	*
	* User methods:
	*
**/

Users.addUser = function(client, usrObj, cb) {
	var usrArr = [ usrObj.id, usrObj.name, usrObj.email ]
	var qStr = "INSERT INTO users(user_id, name, email) VALUES($1, $2, $3)"
	client.query(qStr, usrArr, function(err, result){
		if (err) return cb(err)
		cb(null, result);
	});
}

Users.getUserById = function(client, user_id, cb) {
	var qStr = "SELECT user_id, name, email FROM users WHERE user_id = $1";
	client.query(qStr, [user_id], function(err, result){
		if (err) {
			return cb(err);
		} else {
			cb(null, result);
		}  
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
	var qStr = "SELECT * \
							FROM friends \
							WHERE user_id = $1"
	
	client.query(qStr, [user_id],function(err, result){
		if (err) return cb(err)
		cb(null, result)
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


module.exports = Users;