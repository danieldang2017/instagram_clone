module.exports.validator;

module.exports.validate = (req, res, next) => {
    var validator = module.exports.validator;
    
    if(!validator) {
        console.log('Validator not set for registration validation. All validation attempts will automatically fail');
        req.valid = false;
        req.failures = [{field: 'none', reason: 'System failure'}];
    }
    
    var register = req.body;
    var valid = true;
    var failures = [];
    
    if(register.passwordsignup != register.passwordsignup_confirm){
        failures.push({field: 'password', reason: 'Passwords do not match'});
        valid = false;
    }
    
    if(!validator.username(register.usernamesignup)) {
        failures.push({field: 'username', reason: 'Invalid username'});
        valid = false;
    }
    
    if(!validator.email(register.emailsignup)) {
        failures.push({field: 'email', reason: 'Invalid email'});
        valid = false;
    }
    
    if(!validator.password(register.passwordsignup)) {
        failures.push({field: 'password', reason: 'Invalid password'});
        valid = false;
    }
    
    validator.userExists(register.usernamesignup)
    .then( (result) => {
        if(result) {
            failures.push({field: 'username', reason: 'Username already taken'});
            valid = false;
        }
    })
    .catch( (err) => {
        console.log('Error validating unique username\n' + err);
        failures.push({field: 'username', reason: 'Error validating unique username'});
        valid = false;
    })
    .then( () => {
        req.valid = valid;
        req.failures = failures;
        next();
    })
    ;
};