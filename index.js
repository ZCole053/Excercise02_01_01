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
//creating server port
var port = 8080;


//checking for my end points endpoint
app.get('/', function(req,res) {
    //sends a response
    res.send("<h3>Hello, world!</h3>");
});


//building server and listening to the port
app.listen(port,function(){
    console.log("Server is listening on localhost:%s",port);
});