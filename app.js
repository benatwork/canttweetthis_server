var express = require("express"),
  app = express(),
  passport = require('passport'),
  Twit = require('twit');
  //TumblrStrategy = require('passport-tumblr').Strategy;


var allowCrossDomain = function(req, res, next) {

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    //res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    res.header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type");
     // intercept OPTIONS method

    if ('OPTIONS' == req.method) {
      res.send(200);
    } else{
      next();
    }
};


//get from https://dev.twitter.com/apps/
// var TWITTER_CONSUMER_KEY = 'xx1DZF6oOb8EhSqebXAbA';
// var TWITTER_CONSUMER_SECRET = 'ZoqeJIqnGKEz7m6Yi0L7eCRuQBMzUGB9dg52s';
// var TWITTER_ACCESS_TOKEN = '260570157-gnOjfWh8ZoxRbHzkcXeOlKy6qgFilgeg72cBKUPa';
// var TWITTER_ACCESS_SECRET = '3spmp7W58bnj5gLzayF4Bh5QXOjTzKKPqb9Sd8OUFE';

var TWITTER_CONSUMER_KEY = 'SZbwUoDSRaEWlBMXOxFlw';
var TWITTER_CONSUMER_SECRET = 'Fa02nREYLhpuu2cA3T6VXrX3tf7M8Pgg3XExgAW5L4s';
var TWITTER_ACCESS_TOKEN = '1134483806-ZoVCSTyrmjNENH8rzSTYw1B2J2SfUtwFlbw1NOP';
var TWITTER_ACCESS_SECRET = 'CyOYlGd1jNRwEQ40nwbq90u3dyVDe5Gzbx0rwywpZw';



var twit = new Twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret:      TWITTER_CONSUMER_SECRET,
  access_token:         TWITTER_ACCESS_TOKEN,
  access_token_secret:  TWITTER_ACCESS_SECRET
});

app.configure(function(){
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//start server
var port = process.env.PORT || 3001;
app.listen(port);
console.log('Cant Tweet This server started on port '+port);


//post route
app.post('*', function(req, res){
  var message = req.body.message;
  var ip = req.connection.remoteAddress;

  console.log('incoming',message);
  if(message.match('@')){
    console.log('found a @');
    res.status = 403;
    res.send('error',{error:'found a @'});
    return;
  }
  
  twit.post('statuses/update', { status: message}, function(err, reply) {
    if(err) {
      console.log(err.statusCode);
      res.status = err.statusCode;
      res.send('error', { error: err });
      console.log('twitter error:'+message);
      return;
    }
    console.log('Server:'+req.connection.remoteAddress+' Tweeted:'+message);
    res.status = 200;
    res.end();
    //res.send('success',{success:message});
  });
});




//gets
app.get('/followers',function(req,res){
  twit.get('followers/ids', { screen_name: 'canttweetthis_' },  function (err, reply) {
      res.send(reply);
  });
});

app.get('/tweets',function(req,res){
  twit.get('statuses/user_timeline', { screen_name: 'canttweetthis_', trim_user:true,count:200 },  function (err, reply) {
    if(err) console.log(err);
    var messages = [];
    for (var i = 0; i < reply.length; i++) {
      messages.push(reply[i].text);
    }
    res.send(messages);
  });
});

