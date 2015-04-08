# sup

##Full API Docs and sandbox: [apiary](http://docs.macsup.apiary.io/#)
http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api

Routes:
- POST [`/users`](#newuser)
- GET  [`/users/:id`](#userid)
- GET [`/users/:id/friends`](#userfriend)
- POST [`/users/:id/friends`](#newuserfriend)
- POST [`/status`](#newstatus)
- GET [`/status/:user`](#userstatus)
- GET [`/status/vis/:user`](#statusVuser)


Models?
Users {}
Statuses {} 

#### Users:
- <a name="newuser">**`/users`**</a>
	- **POST**
	- **Description:** adds new user to database
	- **Content-Type**: application/json
	- **Object:**
    ```
        {
          id: int
          name: string
          email: string
        }
    ```
    
- <a name="userid">**`/users/:id`**</a>
  - **GET**
  - **Description:** get single user object
  - **Params:** id = *int*
  - **Content-Type**: application/json
  - **Response:** 
  ```
      {
        id: int
        name: string
        email: string
      }
  ```

- <a name="userfriend">**`/users/:id/friends`**</a>
  - **GET**
  - **Description:** gets all friends of single user
  - **Params** id = *int*
  - **Content-Type**: application/json
  - **Response:**
  ```
      [
        {
          id: int
          name: string
        }
      ]
  ```

    
    
- <a name="newuserfriend">**`/users/:id/friends`**</a>
  - **POST**
  - **Description:** adds new friend of user friends
  - **Params** id = *int*
  - **Content-Type**: application/json
  - **Object:**
  ```
      {
        id: int
        name: string
      }
  ```

#### Statuses:
- <a name="newstatus">**`/status`**</a>
	- **POST**
	- **Description:** create new status
	- **Content-Type**: application/json
	- **Object:**
    ```
        {
          id: int
          owner_id: int
          location: {
              lat: float
              long: float
              }
          time: timestamp
          duration: int
          message: string
        }
    ```
    
    
- <a name="userstatus">**`/status/:id`**</a>
  - **GET**
  - **Description:** get status CREATED by user (if one exists)
	- **Params** id = *int*
	- **Content-Type**: application/json
	- **Response Object:** 
    ```
        {
          id: int
          owner_id: int
          location: {
              lat: float
              long: float
              }
          time: timestamp
          duration: int
          message: string
        }
    ```
  
- <a name="statusVuser">**`/status/vis/:user`**</a>
  - **GET**
  - **Description:** get statuses VISIBLE by user
  - **Params** user = *int*
  - **Response Object:** 
  ```
      [
        {
          id: int
          owner_id: int
          location: {
              lat: float
              long: float
              }
          time: timestamp
          duration: int
          message: string
        }
      ]
  ```
  
	
Get all users, friends, and statuses routes for dev:
`/users/all`
`/status/all`
`/friends/all`

---

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
	
### database schema:
![database schema diagram](docs/sup-db-schema-diagram.png)
	

### to-do for midterm presentation:

* ~~make visual represetnation of the schema (Will)~~
* ~~clean up API code/documentation (change fake GET requests to POSTs, etc) (Will and Scott)~~ - before spring break
* wireframes (Tom) - by 3/25
* display server response to GET and POST requests within iOS app (Sam) - by 3/25
	* get client to post new users
	* get client to post new status
	* show user added to table
* display SUP status locations on client (integrating with gmaps) (Scott)
* Merge client repo into existing sup project (Sam)
* make a slideshow to wrap all of our progress together (everybody - 3/26)
	* potential structure: wireframes, database schema, demo


