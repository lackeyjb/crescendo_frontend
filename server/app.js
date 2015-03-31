var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var proxy = require('json-proxy');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var bourbon = require('node-bourbon');

var app = express();

app.use(proxy.initialize({
  proxy: {
    'forward': {
      '/api': 'https://crescendo-api.herokuapp.com'
    }
  }
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/**
 * Development Settings
 */

 if (app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '../client')));
  app.use(express.static(path.join(__dirname, '../client/.tmp')));
  app.use(express.static(path.join(__dirname, '../client/app')));
  
  // Error handling
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
 }

 /**
 * Production Settings
 */

 if (app.get('env') === 'production') {
  app.use(express.static(path.join(__dirname, '/dist')));
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
 }


module.exports = app;
