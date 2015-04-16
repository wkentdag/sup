# sup api

This is the API server for SUP. Client repo [here](https://github.com/sbwf/sup-client)

Full API Docs and sandbox: [apiary](http://docs.macsup.apiary.io/#)

##Setup

After installing  `node`, `postgres`, and cloning the repo:


Initialize the database:

```
$ postgres -D /usr/local/var/postgres
$ createdb SUP

```

Start the app:

```
$ cd path/to/sup
$ npm install
$ node setTables.js   # only needs to be run once on setup
$ npm start

```

Point your browser to `localhost:3000` and start exploring the routes!

To check if the database is running: `ps aux | grep postgres`

To make and delete database (also works to clear the db and start fresh): `dropdb SUP`, `createdb SUP`


##Routes

*	[`/users`](#users)
	*	[GET](#users-get), [POST](#users-post)
*	[`/users/:id`](#usersid)
	*	[GET]('#usersid-get')	
*	[`/users/:id/friends`](#usersidfriend)
	*	[GET](#usersidfriend-get), [POST](#usersidfriend-get), [DELETE](#usersidfriend-del)
*	[`/users/:id/status`](#useridstatus)
	*	[GET](#useridstatus-get)
*	[`/users/:id/status/last`](#useridstatuslast)
	*	[GET](#useridstatuslast-get)
*	[`/users/:id/visible`](#useridvisible)
	*	[GET](#useridvisible-get)
*	[`/status`](#status)
	*	[GET](#status-get), [POST](#status-post)
*	[`/status:id`](#statusid)
	*	[GET](#statusid-get)
*	[`/status:id/viewers`](#statusidviewers)
	*	[GET](#statusidviewers-get), [POST](#statusidviewers-post)
*	[`/friends`](#friends)			
	*	[GET](#friends-get)
*	[`/friends/:id`](#friendsid)
	*	[GET](#friendsid-get)
*	[`/sv`](#sv)			
	*	[GET](#sv-get)
*	[`/sv/:id`](#svid)
	*	[GET](#svid-get)		



### <a name="users">Users</a>:

- <a name="users-get">**`/users`**</a>
	- **Method:** GET
	- **Description:** returns all users from the database
	- **Content-Type**: application/json
	- **Request params:** *none*
	- **Request body:** *none*
	- **Response:**
		-	**status code**: `200`
		-	**data sample**:
	    ```
		   	users: [
		    	{
		          user_id: int
		          name: string
		          email: string
		        }, 
		        ...
		   	]   
    ```  
- <a name="users-post">**`/users`**</a>
	- **Method:** POST
	- **Description:** adds new user to database
	- **Content-Type**: application/json
	- **Request params:** *none*
	- **Request body:**: **NOTE**: see [issue #6](https://github.com/wkentdag/sup/issues/6) - during development, the request takes no data and generates the user randomly
	```
        user: {
          user_id: int
          name: string
          email: string
        }
    ```  
    - **Response**: 
    	-	Success:
	    	-	**status code**: `201`
	    	-	**data sample**: `{"message":"added 1 new user"}`
    
 
- <a name="usersid-get">**`/users/:id`**</a>
    - **Method**: GET
    - **Description:** gets a single user object
    - **Request Params:** `id`: integer, a user's ID
    - **Request body**: *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		      {
		        user_id: int
		        name: string
		        email: string
		      }
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doesn't exist

		
- <a name="usersidfriends-get">**`/users/:id/friends`**</a>
    - **Method**: GET
    - **Description:** gets a user's friends
    - **Request Params:** `id`: integer, a user's ID
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		      friends: [
		        12345, 678, 910
		      ]
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doesn't exist
		
- <a name="usersidfriends-post">**`/users/:id/friends`**</a>
    - **Method**: POST
    - **Description:** add a new friend
    - **Params:** `id`: integer, a user's ID
    - **Request body:** `friend_id`: integer, a user's ID number
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		      friends: [
		        12345, 678, 910
		      ]
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doesn't exist
		
- <a name="usersidfriends-del">**`/users/:id/friends`**</a>
    - **Method**: DELETE
    - **Description:** delete a friend
    - **Params:** `id`: integer, a user's ID
    - **Request body:** `friend_id`: *integer*, a user's ID number
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		      {message: "friend relationship deleted"}
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doesn't exist

- <a name="useridstatus-get">**`/users/:id/status`**</a>
    - **Method**: GET
    - **Description:** Get a list of all statuses posted by the user
    - **Params:** `id`: integer, a user's ID
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		  {
			statuses: [
				{
					status_id: int,
					owner_id: int,
					longitude: float,
					latitude: float,
					time: int
				}, ...
			]
		  }
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doesn't exist, or they have no statuses

- <a name="useridstatuslast-get">**`/users/:id/status/last`**</a>
    - **Method**: GET
    - **Description:** Get the last status posted by a user
    	- **NOTE**: see [issue #8](https://github.com/wkentdag/sup/issues/8): during development, this returns the most recent status; in production, it should only return a status if it is currently active
    - **Params:** `id`: integer, a user's ID
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		last_status: {
			status_id: int,
			owner_id: int,
			longitude: float,
			latitude: float,
			time: int
		}
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doesn't exist, or they have no statuses

- <a name="useridvisible-get">**`/users/:id/visible`**</a>
    - **Method**: GET
    - **Description:** Get an array of statuses visible to the user
    	- **NOTE**: see [issue #8](https://github.com/wkentdag/sup/issues/8): during development, this returns ALL statuses that have ever been visible to the user, not just currently active statuses 
    - **Params:** `id`: integer, a user's ID
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		statuses: [
			9569,
			0001,
			1023
		]
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doesn't exist, or they have no visible statuses

### <a name="status">Status</a>:

		
- <a name="status-get">**`/status`**</a>
    - **Method**: GET
    - **Description:** Get an array of all statuses in the table
    - **Params:** *none*
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		statuses: [
			{
				status_id: int,
				owner_id: int,
				longitude: float,
				latitude: float,
				time: int
			}, ...
		]
		  ```
		  
- <a name="status-post">**`/status`**</a>
    - **Method**: POST
    - **Description:** Post a new status to the table
    - **Params:** *none*
    - **Request body:** `status: {status_id: int, owner_id: int, longitude: float, latitude: float, time: int}`
    	- **NOTE**: see [issue #6](https://github.com/wkentdag/sup/issues/6) - during development, most of the status fields are generated randomly, and the req.body is actually just a valid user ID called `owner_id`
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `201`
  		-	**data sample:** 	`{"message":"added 1 new status"}`
  		
- <a name="statusid-get">**`/status/:id`**</a>
    - **Method**: GET
    - **Description:** Get one status from the table
    - **Params:** `id`: *integer*, a status ID number
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		status: 
			{
				status_id: int,
				owner_id: int,
				longitude: float,
				latitude: float,
				time: int
			}
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: status doesn't exist
		
- <a name="statusidviewers-get">**`/status/:id/viewers`**</a>
    - **Method**: GET
    - **Description:** Get an array of users who have permission to view a status
    - **Params:** `id`: *integer*, a status ID number
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		  [111, 222, 333]
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: status doesn't exist, or it has no viewers
		
- <a name="statusidviewers-post">**`/status/:id/viewers`**</a>
    - **Method**: POST
    - **Description:** Add permission for a user to view a given status
    - **Params:** `id`: *integer*, a status ID number
    - **Request body:** `user_id`: *integer*, ID number of the user to be granted permission
    - **Content-Type**: application/json
    - **Response:**
  	-	Success:
  		-	**status code**: `201`
  		-	**data sample:** 	
		  ```
		  {"result":"Added 1 user to status 9569's visibility permissions"}
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: status doesn't exist
		
### <a name="friends">Friends</a>:
		

- <a name="friends-get">**`/friends`**</a>
    - **Method**: GET
    - **Description:** Get an array of all friend relationships in the table
    - **Params:** `id`: *none*
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		friendships: [
			{
				user_id: 3546,
				friend_id: 1456
			},
		]
		  ```
- <a name="friendsid-get">**`/friends/:id`**</a>
    - **Method**: GET
    - **Description:** Get one friend relationship from the table
    - **Params:** `id`: *integer*, a user ID number
    - **Request body:** `friend_id`: *integer*, a friends ID number
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		rel: 
			{
				user_id: 3546,
				friend_id: 1456
			},
		  ```
	-	Error:
		-	**status code**: `404`
		-	**message**: users aren't friends

### <a name="sv">Status View (sv)</a>:


- <a name="sv-get">**`/sv`**</a>
    - **Method**: GET
    - **Description:** Get an array of all status permissions in the table
    - **Params:** *none*
    - **Request body:** *none*
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		permissions: [
			{
				user_id: 3546,
				status_id: 1456
			},
		]
		  ```

- <a name="svid-get">**`/sv/:id`**</a>
    - **Method**: GET
    - **Description:** Check to see if a user can view a status
    - **Params:** `id`: *integer*, a status's ID
    - **Request body:** `user_id`: *integer*, a user's ID number
    - **Content-Type**: application/json
    - **Response:** 
  	-	Success:
  		-	**status code**: `200`
  		-	**data sample:** 	
		  ```
		{"rel":{"user_id":3546,"status_id":9569}}
		```
	-	Error:
		-	**status code**: `404`
		-	**message**: user doens't have permission to view the staatus


### database schema:
![database schema diagram](docs/sup-db-schema-diagram.png)


