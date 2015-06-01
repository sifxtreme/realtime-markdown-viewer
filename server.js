var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('pad', {padName: ""});
});
app.get('/(:id)', function(req, res) {
  res.render('pad', {padName: req.params.id});
});

// get sharejs dependencies
var redis = require('redis');
var sharejs = require('share');

var options = {
  db: {type: 'redis'},
  auth: function(client, action) {
    // This auth handler rejects any ops bound for docs starting with 'readonly'.
    if (action.name === 'submit op' && action.docName === "") {
      action.reject();
    } else {
      action.accept();
    }
  }
};

sharejs.server.attach(app, options);

var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});