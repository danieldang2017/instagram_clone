/*Group information:
 *
 *Student 1:
 *
 *Tran Ngoc Phuong Dang (a.k.a Daniel). Student number: 7843618
 *
 *Student 2:
 *
 *Chi Hieu Tran (a.k.a Winson). Student number: 7822620
 *
 *Student 3:
 *
 *Duncan Robertson. Student number: 8074833
 */
 
var mongoose = require('mongoose');

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

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};