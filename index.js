//Author: Zedekiah Cole

//Summary: This file displays multiple endpoints with different 
//possible functions on the website 

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

//not global, not npm, it is a core module
var queryString =  require('querystring');

//pulling in new async module file
var async = require('async');

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
    var url = "https://api.twitter.com/1.1/statuses/update.json";
    authenticator.post(url, credentials.access_token,credentials.access_token_secret, 
        {
            //text that is being tweeted
            status: "Was up"
     },function(error, data){
        if(error){
            //chain together response
            return res.status(400).send(error);
        }
        res.send("Tweet successful");
     });
});

//gets all the tweetes sent and replied to a certain account
//get something off url bar
app.get('/search', function(req, res){
    var credentials = authenticator.getCredentials();
     //if failure
     if(!credentials.access_token || !credentials.access_token_secret){
        ///prevents spin mode while also exiting the statment
        return res.sendStatus(418);
    }
    var url = "https://api.twitter.com/1.1/search/tweets.json";
    //filter stringify will format spaces and things for a url
    var query = queryString.stringify({ q: 'NASA'});//sending json with name value pairs 
    url += '?' + query;
    //doesn't get body because data is not being posted
    authenticator.get(url,credentials.access_token,credentials.access_token_secret, 
    function(error,data){
        if(error){
            return res.status(400).send(error);
        }
        //sends back the data so we can see what we got
        res.send(data);//debug
    });
});

//cursor collection
app.get('/friends', function(req, res){
    var credentials = authenticator.getCredentials();
     //if failure
     if(!credentials.access_token || !credentials.access_token_secret){
        ///prevents spin mode while also exiting the statment
        return res.sendStatus(418);
     }
    var url = "https://api.twitter.com/1.1/friends/list.json";
    //defaults to first page
    //if not first time through it will execute
    if(req.query.cursor){
        //modifying the url
        url += '?' + queryString.stringify({ cursor: req.query.cursor});
    }
    authenticator.get(url,credentials.access_token,credentials.access_token_secret,
    function(error,data){
        if(error){
            //another example of a chain
            return res.status(400).send(error);
        }
        res.send(data);//debug
    });

});


//new route for waterfall method
app.get('/allfriends', function(req,res){
    var credentials = authenticator.getCredentials();
    //constructing async waterfall
    async.waterfall([
        //get our friends ID'S
        function(callback){
            //preseting to 1
            var cursor = -1;
            var ids=[];
            console.log("ids.length: " + ids.length);
            //parm1 = when to stop, parm2 = what task it does in each loop
            async.whilst(function(){//always returns bollean response
                return cursor !=0;//return true
            }, 
            function(callback){
                var url = "https://api.twitter.com/1.1/friends/ids.json";
                url += "?" + queryString.stringify({ 
                    user_id: credentials.twitter_id,
                    cursor: cursor});
                //requesting another page
                authenticator.get(url,credentials.access_token,credentials.access_token_secret,
                    function(error,data){
                        if(error){
                            return res.status(400).send(error);
                        }
                        //converts to usable json
                        data = JSON.parse(data);
                        //changes the cursor to the next one
                        cursor = data.next_cursor_str;
                        //array concat function
                        ids = ids.concat(data, ids);
                        //calling the callback
                        callback();
                });
            });
        },//start of task 2
        //look up friends data
        function(ids,callback){

        }
    ]);
    res.sendStatus(200);//debug
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

