var debug = require('debug')('better');
var logger = require('morgan');
var express = require('express')
var PORT = process.env.PORT || 3000;
var app = express();

var users = require('./routes/users');
var status = require('./routes/status');

app.use(logger('dev'));

//--------- API Routes ---------

app.use('/users', users);
app.use('/status', status);

app.get('/', function(req, res){
  res.send('Hi from sup')
})


//--------- Error Handling for express ---------

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers:

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        .json('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json(404, {error: err.message});
});


// Start webserver on PORT
app.listen(PORT)
console.log('App running on port', PORT)