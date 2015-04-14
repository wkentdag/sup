var superagent = require('superagent');
var root_url = require('../config/config').root_url;


var intra = {};

intra.get = function(url, cb) {
	var fullUrl = 'http://' + root_url + url;
	superagent.get(fullUrl).end(function(err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, JSON.parse(result.text), result.statusCode);
		}
	});
}

intra.post = function(url, params, cb) {
	var fullUrl = 'http://' + root_url + url;
	superagent.post(fullUrl).send(params).end(function(err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, JSON.parse(result.text), result.statusCode);
		}
	});
}


module.exports = intra;
