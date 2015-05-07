var forEachAsync = require('forEachAsync').forEachAsync;
var Status = {};

/**
  *
  * Status methods:
  *
**/

Status.addStatus = function(client, statusObj, cb) {

  var expires = new Date(new Date().getTime() + (statusObj.duration * 60 * 1000) );

  var statusArr = [ statusObj.owner_id, statusObj.owner_name, statusObj.message, statusObj.latitude, statusObj.longitude, statusObj.duration, expires];
  var qStr = "INSERT INTO status(owner_id, owner_name, message, latitude, longitude, duration, expires) VALUES($1, $2, $3, $4, $5, $6, $7)\
              RETURNING *";
  client.query(qStr, statusArr, function(err, result){
    if (err) return cb(err)
    cb(null, result.rows)
  });
}

Status.getAllStatus = function(client, cb) {
  var query = client.query("SELECT * FROM status ORDER BY created DESC")
  
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

Status.getStatusesByOwner = function(client, owner_id, cb){
  var qStr = "SELECT * \
              FROM status \
              WHERE owner_id = $1 ORDER BY created DESC"
  
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

Status.getVisibleStatuses = function(client, user_id, cb) {
  var getViewers = "SELECT * FROM statusView WHERE user_id = $1";
  var getInfoForStatus = "SELECT * FROM status WHERE status_id = $1";
  client.query(getViewers, [user_id], function(err, result) {
    if (err) return cb(err);

    var sids = [];
    for (var rel in result.rows) {
      sids.push(result.rows[rel].status_id);
    }

    var statuses = [];
    forEachAsync(sids, function(next, status_id, i, array) {
      client.query(getInfoForStatus, [status_id], function(err, result) {
        if (err) return cb(err);

        var now = new Date().getTime();
        var expDate = result.rows[0].expires.getTime();

        //  only send statuses that haven't yet expired
        if (expDate >= now) {
          statuses.push(result.rows[0]);
        }

        next();
      });
    }).then( function() {
      cb(null, statuses);
    });

  });
}

Status.addStatusView = function(client, user_id, status_id, cb) {
  var sv = [user_id, status_id];
  var qStr = "INSERT INTO statusView(user_id, status_id) VALUES($1, $2) RETURNING *";
  client.query(qStr, sv, function(err, result) {
    if (err) return  cb(err)
    cb(null, result.rows);
  });
}

Status.getOneView = function(client, user_id, status_id, cb) {
  var sv = [user_id, status_id];
  var qStr = "SELECT * FROM statusView WHERE user_id = $1 AND status_id = $2";
  client.query(qStr, sv, function(err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result.rows);
    }
  });
}

module.exports = Status;