/* global */
'use strict';

var path = require('path');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var app = express();

console.log('');
console.log('====== SERVER RUNNING IN: ' + process.env.NODE_ENV + ' ======');
console.log('');
console.log('');

// ================ EXPRESS SERVER SETUP ================
// expose public folder as static assets
app.use(express.static(path.join(__dirname, '/public')));

// et compression
app.use(compression());

// parser for requrests
app.use(bodyParser.json());

// ================ EXPRESS ROUTES SETUP ================
app.get('*/resources/:fileName', function(req, res) {
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile('/resources/' + req.params.fileName, options, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

app.get('/', function(req, res) {
  res.sendFile('public/index.html');
});
app.get('/:fileName', function(req, res) {
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile('/resources/' + req.params.fileName, options, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

// ================ SERVER LISTEN SETUP ================
var server = app.listen(80, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
  console.log('');
  console.log('');
});
