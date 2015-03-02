
![Sup](http://www.rivr.com/lib/image/thumbs/Hey_Dude_338_999.jpg)

##to run the server:

* start postgres: `postgres -D /usr/local/var/postgres` and leave running in one terminal window
* make the database if it doesn't exist(in a separate terminal window): `createdb 'supUsers'
* run the node server, specifying your database username and password as environment runtime variables:
	* `USER='yourusername' PW='yourpw' node app.js` (make sure you're inside the `server` subdirectory)

##learning postgres:

[THIS](https://www.codefellows.org/blog/three-battle-tested-ways-to-install-postgresql) Seems like a good detailed installation tutorial

[Postgres Guide](http://postgresguide.com/index.html)

###Notes:

To start the server:

* `postgres -D /usr/local/var/postgres`
* Ctrl + C to stop

To make and delete database

* `dropdb name_of_db`
* `createdb name_of_db`

SQL style:

* __Create Table__ CREATE TABLE IF NOT EXISTS *name_of_table*(*keyA valueA, *keyB value B*)
* __Add to Table__ CREATE TABLE IF NOT EXISTS *name_of_table*(*keyA valueA, *keyB value B*)
* __Select from table__ "SELECT *keyA*, *keyB* FROM *name_of_table*"


##API
  * `initTable` : run once to setup table schema
  * `getAllUsers`
  * `newUser` : currently adds fake data from faker js.

