var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser'); 

var fs =  require('fs');
var marked = require('marked');


var users = require('./routes/users');
var status = require('./routes/status');
var friends = require('./routes/friends');
var requests = require('./routes/requests');
var status_view = require('./routes/status_view');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//--------- API Routes ---------

app.use('/users', users);
app.use('/status', status);
app.use('/friends', friends);
app.use('/requests', requests);
app.use('/sv', status_view);

app.get('/', function(req, res){

  var mdPath = './README.md';
  var mdFile = fs.readFileSync('./README.md', 'utf8');
  res.send(marked(mdFile));
});


//--------- Error Handling for express ---------

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
