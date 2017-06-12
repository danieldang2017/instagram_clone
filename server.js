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

/*var post = new Post({
  userId: '5',
  image: 'image.jpg',
  comment: 'hi',
  hashTag: 'h',
  likeCount: 1,
  feedbackCount: 1
})

post.save((err) => {
  if(err) {
    console.log('An error occurred\n' + err);
  } else {
    console.log('Successful post');
  }
})

var user = new User({
  userId: '5',
  image: 'image.jpg',
  comment: 'hi',
  hashTag: 'h',
  likeCount: 1,
  feedbackCount: 1
})

user.save((err) => {
  if(err) {
    console.log('An error occurred\n' + err);
  } else {
    console.log('Successful post');
  }
})*/

//
// ## NodeJS server `NodeJSServer(obj)`
//
// Creates a new instance of NodeJS server with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

router.post('/loadUser', (req, res) => {
  User.find({userName: 'Daniel'})
  .then((user) => {
    console.log(user);
    res.json(user);
  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("NodeJS server listening at", addr.address + ":" + addr.port);
});
