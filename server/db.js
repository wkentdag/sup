var pg = require('pg');
var sql = require('sql');


//	DB connection

var user = process.env.USER;
var pw = process.env.PW;
var db = 'SUP';
var conString = "postgres://" + user + ":" + pw + "@localhost/" + db;

// if (process.env.NODE_ENV === 'development') {
// 	db = 'SUP';
// } else {
// 	db = 'sup-production';
// }


//	Table definitions

var users = sql.define({
	name: 'users',
	columns: [
		{
			name: 'id',
			dataType: 'serial',
			primaryKey: true,
			notNull: true
		},
		{
			name: 'name',
			dataType: 'varchar(80)',
			notNull: true
		},
		{
			name: 'phone',
			dataType: 'int',
			notNull: true
		}
	]
});

var status = sql.define({
	name: 'status',
	columns: [
		{
			name: 'id',
			dataType: 'serial',
			unique: true,
			notNull: true
		},
		{
			name: 'owner_id',
			dataType: 'serial',
			notNull: true
		},
		{
			name: 'longitude',
			dataType: 'float',
			notNull: true
		},
		{
			name: 'latitude',
			dataType: 'float',
			notNull: true
		},
		{
			name: 'time',
			dataType: 'int',
			notNull: true
		},
		{
			name: 'created',
			dataType: 'timestamp',
			default: 'current_timestamp'
		}
	]
});

var status_view = sql.define({
	name: 'status_view',
	columns: [
		{
			name: 'user_id',
			dataType: 'serial',
			notNull: true
		},
		{
			name: 'status_id',
			dataType: 'serial',
			notNull: true
		}
	]
});

var friends = sql.define({
	name: 'friends',
	columns: [
		{
			name: 'user_id',
			dataType: 'serial',
			notNull: true
		},
		{
			name: 'friend_id',
			dataType: 'serial',
			notNull: true
		}
	]
});


//	Query generation

// var queries = [];

// queries.push(users.create().toQuery().text);
// queries.push(status.create().toQuery().text);
// queries.push(status_view.create().toQuery().text);
// queries.push(friends.create().toQuery().text);

// console.log(queries);

//	Table instantiation

// pg.connect(conString, function(err, client, done) {
// 	if (err) {
// 		console.log('error!\t', err);
// 		return err;
// 	}

// 	console.log('pg connected!');

// 	for (q in queries) {
// 		client.query(queries[q], function(err, result) {
// 			if (err) {
// 				console.log('error on query', q, ':\n\n', err);
// 				return err;
// 			}

// 			console.log('completed query\t', q);
// 		});
// 	}
// 	done();

// 	client.end();
// });





///////////

module.exports = conString;