#!/bin/node

var pg = require('pg')
var User = require("./models/User.js");
var Status = require("./models/Status.js");
var user = process.env.USER;
var pw = process.env.PW;
var conString = require('./db');

//  for testing/development only:
var utils = require('./test/utils');


var TableStrings = [ 
  
  "CREATE TABLE IF NOT EXISTS users ( \
    user_id serial PRIMARY KEY NOT NULL,\
    first_name varchar(80) NOT NULL,\
    last_name varchar(80) NOT NULL, \
    phone varchar(15) NOT NULL UNIQUE, \
    created timestamp DEFAULT current_timestamp)",

  "CREATE TABLE IF NOT EXISTS status ( \
    status_id serial NOT NULL UNIQUE, \
    owner_id int NOT NULL REFERENCES users (user_id),\
    longitude float NOT NULL,\
    latitude float NOT NULL,\
    duration int NOT NULL, \
    expires timestamp NOT NULL, \
    created timestamp DEFAULT current_timestamp)",

  "CREATE TABLE IF NOT EXISTS statusView(\
    user_id int NOT NULL REFERENCES users (user_id),\
    status_id int NOT NULL REFERENCES status (status_id))",
  
  "CREATE TABLE IF NOT EXISTS friends(\
    user_id int NOT NULL REFERENCES users (user_id),\
    friend_id int NOT NULL REFERENCES users (user_id))",

  "CREATE TABLE IF NOT EXISTS requests(\
    user_id int NOT NULL REFERENCES users (user_id),\
    requested_id int NOT NULL REFERENCES users (user_id),\
    created timestamp DEFAULT current_timestamp)"
]

pg.connect(conString, function(err, client, done){
  if (err) throw err;

  //Add each table query to database
  console.log("Setting up tables...")
  TableStrings.map( function(string) {
    client.query(string, function(err) {
      if (err) throw err
      done();
    });
  })


  pg.end();
  console.log("done.\n");

})
  

