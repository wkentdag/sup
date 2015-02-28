var express = require('express')
var pg = require('pg')
var conString = "postgres://scotthurlow:1234@localhost/scotthurlow";

pg.connect(conString, function(err, client, done){
  if (err) return console.error('error connecting to postgres', err)
  console.log(client)
})