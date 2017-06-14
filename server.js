// #NodeJS server
//
// A simple server to serve the Instagram clone website.
//


var http = require('http');
var path = require('path');
var Post = require('./models/Post.js');
var User = require('./models/User.js');
var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://instaadmin1:webadmin123@ds119682.mlab.com:19682/instagramdb')

//
// ## NodeJS server `NodeJSServer(obj)`
//
// Creates a new instance of NodeJS server with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
//tell the router (ie. express) where to find static files
router.use(express.static(path.resolve(__dirname, 'client')));
//tell the router to parse JSON data for us and put it into req.body
router.use(express.bodyParser());


router.post('/loadUser', (req, res) => {
  User.find({userName: 'Daniel'})
  .then((user) => {
  //  console.log(user);
    res.json(user);
  });
});

// 20170613 by Winson
// Load user information for main page
router.post('/loadUserPost', function(req, res){
   User.find({_id: req.body.id})
  .then((user) => {
    console.log(user);
    res.json(user);
  });
});

// 20170613 by Winson
// Load post information by userID for main page
router.post('/loadPost', function(req, res){
   Post.find({userId: req.body.id})
 // Post.find()
  .then((post) => {
    console.log(post);
    res.json(post);
  });
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("NodeJS server listening at", addr.address + ":" + addr.port);
});
