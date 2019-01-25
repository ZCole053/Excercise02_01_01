//Author: Zedekiah Cole

//Summary: This file displays hello world to
// the user that goes onto the website.

//file name: Index.js
//Date made: January 17 2019
//LTE: January 22 2019


//declaring local variables
var express = require('express'); 
//constructing object and putting it into app.
var app = express();

//require translates json files
var config = require('./config.json');

//purpose to give help with url
var url = require('url');

//creating server port
//var port = 8080;


//mounting middleware
//it is a constructor
app.use(require('cookie-parser')());


//checking for my end points endpoint
app.get('/', function(req,res) {
    //sends a response
    res.send("<h3>Hello, world!</h3>");
});


//building server and listening to the port
app.listen(config.port,function(){
    console.log("Server is listening on localhost:%s",config.port);
});

