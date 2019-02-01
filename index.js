//Author: Zedekiah Cole

//Summary: This file displays hello world to
// the user that goes onto the website.

//file name: Index.js
//Date made: January 17 2019
//LTE: January 29 2019


//declaring local variables
var express = require('express'); 
//constructing object and putting it into app.
var app = express();

//imports the file authenticator.js
var authenticator = require('./authenticator.js');

//require translates json files
var config = require('./config.json');

//purpose to give help with url
var url = require('url');

//creating server port
//var port = 8080;


//mounting middleware
//it is a constructor
//it is an iffe returns function name
app.use(require('cookie-parser')());


//checking for my end points endpoint
app.get('/', function(req,res) {
    //sends a response
    res.send("<h3>Hello, world!</h3>");
});

//pulling url route
//naming so we can use it in another module
app.get('/auth/twitter', authenticator.redirectToTwitterLoginPage);

///creating route to post tweet
//routes usually have req and res
app.get('/tweet', function(req,res){
    //grabs the credetials from the authenticator
    var credentials = authenticator.getCredentials();
    //if failure
    if(!credentials.access_token || !credentials.access_token_secret){
        ///prevents spin mode while also exiting the statment
        return res.sendStatus(418);
    }
    res.sendStatus(200);
});



app.get(url.parse(config.oauth_callback).path, function(req,res){
    //creating a callback function with a callback function
    authenticator.authenticate(req, res, function(err){
        //if it erors it will send 401 to the user and the error in the console
        if (err) {
            console.log(err);  
            //completes http rout
            //completes the circle
            res.sendStatus(401);
        }else{
            //Sends to a user that it works
            res.send("Authentication successful!");
        }
    });
})


//building server and listening to the port
app.listen(config.port,function(){
    console.log("Server is listening on localhost:%s",config.port);
    //?
    console.log('OAuth callback: ' + url.parse(config.oauth_callback).hostname + url.parse(config.oauth_callback).path);
});

