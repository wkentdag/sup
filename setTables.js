#!/bin/node

var pg = require('pg')
var User = require("./models/User.js");
var Status = require("./models/Status.js");
var user = process.env.USER
var pw = process.env.PW
var conString = "postgres://" + user + ":" + pw + "@localhost/SUP";


var TableStrings = [ 
  
  "CREATE TABLE IF NOT EXISTS users ( \
    user_id int PRIMARY KEY,\
    name varchar(80),\
    email varchar(30))",

  "CREATE TABLE IF NOT EXISTS status ( \
    status_id int, \
    owner_id int,\
    longitude float,\
    latitude float,\
    time int)",

  "CREATE TABLE IF NOT EXISTS statusView(\
    user_id int,\
    status_id int)",
  
  "CREATE TABLE IF NOT EXISTS friends(\
    user_id int,\
    friend_id int)"
]

var fakeUsers = [
  { "name": "Mike", "id": 1111, "email": "m@ike.com" },
  { "name": "erin", "id": 2222, "email": "e@rin.com" },
  { "name": "kate", "id": 3333, "email": "k@ate.com" }
]

var fakeStatuses = [
  { "id": 1234, "owner": 1111, "longitude": 41.11, "latitude": 34.50, "time":30 },
  { "id": 4321, "owner": 2222, "longitude": 33.33, "latitude": 20.18, "time":15 },
]

//TODO: Add friends and status view

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

  //Populate tables in db
  console.log("Populating database...");

  fakeUsers.map(function(obj){
    User.addUser(client, obj, function(err){
      if (err) throw err
    });
  })

  fakeStatuses.map(function(obj){
    Status.addStatus(client, obj, function(err){
      if (err) throw err
    });
  })


  pg.end();
  console.log("done.\n");

})
  

