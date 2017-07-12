var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

var User =  module.exports = mongoose.model('User', {
   displayName: String,
   userName : String,
   email: String,
   password : String,
   imageProfile : String,
   firstName: String,
   lastName: String,
   dateOfBirth: String,
   postsCount: Number,
   followersCount: Number,
   followingCount: Number
});

/*
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

*/

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

/*
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
*/