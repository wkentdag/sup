var superagent = require('superagent');
var expect = require('expect.js');

describe('sup api server', function() {

	var id = '54ea3402b6b58e1e14f2aef9';

	it('gets all users', function (done) {
		superagent.get('http://localhost:3000/users')
		.end(function (e,res) {
			// console.log(res.body);
			expect(e).to.eql(null);
			expect(res.statusCode).to.eql(200);
			expect(res.body.users[0]._id.length).to.eql(24);
			expect(res.body.users[0]._id).to.eql(id);
			done();
		});
	});

	it('gets a user', function (done) {
		superagent.get('http://localhost:3000/users/' + id)
		.end(function (e, res) {
			// console.log(res.body);
			expect(e).to.eql(null);
			expect(res.statusCode).to.eql(200);
			expect(typeof res.body).to.eql('object');
			expect(res.body._id.length).to.eql(id.length);
			expect(res.body._id).to.eql(id);
			done();
		});
	});

	it('updates a user', function (done) {
		superagent.put('http://localhost:3000/users/')
		.send({
			id: id,
			firstName: 'test',
			lastName: 'Test'})
		.end(function (e, res) {
			// console.log(res.body);
			expect(e).to.eql(null);
			expect(res.statusCode).to.eql(200);
			expect(typeof res.body).to.eql('object');
			expect(res.body.message).to.eql('User updated');
			done();
		});
	});

	it('adds a new user', function (done) {
		superagent.post('http://localhost:3000/users')
		.send({
			email: 'test@user.com',
			firstName: 'Jane',
			lastName: 'Doe',
			phone: 1234567890})
		.end(function (e, res) {
			// console.log(res.body);
			expect(e).to.eql(null);
			expect(res.statusCode).to.eql(201);
			expect(res.body.message).to.eql('User created: Jane');
			done();
		});
	});
	
	it('removes a user', function(done){
		superagent.del('http://localhost:3000/users')
		.send({
			id: id})
		.end(function(e, res){
			// console.log(res.body);
			expect(e).to.eql(null);
			expect(res.statusCode).to.eql(200);
			expect(res.body.message).to.eql('User removed.');
			done();
		});
	});
});