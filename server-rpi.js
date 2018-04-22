"use strict";

/**
* Run this on a raspberry pi 
* then browse (using google chrome/firefox) to http://[pi ip]:1868/
*/


/*REQUIRED*/
var port = process.env.PORT || 1868;


const http    = require('http');
const express = require('express');
const app  = express();

const WebStreamerServer = require('./lib/raspivid');
const server  = http.createServer(app);
/*REQUIRED*/


/*REQUIRED*/
  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));
//const gamPad = new WebStreamerServer(server);
const silence = new WebStreamerServer(server);
server.listen(port);
console.log("Server is now running on port " + port + "...........");
/*REQUIRED*/
