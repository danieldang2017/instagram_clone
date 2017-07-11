/*#NodeJS server
 *A simple server to serve the Instagram clone website
 *
--------------------------------- Server configuration ----------------------------------
 *
 *1. Adds external modules from node_modules
 */
 
var dbUrl = 'mongodb://instaadmin1:webadmin123@ds119682.mlab.com:19682/instagramdb';
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');



// 2. Adds schemas from models
var Post = require('./models/Post.js');
var User = require('./models/User.js');

//session
var session = require('express-session');  
const mongoSession = require('connect-mongodb-session')(session);
const passport = require('passport');
const userAuth = require('./js/userAuth.js');
const PasswordReset = require('./models/PasswordReset.js'); 
//sendmail
const email = require('./js/sendmail.js');
const hash = require('./js/hash.js');
//create a sessions collection as well


// 3. Establishes connection to the MongoDB 
mongoose.connect('mongodb://instaadmin1:webadmin123@ds119682.mlab.com:19682/instagramdb')


// 4. Creates a new instance of NodeJS router and server
var router = express();
var server = http.createServer(router);

// 5. Tells the router where to find static files
router.use(express.static(path.resolve(__dirname, 'client')));

// 6. Tells the router to parse JSON data and put it into req.body
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

var mongoSessionStore = new mongoSession({
    uri: dbUrl,
    collection: 'sessions'
});
//add session support
router.use(session({
  secret: process.env.SESSION_SECRET || 'mySecretKey', 
  store: mongoSessionStore,
  resave: true,
  saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
userAuth.init(passport);




/*
-------------------------------- Processes requests from client ------------------------------
 *
 *I. Root access redirection
*/
 
router.get('/', function(req, res){
  console.log('client requests root');
  res.sendfile(path.join(__dirname, 'client/views','loginAndRegistration.html'));
});

router.get('/login', function(req, res){
  console.log('client requests root');
  res.sendfile(path.join(__dirname, 'client/views','loginAndRegistration.html'));
});

router.get('/forgotPassword.html', function(req, res){
  console.log('client requests root');
  res.sendfile(path.join(__dirname, 'client/views','forgotPassword.html'));
});


router.get('/index',userAuth.isAuthenticated, function(req, res){
  console.log('client requests root');
  res.sendfile(path.join(__dirname, 'client/views','index.html'));
});

router.get('/error',function(req, res){
  console.log('client requests root');
  res.sendfile(path.join(__dirname, 'client/views','Error.html'));
});

/* I. Index.html
 *    1. Load user profile
*/

router.post('/getUserProfile', (req, res) => {
  var currentUser = req.session.passport.user
  console.log(currentUser)
  User.findById(currentUser)
  .then((user) => {
    res.json(user);
  });
});


//  2. Load top profiles
router.post('/getTopProfiles', function(req, res){
   User.find().sort({followersCount : -1}).limit(2)
  .then((profiles) => {
    res.json(profiles);
  });
});

//  3. Load top posts
router.post('/getPostsContent', function(req, res){
   Post.find({ "userId" : req.body.id}).limit(4)
  .then((postsContent) => {
    res.json(postsContent);
  });
});


/* II. loginAndRegistration.html
 *   
 */
//tell the router how to handle a post request from the signin page
router.post('/signin', function(req, res, next) {
    console.log("Client Request Login");
    //tell passport to attempt to authenticate the login
    passport.authenticate('login', function(err, user, info) {
    //callback returns here
    if (err){
      //if error, say error
      res.json({isValid: false, message: 'Internal error, please try again'});
    } else if (!user) {
      //if no user, say invalid login
      res.json({isValid: false, message: 'Invalid Email or Password'});
    } else {
      //log this user in
      req.logIn(user, function(err){
        if (!err)
          //send a message to the client to say so
          res.json({isValid: true, message: 'welcome ' + user.email});
      });
    }
  })(req, res, next);
});


router.post('/passwordreset', (req, res) => {
    Promise.resolve()
    .then(function(){
        //see if there's a user with this email
        return User.findOne({'email' : req.body.email});
    })
    .then(function(user){
      if (user){
        console.log("User found");
        var pr = new PasswordReset();
        pr.userId = user.id;
        pr.password = hash.createHash(req.body.password);
        pr.expires = new Date((new Date()).getTime() + (20 * 60 * 1000));
        pr.save()
        .then(function(pr){
          if (pr){
            email.send(req.body.email, 'password reset', 'https://webinstagram-winsontran.c9users.io/verifypassword?id=' + pr.id);
            res.json({isValid: true, message: 'Your Account has been reset! Please check your email to confirm'});
          }
        });
      }
      else
      {
        res.json({isValid: false, message: 'Email is not found'});
      }
    })
});


router.get('/verifypassword', function(req, res){
    var password;
    Promise.resolve()
    .then(function(){
    return PasswordReset.findOne({id: req.body.id});
    })
    .then(function(pr){
      if (pr){
        console.log(pr)
        if (pr.expires > new Date()){
          console.log("Pr")
          console.log(pr)
          password = pr.password;
          //see if there's a user with this email
          return User.findOne({_id : pr.userId});
        }
        else
        {
          res.redirect('/error?e= Password is expired');
          console.log("Password is expired");
        }
      }
      else
      {
        res.redirect('/error?e= Invalid Verification');
        console.log("Invalid Verification");
      }
    })
    .then(function(user){
      if (user){
        console.log("Old Password")
        console.log(user.password)
        user.password = password;
        return user.save();
      }
    })
    .then(function(user){
      if(user){
        console.log("New Password")
        console.log(user.password)
        //console.log("User");
       // console.log(user);
        console.log("Reset successful");
        res.redirect('/login');
      }
      else
      {
        res.redirect('/error?e=' + encodeURIComponent('Reset Failed'));
        console.log("Reset Failed")
      }
    })
});

 
/* III. ForgotPassword.html
 *    1. 
 */

/*---------------------------------------------------------------------------------------
 *Starts server
 */
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("NodeJS server listening at", addr.address + ":" + addr.port);
});
