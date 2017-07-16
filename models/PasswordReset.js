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
 
//since we'll be creating a mongoose model for our post, we need to include the mongoose module
var mongoose = require('mongoose');

//we're building a POST object model in mongoose that we'll use elsewhere
module.exports = mongoose.model('PasswordReset', {
    userId: String,
    password: String, //this will be the hashed value of the password
    expires: Date 
});