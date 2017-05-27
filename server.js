// #NodeJS server
//
// A simple server to serve the Instagram clone website.
//
var http = require('http');
var path = require('path');

var express = require('express');

//
// ## NodeJS server `NodeJSServer(obj)`
//
// Creates a new instance of NodeJS server with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("NodeJS server listening at", addr.address + ":" + addr.port);
});
