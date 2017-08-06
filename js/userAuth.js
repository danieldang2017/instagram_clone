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
 
const User = require('../models/User.js');
const LocalStrategy = require('passport-local').Strategy;
const hash = require('./hash.js');

//encapsulate initialization of the passport functionality
module.exports.init = function(passport){
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, callback) {
        callback(null, user._id);
    });

    passport.deserializeUser(function(id, callback) {
        User.findById(id, function(err, user) {
            callback(err, user);
        });
    });

    //set up the login handler
    passport.use('login', new LocalStrategy(handleLoginAttempt));
    //set up the signup handler
	passport.use('signup', new LocalStrategy({passReqToCallback: true}, handleSignupAttempt));
};

//encapsulate validating whether this session has an authenticated user
module.exports.isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session 
	if (req.isAuthenticated()){
        //allow them to proceed
        next();
    } else {
        // if the user is not authenticated then redirect him to the login page
        res.redirect('/login');
    }
};

//passport will call this function when someone attempts to log in
function handleLoginAttempt(email, password, cb){
    
    Promise.resolve()
    .then(function(){
        //see if there's a user with this email
        return User.findOne({'email' : email});
    })
    .then(function(user){
        var param = false;
        //if the user exists and the hash of the password provided matches
        if (user && hash.isValid(user, password))
            //return the user object
            param = user;
        //execute the callback with appropriate parameters
        cb(null, param);
    })
    .catch(function(err){
        //even if something went wrong, we still need to call the callback
        cb(err);
    });
}

//passport will call this function when someone attempts to join
function handleSignupAttempt(req, username, password, done) {
    User.findOne({'userName': username})
    .then( (user) => {
        if(!user) {
            user = new User({
                displayName: req.body.displayName,
                userName: username,
                password: hash.createHash(password),
                email: req.body.email,
                imageProfile: 'default.png',
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                postsCount: 0,
                followersCount: 0,
                followingCount: 0
            });
            
            user.save()
            .then( (result) => {
                done(null, result);
            })
            .catch( (err) => {
                done(err, false);
                
            });
        } else {
            done(null, false);
        }
    })
    .catch( (err) => {
        done(err);
    });
}