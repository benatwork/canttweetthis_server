var express = require("express"),
  app = express(),
  passport = require('passport'),
  Tumblr = require('tumblrwks')
  //TumblrStrategy = require('passport-tumblr').Strategy;


//twitter data
//use  get_token.js app to find access token and access secret
var CONSUMER_KEY = 'fjKpCsip0uxZNLPpdbc9qXxl6AQTAaZalD56PdoInaHRcFggTY';
var CONSUMER_SECRET = 'RgTSXMYajWb1r7IXerabCodnPY4LeX62KBDPdGcwnu0AscXCLr';
var ACCESS_TOKEN = '2j2q3nQNoO6EA9fwgzDMKDDa6YwONwJIKsOS9QfPxiKvhDGmcs';
var ACCESS_SECRET = 'uqcKQwfLEVCSbENpe0JGOKulEOMxjZRPT1zH4u3ePizITN0748';


var tumblr = new Tumblr(
  {
    consumerKey: CONSUMER_KEY,
    consumerSecret: CONSUMER_SECRET,
    accessToken: ACCESS_TOKEN,
    accessSecret: ACCESS_SECRET
  }, "canttweetthis.tumblr.com"
);



app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//start server
app.listen(3001);
console.log('Cant Tweet This server started on port 3001');


//add a post
app.post('*', function(req, res){
  var message = req.body.message;
  tumblr.post('/post', {type: 'text', title: 'Anonymous', body: '<h3>'+message+'</h3>', tweet:'hello world'}, function(json){
    //console.log(json);
    console.log(message);
    res.status = 201;
    res.end();
  });
});

