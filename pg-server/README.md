
![Alt text](http://www.rivr.com/lib/image/thumbs/Hey_Dude_338_999.jpg)

#Testing Postgres database
##with basic server app

[THIS](https://www.codefellows.org/blog/three-battle-tested-ways-to-install-postgresql) Seems like a good detailed installation tutorial

###API
  * `getAllUsers`
  * `newUser` : currently adds fake data form faker js.

###Notes on using postgres:
To make and delete database
* `dropdb name_of_db`
* `createdb name_of_db`

* SQL style:
* __Create Table__ CREATE TABLE IF NOT EXISTS *name_of_table*(*keyA valueA, *keyB value B*)
* __Add to Table__ CREATE TABLE IF NOT EXISTS *name_of_table*(*keyA valueA, *keyB value B*)
* __Select from table__ "SELECT *keyA*, *keyB* FROM *name_of_table*"