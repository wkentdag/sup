
var Status = {};

/**
  *
  * Status methods:
  *
**/

Status.addStatus = function(client, statusObj, cb) {
  var statusArr = [ statusObj.id, statusObj.owner, statusObj.latitude, statusObj.longitude, statusObj.time ]
  var qStr = "INSERT INTO status(status_id, owner_id, latitude, longitude, time) VALUES($1, $2, $3, $4, $5)"
  client.query(qStr, statusArr, function(err, result){
    if (err) return cb(err)
    cb(null, result)
  })
}

Status.getAllStatus = function(client, cb) {
  var query = client.query("SELECT * FROM status")
  
  query.on('error', function(err) {
    cb(err)
  });
  query.on('row', function(row, result) {
    result.addRow(row)
  });
  query.on('end', function(result) {
    cb(null, result.rows)
  });
}

Status.getStatusById = function(client, status_id, cb) {
  var qStr = "SELECT * \
              FROM status \
              WHERE status_id = $1";
  client.query(qStr, [status_id], function(err, result) {
    if (err) {
      return cb(err);
    } else {
      cb(null, result);
    }
  });
}

Status.getStatusByOwner = function(client, owner_id, cb){
  var qStr = "SELECT * \
              FROM status \
              WHERE owner_id = $1"
  
  client.query(qStr, [owner_id],function(err, result){
    if (err) return cb(err)
    cb(null, result)
  })
}

/**
  *
  * Status View methods
  *
**/

Status.getAllViews = function(client, cb) {
  var query = client.query("SELECT * FROM statusView");

  query.on('error', function(err) {
    cb(er);
  });

  query.on('row', function(row, result) {
    result.addRow(row);
  });

  query.on('end', function(result) {
    cb(null, result.rows);
  });
}

Status.getViewersByStatus = function(client, status_id, cb) {
  var qStr = "SELECT * FROM statusView WHERE status_id = $1";
  client.query(qStr, [status_id], function(err, result) {
    if (err) {
      return cb(err);
    } else {
      cb(null, result.rows);
    }
  });
}

Status.getStatusByUser = function(client, user_id, cb) {
  var qStr = "SELECT * FROM statusView WHERE user_id = $1";
  client.query(qStr, [user_id], function(err, result) {
    if (err) {
      return cb(err);
    } else {
      cb(null, result.rows);
    }
  });
}

Status.addStatusView = function(client, user_id, status_id, cb) {
  var sv = [user_id, status_id];
  var qStr = "INSERT INTO statusView(user_id, status_id) VALUES($1, $2)";
  client.query(qStr, sv, function(err, result) {
    if (err) return  cb(err)
    cb(null, result);
  });
}

module.exports = Status;