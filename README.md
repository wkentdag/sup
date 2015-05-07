# sup-server

> API server for [sup](https://github.com/sbwf/sup-client).

The server is live at [sup.wkd.pw](http://sup.wkd.pw). 
To run your own instance, see [dev setup](#dev-setup).

##API Routes

*	[`/users`](#users)
  *	[`/users/:id`](#usersid)
    *	[`/users/:id/friends`](#usersidfriends)
    *	[`/users/:id/status`](#useridstatus)
        *	[`/users/:id/status/last`](#useridstatuslast)
    *	[`/users/:id/visible`](#useridvisible)
*	[`/status`](#status)
    *	[`/status:id`](#statusid)
        *	[`/status:id/viewers`](#statusidviewers)
*	[`/friends`](#friends)			
    *	[`/friends/:id`](#friendsid)
* [`/requests`](#requests)
    * [`/requests/:requested_id`](#requestsid)
*	[`/sv`](#sv)			
    *	[`/sv/:id`](#svid)



### Users:

- <a name="users">**`/users`**</a>
    - **Method:** `GET`
    	- **Description:** returns all users from the database
    	- **Content-Type**: application/json
    	- **Request params:** *none*
    	- **Request body:** *none*
      - **Request queries:** `phone`: a user's phone number [optional]
    	- **Response:**
        - **Success*:
      		-	**status code**: `200`
      		-	**data sample**:
      	    ```
      		   	users: [
      		    	{
      		          user_id: int,
      		          first_name: string,
      		          last_name: string,
                    phone: string,
                    created: timestamp
      		        }, 
      		        ...
      		   	]   
          ```  
        - **Error**: [if no queries used, only error is 500. These error responses are for phone queries]
          - **status code**: `404`
          - **date sample**: `{error: "user with phone number 68691102doesn't exist."}`

    - **Method:** `POST`
    	- **Description:** adds new user to database
    	- **Content-Type**: application/json
    	- **Request params:** *none*
    	- **Request body:**: **NOTE**: see [issue #6](https://github.com/wkentdag/sup/issues/6) - during development, the request takes no data and generates the user randomly
    	```
          first_name: string,
          last_name: string,
          phone: string,
        ```  
        - **Response**: 
        	-	Success:
    	    	-	**status code**: `201`
    	    	-	**data sample**: `{"message":"added new user with id: <id>", "new_id": <id>}`
    
 

- <a name="usersid">**`/users/:id`**</a>
    - **Method**: `GET`
      - **Description:** gets a single user object
      - **Request Params:** `id`: integer, a user's ID
      - **Request body**: *none*
      - **Content-Type**: application/json
      - **Response:** 
    	-	Success:
    		-	**status code**: `200`
    		-	**data sample:** 	
  		  ```
  		      user: {
              user_id: int,
              first_name: string,
              last_name: string,
              phone: string,
              created: timestamp
            }
  		  ```
  	-	Error:
  		-	**status code**: `404`
  		-	**message**: user doesn't exist

		
- <a name="usersidfriends">**`/users/:id/friends`**</a>
    - **Method**: `GET`
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
    		        {id: 123, first_name: 'Will', ...},
                {...},
                ...
    		      ]
    		  ```
    	-	Error:
    		-	**status code**: `500`
		
    - **Method**: `POST`
        - **Description:** add a new friend
        - **Params:** `id`: integer, a user's ID
        - **Request body:** `friend_id`: integer, a user's ID number
        - **Content-Type**: application/json
        - **Response:** 
      	-	Success:
      		-	**status code**: `200`
      		-	**data sample:** 	
    		  ```
    		      {"result": "User 1 added user 2 to their friends list"}
    		  ```
    	-	Error:
    		-	**status code**: `404`
    		-	**message**: user doesn't exist
        - **status code**: `403`
        - **message**: `{User <id> hasn't requested user <friend_id>}`
		
    - **Method**: `DELETE`
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


- <a name="useridstatus">**`/users/:id/status`**</a>
    - **Method**: `GET`
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
            owner_name: string,
            longitude: float,
            latitude: float,
            duration: int,
            created: timestamp,
            expires: timestamp
  				}, ...
  			]
  		  }
  		  ```
  	-	Error:
  		-	**status code**: `404`
  		-	**message**: user doesn't exist, or they have no statuses

- <a name="useridstatuslast">**`/users/:id/status/last`**</a>
    - **Method**: `GET`
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
    			created: timestamp,
          expires: timestamp
    		}
    		  ```
    	-	Error:
    		-	**status code**: `404`
    		-	**message**: user doesn't exist, or they have no statuses

- <a name="useridvisible">**`/users/:id/visible`**</a>
    - **Method**: `GET`
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

### Status:

		
- <a name="status">**`/status`**</a>
    - **Method**: `GET`
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
            created: timestamp,
            expires: timestamp
    			}, ...
    		]
    		  ```
		  
    - **Method**: `POST`
        - **Description:** Post a new status to the table and add viewers
        - **Params:** *none*
        - **Request body:** `owner_id`: int, `longitude`: float, `latitude`: float, `duration`: int, [all **required**]; `selectedFriends`: `int[]` (array of user ids) [**optional**]; `message` varchar(160) [**optional**]
        	- **NOTE**: see [issue #6](https://github.com/wkentdag/sup/issues/6) - during development, most of the status fields are generated randomly, and the req.body field needs to only contain `fake_owner_id`, a valid `user_id` from the fake users table, and 'selectedFriends' (optional);
        - **Content-Type**: application/json
        - **Response:** 
      	-	Success:
      		-	**status code**: `201`
      		-	**data sample:** 	`{"new_status":"status_id: 1, latitude: ...", "viewers": [1, 2, 3, ...]}`
      		
- <a name="statusid">**`/status/:id`**</a>
    - **Method**: `GET`
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
            created: timestamp,
            expires: timestamp
    			}
    		  ```
    	-	Error:
    		-	**status code**: `404`
    		-	**message**: status doesn't exist
		
- <a name="statusidviewers">**`/status/:id/viewers`**</a>
    - **Method**: `GET`
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
		
    - **Method**: `POST`
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
		
### Friends:
		

- <a name="friends">**`/friends`**</a>
    - **Method**: `GET`
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

- <a name="friendsid">**`/friends/:id`**</a>
    - **Method**: `GET`
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

### Friend requests:

- <a name="requests">**`/requests`**</a>
    - **Method**: `GET`
        - **Description:** Get an array of all pending friend requests
        - **Params:** *none*
        - **Request body:** *none*
        - **Content-Type**: application/json
        - **Response:** 
          - Success:
            - **status code**: `200`
            - **data sample:**  
            ```
          pending_requests: [
            {
              user_id: 3546,
              friend_id: 1456,
              created: /timestamp
            },
          ]
            ```

    - **Method**: `POST`
        - **Description:** Post a new friend request
        - **Params:** *none*
        - **Request body:** `user_id`: ID number of the user issuing the request [required]; `requested_id`: id number of the user being requested [required]
        - **Content-Type**: application/json
        - **Response:** 
          - Success:
            - **status code**: `201`
            - **data sample:**  
            ```
            {"result":"User 4 has requested 3"}
            ```
          - Error:
            - **status code**: `404`
            - **data sample:** `{"error":"user 5 does not exist"}`


- <a name="requestsid">**`/requests/:requested_id`**</a>
    - **Method**: `GET`
        - **Description:** Get all requests for a given user's friendship, with options to sort by requester
        - **Params:** `requsted_id`: id number of the requested user
        - **Request body:** `user_id`: ID number of the user issuing the request [optional];
        - **Content-Type**: application/json
        - **Response:** 
          - Success:
            - **status code**: `200`
            - **data sample:**  
            ```
            {"pending_requests":"[user_id: 4, requested_id: 3, created: /timestamp]"}
            ```
          - Error:
            - **status code**: `404`
            - **data sample:** `{"error":"user < id > has not been requested"}`



### Status View:


- <a name="sv">**`/sv`**</a>
    - **Method**: `GET`
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

- <a name="svid">**`/sv/:id`**</a>
    - **Method**: `GET`
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
        		-	**message**: user doens't have permission to view the status

##<a name="dev-setup">Development Setup</a>

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
$ node setTables.js
        # only needs to be run once on setup
$ PORT=3000 DB=dbproduction USER=usn PW=yourpw NODE_ENV=production npm start
        # or ...
$ PORT=3000 DB=dbtest USER=usn PW=yourpw DEBUG=sup npm start
        # defaults to dev mode; POSTing to /users and /status mostly generates fake data
        # see their specific route docs for more info 

```

Point your browser to `localhost:3000` and start exploring the routes!

To check if the database is running: `ps aux | grep postgres`

To make and delete database (also works to clear the db and start fresh): `dropdb SUP`, `createdb SUP`

