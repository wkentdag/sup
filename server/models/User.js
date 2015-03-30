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
    cb(null, result)
  })
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
    cb(err)
  })
  query.on('row', function(row, result) {
    result.addRow(row)
  })
  query.on('end', function(result) {
    cb(null, result.rows)
  })
}


module.exports = Users;