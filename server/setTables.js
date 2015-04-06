#!/bin/node

var pg = require('pg')
var user = process.env.USER
var pw = process.env.PW
var conString = "postgres://" + user + ":" + pw + "@localhost/SUP";

pg.connect(conString, function(err, client, done){

  if (err) throw err;

  var user = "CREATE TABLE IF NOT EXISTS users ( \
                user_id int PRIMARY KEY,\
                name varchar(80),\
                email varchar(30))";
  var status = "CREATE TABLE IF NOT EXISTS status ( \
                status_id int, \
                owner_id int,\
                longitude float,\
                latitude float,\
                time int)";
  var statusView = "CREATE TABLE IF NOT EXISTS statusView(\
                user_id int,\
                status_id int)";

  var friends = "CREATE TABLE IF NOT EXISTS friends(\
                  user_id int,\
                  friend_id int)";
  
  client.query(user, function(err, result){
    if (err) throw err
    done();
  });

  client.query(status, function(err, result){
    if (err) throw err
    done();
  });

  client.query(statusView, function(err, result){
    if (err) throw err
    done();
  });

  client.query(friends, function(err, result){
    if (err) throw err
    done();
  });

  pg.end();
});