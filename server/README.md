
![Sup](http://www.rivr.com/lib/image/thumbs/Hey_Dude_338_999.jpg)

---
##API
each route can be viewed from localhost:3000

**Users:**
  
  * `/users` : gets all users
  * `/users/new` : adds new user (currently adds fake data from faker js.)
  * `/users/id` : insert actual user id to see data for single user

**Statuses:**
	
  * `/status` : get all statuses
  * `/status/new` : get all statuses
  * In development... `/status/id` : insert user id to see statuses visible to that user

---

##Installing Postgres
[THIS](https://www.codefellows.org/blog/three-battle-tested-ways-to-install-postgresql) Is a good installation tutorial

!! Skip the step that creates the Launch Agent, and instead use these commands:

**Start:** `postgres -D /usr/local/var/postgres`

**Stop:** `Ctrl + C`

##Running the server:

* Start postgres: `postgres -D /usr/local/var/postgres` and leave running in one terminal window
* Make the database if it doesn't exist (in a separate terminal window): `createdb SUP`
* Set up data tables in db: `node setTables.js` (only needs to be run once when you create new database)
* Run the node server: <!-- `node app.js` --> 
	* `USER='yourusername' PW='yourpw' node app.js` (make sure you're inside the `server` subdirectory)

##Working with postgres:


To check if database is running : `ps aux | grep postgres`

To make and delete database (also works to clear database and start new)

* `dropdb SUP`
* `createdb SUP`

<!-- Or -->

<!-- **Start:** `postgres -D /usr/local/var/postgres &` -->

<!-- **Stop:** `` kill -INT `)head -1 /usr/local/var/postgres/postmaster.pid` `` -->

Check out
[Postgres Guide](http://postgresguide.com/index.html)

###Notes:

SQL style:

* __Create Table__ CREATE TABLE IF NOT EXISTS *name_of_table*(*keyA valueA, *keyB value B*)
* __Add to Table__ CREATE TABLE IF NOT EXISTS *name_of_table*(*keyA valueA, *keyB value B*)
* __Select from table__ "SELECT *keyA*, *keyB* FROM *name_of_table*"



  
##Notes on DB schema:

* user to post relationship represented by a third table that maps a user to the post they create. 
	* questions for next time: should this third table operate like a stack, or should we find each relationship and update?
* how to represent post visiblity to friends? in a separate table prob

