// Provides all the data validation functions required by the server

module.exports.userSchema;
module.exports.usernameField = 'userName';

module.exports.userExists = (username, callback) => {
    var User = module.exports.userSchema;
    var usernameField = module.exports.usernameField;

    if(!User) {
        var error = new Error('validate.js: userSchema not defined. Set the value of userSchema to an appropriate mongoose model');
    }
    
    if(!error) {
        var query_json = {};
        query_json[usernameField] = username;
        var query = User.findOne(query_json)
        .then((user) => {
            if(user) {
                return true;
            } else {
                return false;
            }
            
        })
        .catch((err) => {
            console.log('An error occurred checking for the user\n' + err);
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
}


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
    if(input.length > 2 && regex.test(input)) {
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