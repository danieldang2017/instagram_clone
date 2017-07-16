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

module.exports = mongoose.model('Post', {
   userId: String,
   image: String,
   comment: String,
   hashTag: String,
   likeCount: Number,
   feedbackCount: Number
});