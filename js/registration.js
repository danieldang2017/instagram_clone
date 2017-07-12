module.exports.validator;

module.exports.validate = (req, res, next) => {
    var validator = module.exports.validator;
    
    if(!validator) {
        console.log('Validator not set for registration validation. All validation attempts will automatically fail');
        req.valid = false;
        req.failures = [{field: 'none', reason: 'Internal Error. Try again later'}];
        next();
    } else {
        var register = req.body;
        var valid = true;
        var failures = [];
        
        if(register.password != register.passwordConfirm){
            failures.push({field: 'password', reason: 'Passwords do not match'});
            valid = false;
        }
        
        if(!validator.username(register.username)) {
            failures.push({field: 'username', reason: 'Invalid username'});
            valid = false;
        }
        
        if(!validator.email(register.email)) {
            failures.push({field: 'email', reason: 'Invalid email'});
            valid = false;
        }
        
        if(!validator.password(register.password)) {
            failures.push({field: 'password', reason: 'Invalid password'});
            valid = false;
        }
        
        validator.userExists(register.username)
        .then( (result) => {
            if(result) {
                failures.push({field: 'username', reason: 'Username already taken'});
                valid = false;
            }
        })
        .catch( (err) => {
            console.log('Error validating unique username\n' + err);
            failures.push({field: 'username', reason: 'Error validating username'});
            valid = false;
        })
        .then( () => {
            return validator.emailExists(register.email);
        })
        .then( (result) => {
            if(result) {
                failures.push({field: 'email', reason: 'Email already registered'});
                valid = false;
            }
        })
        .catch((err) => {
            console.log('Error validating unique email\n' + err);
            failures.push({field: 'email', reason: 'Error validating email'});
            valid = false;
        })
        .then( () => {
            req.valid = valid;
            req.failures = failures;
            next();
        });
    }
};