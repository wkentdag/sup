var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
      
var userSchema = new Schema({
	email: {type: String, required: true, trim: true, index: {unique: true}},
	// pwHash: {type: String, required: true},
	// access:f {type: Number, required: true, default: 1},
	firstName: {type: String, required: true, trim: true},
	lastName: {type: String, required: true, trim: true},
	phone: {type: Number, required: true},
	dateCreated: {type: Date, default: Date.now}
});
      
var user = mongoose.model('user', userSchema);
      
module.exports = {
  User: user
};