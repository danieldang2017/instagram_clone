/*#NodeJS server
 *A simple server to serve the Instagram clone website
 *
--------------------------------- Server configuration ----------------------------------
 *
 *1. Adds external modules from node_modules
 */
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var validate = require('./js/validate.js');
var registration = require('./js/registration.js');

// 2. Adds schemas from models
var Post = require('./models/Post.js');
var User = require('./models/User.js');

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

/*
validate.userExists('Daniel', (err, result) => {
  if(err) {
    console.error(err);
  } else {
    console.log(result);
  }
});

validate.userExists('Daniel')
.then( (result) => {
  console.log(result);
})
.catch( (err) => {
  console.error(err);
});
*/

/*
-------------------------------- Processes requests from client ------------------------------
*/
 
router.post('/register', registration.validate, (req, res) => {
  var response = {};
  response.success = req.valid
  
  if(!req.valid) {
    response.failures = req.failures;
  }
  res.json(response);
});

/*
 *I. Root access redirection
 */
router.get('/', function(req, res){
  console.log('client requests root');
  res.sendfile(path.join(__dirname, 'client/views','loginAndRegistration.html'));
});

/* I. Index.html
 *    1. Load user profile
 */
router.post('/getUserProfile', (req, res) => {
  User.findById(req.body.id)
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
 *    1. 
 */
 
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
