var user = process.env.USER;
var pw = process.env.PW;
var db = 'SUP';

// if (process.env.NODE_ENV === 'development') {
// 	db = 'SUP';
// } else {
// 	db = 'SUP_production';
// }

var conString = "postgres://" + user + ":" + pw + "@localhost/" + db;

module.exports = db;