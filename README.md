# sup


## to run server:

-  install node and the mongod daemon

```
$ cd sup/server
$ npm install
$ mongod --dbpath data/
$ npm start
```
-  point your browser to the app running at `localhost:3000`

##General App Contents / Features:

-	Info associated with 1 SUP:
	-	Location
	- Name
	- Status?

- Backend Routes:
	- Setup: Send contacts to server
	- Get active users
	- Get single users data
	- Set new location / SUP object

### main views:

-	main window
	-	view map
	-	settings drawer to the right
	-	friendlist drawer to the left
-	first time login
	-	banner
	-	sign in w/phone #
	-	import friends from fb 1-time option
-	view specific user
	-	have more information than just picture, name, recent checkin?
	

### to implement for week of 3/2:
-	current server but in PostgreSQL or another relational database
-	iOS app that can parse JSON from each of the specified routes

