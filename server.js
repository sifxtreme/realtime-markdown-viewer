var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// public folder to store assets
app.use(express.static(__dirname + '/public'));

// routes for app
app.get('/', function(req, res) {
  res.render('pad', {padName: ""});
});
app.get('/(:id)', function(req, res) {
  res.render('pad', {padName: req.params.id});
});

// get sharejs dependencies
var sharejs = require('share');
var redis;
if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var redis = require("redis").createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(":")[1]);
} else {
  redis = require("redis").createClient();
}

// options for sharejs 
var options = {
  client: redis,
  auth: function(client, action) {
    // this auth handler rejects any ops bound for docs starting with '' (home page)
    if (action.name === 'submit op' && action.docName === "") {
      action.reject();
    } else {
      action.accept();
    }
  }
};

// attach the express server to sharejs
sharejs.server.attach(app, options);

// listen on port 8000 (for localhost) or the port defined for heroku
app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});