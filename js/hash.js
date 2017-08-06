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

const bCrypt = require('bcrypt-nodejs');

module.exports.createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
    
module.exports.isValid = function(user, password){
        return bCrypt.compareSync(password, user.password);
}
