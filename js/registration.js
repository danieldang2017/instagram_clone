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
 
module.exports.validator;

module.exports.validate = (req, res, next) => {
    var validator = module.exports.validator;
    
    if(!validator) {
        req.valid = false;
        req.failures = [{field: 'none', reason: 'Internal Error. Try again later'}];
        next();
    } else {
        var register = req.body;
        var valid = true;
        var failures = [];
        
        if(!validator.username(register.username)) {
            failures.push({field: 'username', reason: 'Username must include at least 3 characters!'});
            valid = false;
        }
        
        if(!validator.email(register.email)) {
            failures.push({field: 'email', reason: 'Invalid email!'});
            valid = false;
        }
        
        if(!validator.password(register.password)) {
            failures.push({field: 'password', reason: 'Password must include at least 6 characters!'});
            valid = false;
        } else if(register.password != register.passwordConfirm){
            failures.push({field: 'password', reason: 'Password and confirm password do not match!'});
            valid = false;
        }
        
        validator.userExists(register.username)
        .then( (result) => {
            if(result) {
                failures.push({field: 'username', reason: 'This username has already existed. Please use another one!'});
                valid = false;
            }
        })
        .catch( (err) => {
            failures.push({field: 'username', reason: 'Error validating username!'});
            valid = false;
        })
        .then( () => {
            return validator.emailExists(register.email);
        })
        .then( (result) => {
            if(result) {
                failures.push({field: 'email', reason: 'This email has already existed. Please use another one!'});
                valid = false;
            }
        })
        .catch((err) => {
            failures.push({field: 'email', reason: 'Error validating email!'});
            valid = false;
        })
        .then( () => {
            req.valid = valid;
            req.failures = failures;
            next();
        });
    }
};