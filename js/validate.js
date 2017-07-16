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
 
 // Provides all the data validation functions required by the server
const User = require('../models/User.js');
const usernameField = 'userName';
const emailField = 'email';

module.exports.userExists = (input, callback) => {
    if(!User) {
        var error = new Error('validate.js: User mongoose model not set');
    }
    
    if(!error) {
        var query_json = {};
        query_json[usernameField] = input;
        var query = User.findOne(query_json)
        .then((user) => {
            if(user) {
                return true;
            } else {
                return false;
            }
            
        })
        .catch((err) => {
            return false;
        });
    }
    
    if(typeof(callback) == 'function') {
        if(error) {
            callback(error);
        } else {
            query.then((result) => callback(null, result))
            .catch((err) => {
                callback(err);
            });
        }
        
    } else {
        if(error){
            return Promise.reject(error);
        } else {
            return query;
        }
    }
};

module.exports.emailExists = (input, callback) => {
    if(!User) {
        var error = new Error('validate.js: User mongoose model not set');
    }
    
    if(!error) {
        var query_json = {};
        query_json[emailField] = input;
        var query = User.findOne(query_json)
        .then((user) => {
            if(user) {
                return true;
            } else {
                return false;
            }
            
        })
        .catch((err) => {
            return false;
        });
    }
    
    if(typeof(callback) == 'function') {
        if(error) {
            callback(error);
        } else {
            query.then((result) => callback(null, result))
            .catch((err) => {
                callback(err);
            });
        }
        
    } else {
        if(error){
            return Promise.reject(error);
        } else {
            return query;
        }
    }
};


module.exports.username = (input, User) => {
    if (typeof(input) != 'string'){
        return false;
    }
    var regex = /^[a-z A-Z 0-9]+$/;
    if(input.length > 2 && regex.test(input)) {
        return true;
    }
    else {
        return false;
    }
};

module.exports.email = (input) => {
    if (typeof(input) != 'string'){
        return false;
    }
    var regex = /^[a-z A-Z 0-9]+\@[a-z A-Z 0-9]+(\.[a-z A-Z 0-9]+)+$/;
    if(input.length > 4 && regex.test(input)) {
        return true;
    }
    else {
        return false;
    }
    
};

module.exports.password = (input) => {
    if (typeof(input) != 'string'){
        return false;
    }
    var regex = /^[a-z A-Z 0-9]+$/;
    if(input.length > 5 && regex.test(input)) {
        return true;
    }
    else {
        return false;
    }
    
};