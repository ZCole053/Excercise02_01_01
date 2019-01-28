//Author: Zedekiah Cole

//Summary:This module will hold all functionality
//for oauth athentication 

//file name: Index.js
//Date made: January 15 2019
//LTE: January 25 2019


//if capital tells other it holds an object
//grabing a specific method from the module oauth
var OAuth = require('oauth').OAuth;
var config = require('./config.json');

//creating a variable to passthe OAuth constructer all of the information
var oauth = new OAuth(
    config.request_token_url,
    config.access_token_url,
    config.consumer_key,
    config.consumer_secret,
    config.oauth_version,
    config.oauth_callback,
    config.oauth_signature
);

//holds the tokens we get back from twitter
var twitterCredentials = {
    oauth_token: "",
    oauth_token_secret: "",
}

//exporting to the module that requires it
//module.exports specifies where it is getting it from
module.exports = {
    redirectToTwitterLoginPage: function(req,res){
        oauth.getOAuthRequestToken(function(error, oauth_token,oauth_token_secret, results){
            if(error){
                console.log(error);
                res.send("Authenticatian failed!");
            }else{
                twitterCredentials.oauth_token = oauth_token;
                twitterCredentials.oauth_token_secret = oauth_token_secret;
                //res.send("Credentials stored!");
                //redirectiong to another place when we get the tokens
                res.redirect(config.authorize_url + '?oauth_token=' + oauth_token);//rerouting to another config file
            }
        });
    }
}