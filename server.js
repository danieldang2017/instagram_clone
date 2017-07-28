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
var validate = require('./js/validate.js');
var registration = require('./js/registration.js');
const Like = require('./models/Like.js');

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
mongoose.connect('mongodb://instaadmin1:webadmin123@ds119682.mlab.com:19682/instagramdb', {useMongoClient: true});


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

// 7. Misc module settings
validate.userSchema = User;
mongoose.Promise = global.Promise;
registration.validator = validate;

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
*/

/*
 *I. Root access redirection
*/

router.get('/', userAuth.isAuthenticated, function(req, res){
  res.sendfile(path.join(__dirname, 'client/views','index.html'));
});

router.get('/login', function(req, res){
  res.sendfile(path.join(__dirname, 'client/views','loginAndRegistration.html'));
});

router.get('/forgotPassword.html', function(req, res){
  res.sendfile(path.join(__dirname, 'client/views','forgotPassword.html'));
});


router.get('/index',userAuth.isAuthenticated, function(req, res){
  res.sendfile(path.join(__dirname, 'client/views','index.html'));
});

router.get('/error',function(req, res){
  res.sendfile(path.join(__dirname, 'client/views','Error.html'));
});

router.get('/success', function(req, res){
  res.sendfile(path.join(__dirname, 'client/views','resetSuccess.html'));
});

/* I. Index.html
 *    1. Load user profile
*/

router.post('/getUserProfile', (req, res) => {
  var currentUser = req.session.passport.user;
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
        var pr = new PasswordReset();
        pr.userId = user.id;
        pr.password = hash.createHash(req.body.password);
        pr.expires = new Date((new Date()).getTime() + (20 * 60 * 1000));
        pr.save()
        .then(function(pr){
          if (pr){
            var url = req.protocol + '://' + req.headers.host;
            var emailBody = "Dear " + user.firstName + " " + user.firstName + "," + "\n \n";
            emailBody = emailBody + "We have received a request to reset the password for this email. \n"
            emailBody = emailBody + "Please click on the link below to confirm your new password. \n \n"
            emailBody = emailBody + url + '/verifypassword?id=' + pr.id;
            emailBody = emailBody + "\n \n";
            emailBody = emailBody + "Thank You! \n";
            emailBody = emailBody + "Instagram Customer Service";
            email.send(req.body.email, 'Reset Password Confirmation', emailBody);
            res.json({isValid: true, message: 'Your Account has been reset! </br> Please check your email to confirm'});
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
      return PasswordReset.findById(req.query.id);
    })
    .then(function(pr){
      if (pr){
        if (pr.expires > new Date()){
      
          password = pr.password;
          //see if there's a user with this email
          return User.findOne({_id : pr.userId});
        }
        else
        {
          res.redirect('/error?e=passwordExpired');
        }
      }
      else
      {
        res.redirect('/error?e=invalidVerification');
      }
    })
    .then(function(user){
      if (user){
        user.password = password;
        return user.save();
      }
    })
    .then(function(user){
      if(user){
        res.redirect('/login');
      }
      else
      {
        res.redirect('/error?e=resetFailed');
      }
    })
});

router.post('/register', registration.validate, (req, res, next) => {
  var response = {};
  
  if(!req.valid) {
    response.success = false;
    response.failures = req.failures;
    res.json(response);
  } else {
    passport.authenticate('signup', (err, user) => {
      if(!err && user) {
        response.success = true;
      } 
      else {
        response.success = false;
        response.failures.push({field: 'none', reason: 'Registration failed, try again later'});
      }
      res.json(response);
    })(req, res, next);
  }
});

//tell the router how to handle a post request to /incrLike
router.post('/incrLike', userAuth.isAuthenticated, function(req, res){
  Like.findOne({userId: req.user.id, postId: req.body.id})
  .then(function(like){
    // Increase Like
    if (!like){  
      //go get the post record
      Post.findById(req.body.id)
      .then(function(post){
        //increment the like count
        post.likeCount++;
        //save the record back to the database
        return post.save(post);
      })
      .then(function(post){
        var like = new Like();
        like.userId = req.user.id;
        like.postId = req.body.id;
        like.save();
        //a successful save returns back the updated object
        res.json({id: req.body.id, count: post.likeCount, result: true});  
      })
    }
    //Decrease Like
    else { 
      Post.findById(req.body.id)
      .then(function(post){
        //decrease the like count
        post.likeCount--;
        //save the record back to the database
        return post.save(post);
      })
      .then(function(post){
        Like.remove({userId: req.user.id, postId: req.body.id}).exec();
        //a successful save returns back the updated object
        res.json({id: req.body.id, count: post.likeCount, result: false});    
      })
    }
  })
  .catch(function(err){
    console.log(err);
  })
});


//tell the router how to handle a post request to /incrLike
router.post('/isLike', function(req, res){
  Like.findOne({userId: req.user.id, postId: req.body.id})
  .then(function(like){
    if (!like)
    {
       res.json(false); 
    }
    else
    {
       res.json(true); 
    }
  })
});

 
router.post('/logout', (req, res) => {
  req.logout();
  res.json({success: true});
});

/*---------------------------------------------------------------------------------------
 *Starts server
 */
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("NodeJS server listening at", addr.address + ":" + addr.port);
});
