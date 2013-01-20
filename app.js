var express = require("express"),
  app = express(),
  passport = require('passport'),
  Tumblr = require('tumblrwks'),
  Twit = require('twit');
  //TumblrStrategy = require('passport-tumblr').Strategy;


//twitter data
//use  get_token.js app to find access token and access secret
var TUMBLR_CONSUMER_KEY = 'fjKpCsip0uxZNLPpdbc9qXxl6AQTAaZalD56PdoInaHRcFggTY';
var TUMBLR_CONSUMER_SECRET = 'RgTSXMYajWb1r7IXerabCodnPY4LeX62KBDPdGcwnu0AscXCLr';
var TUMBLR_ACCESS_TOKEN = '2j2q3nQNoO6EA9fwgzDMKDDa6YwONwJIKsOS9QfPxiKvhDGmcs';
var TUMBLR_ACCESS_SECRET = 'uqcKQwfLEVCSbENpe0JGOKulEOMxjZRPT1zH4u3ePizITN0748';

//get from https://dev.twitter.com/apps/
var TWITTER_CONSUMER_KEY = 'xx1DZF6oOb8EhSqebXAbA';
var TWITTER_CONSUMER_SECRET = 'ZoqeJIqnGKEz7m6Yi0L7eCRuQBMzUGB9dg52s';
var TWITTER_ACCESS_TOKEN = '260570157-gnOjfWh8ZoxRbHzkcXeOlKy6qgFilgeg72cBKUPa';
var TWITTER_ACCESS_SECRET = '3spmp7W58bnj5gLzayF4Bh5QXOjTzKKPqb9Sd8OUFE';


var tumblr = new Tumblr({
    consumerKey: TUMBLR_CONSUMER_KEY,
    consumerSecret: TUMBLR_CONSUMER_SECRET,
    accessToken: TUMBLR_ACCESS_TOKEN,
    accessSecret: TUMBLR_ACCESS_SECRET
  }, "canttweetthis.tumblr.com"
);

var twit = new Twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret:      TWITTER_CONSUMER_SECRET,
  access_token:         TWITTER_ACCESS_TOKEN,
  access_token_secret:  TWITTER_ACCESS_SECRET
});

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//start server
var port = process.env.PORT || 3001;
app.listen(port);
console.log('Cant Tweet This server started on port '+port);


//add a post
app.post('*', function(req, res){
  var message = req.body.message;
  twit.post('statuses/update', { status: message}, function(err, reply) {
    //successful tweet
    if(err) {
      res.status = 501;
      res.send(err);
    }
    console.log('tweeted: '+message);
    tumblr.post('/post', {type: 'text', title: 'Anonymous', body: message, tweet:message, slug:'none'}, function(json){
      //successful tumblr post
      console.log('posted to tumblr: '+message);
      res.status = 201;
      res.redirect('http://canttweetthis.tumblr.com');
    });
  });

});

