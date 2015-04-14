var superagent = require('superagent');
var root_url = require('../config/config').root_url;


var intra = {};

intra.get = function(url, cb) {
	superagent.get(url).end(function(err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, result.text, result.statusCode);
		}
	});
}

