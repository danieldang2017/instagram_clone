var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
   displayName: String,
   userName : String,
   password : String,
   imageProfile : String,
   firstName: String,
   lastName: String,
   dateOfBirth: String,
   postsCount: Number,
   followersCount: Number,
   followingCount: Number
});