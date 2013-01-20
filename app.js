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

//get from twitter site
var TWITTER_CONSUMER_KEY = 'MhcjfCkfAnJ6ta6AxAbgQ';
var TWITTER_CONSUMER_SECRET = 'SGPua9Y1P2OkeKlOzhLJQJ5VvVdyURF6h3vdiIuXU';
var TWITTER_ACCESS_TOKEN = '22149922-oCcPqq4wEjEB4Qj5eNx5wfKIvIoOaYYevpNx08wci';
var TWITTER_ACCESS_SECRET = 'a48mTfNVCftHBV7TybNY1JpUxTNhevOMisPFdSWBkiw';


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
    console.log('tweeted: '+message);
    tumblr.post('/post', {type: 'text', title: '', body: message, tweet:message, slug:'none'}, function(json){
      //successful tumblr post
      console.log('posted to tumblr: '+message);
      res.status = 201;
      res.redirect('http://canttweetthis.tumblr.com');
    });
  });

});

