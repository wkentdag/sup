
var Status = {};

/**
  *
  * Status methods:
  *
**/

Status.addStatus = function(client, statusObj, cb) {
  var statusArr = [ statusObj.id, statusObj.owner, statusObj.loc, statusObj.time ]
  var qStr = "INSERT INTO status(status_id, owner_id, location, time) VALUES($1, $2, $3, $4)"
  client.query(qStr, statusArr, function(err, result){
    if (err) cb(err)
    cb(null, result)
  })
}

Status.getAllStatus = function(client, cb) {
  var query = client.query("SELECT * FROM status")
  
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

Status.getVisibleStatus = function(client, owner_id, cb){
  var qStr = "SELECT * \
              FROM status, statusView \
              WHERE statusView.owner_id = $1"
  
  client.query(qStr, [owner_id],function(err, result){
    if (err) return cb(err)
    cb(null, result)
  })
}

module.exports = Status;