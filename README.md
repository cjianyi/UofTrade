# UofTrade Instructions
Link to deployed app: https://uoftrade.herokuapp.com/
## Logging In/Registering
Use one of the below credentials to log in as an admin/user
#### Admin Credentials
email: admin@admin.com\
password: admin
#### User Credentials #1
email: user@user.com\
password: user
#### User Credentials #2
email: user2@user.com\
password: user2

Alternatively, you may click on the register button on the "Login Page" and enter the corresponding information to create a new user for yourself.

##  Universal Features (admin or user) ## 

### Dashboard Page
* After signing in, the user has access to the dashboard where they have access to:
  *  The navigation bar at the top
  *  UofT-related announcements from admins
  *  Their current product listings, if any.
*  Route: "/main"

### My Profile
* The user can update their name, bio and profile picture
  * On success, Green Alert will pop up notifying users
* We do not let the user update their email they registered with
* Route: "/MyProfile"


### Marketplace
* The user can view all product listings from all users, inlcuding their own. 
* The user can filter results by selecting a fixed category at the top.
* Route: "/marketplace"

### Messages
* The user can view their past conversations with other users, and send new ones.
  * Click on a user in left hand side to view the conversation history with the selected user and send new messages
* Conversations are restricted to 2 users only  
* Route: "/messages"

### Create Post
* The user can create a new product listing by specifying their product's title, price, description, image and category.
 * Green Alert appears on success
*  Route: "/PostCreation"

### Product Listing
* A user/admin would get here after clicking "Go to Product Page" on a product featured in the Marketplace.
* If the user owns the product listing, they will additionally be able to edit information about the listing: the name, price, and description.
* All users can report a post once 
* If user does not own product listing, they can contact owner (takes user to messages view).
* In all cases, the product's category tag, image, title, price, description, and product owner information is featured on this page.
* Route: "/ProductListing/{id of product listing}"

### Logout
* This brings the user back to the login page.

##  Admin Special Privleges
* Admin have specific privleges in some views:
 * Dashboard: 
   *  admin can create new announcements
   *  admin can remove announcments
   *  review reported posts and remove them
 * Marketplace: 
   * admin can remove any product listing post

# External Libraries
react-bootstrap\
react-router-dom\
react-uid\
bcryptjs\
cloudinary
# UofTrade Server Routes Documentation

## Conversation Routes

1. Get all conversations user with <:id> is a part of\
**URL:** ```/conversation/:id```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**: ```{"conversations": [List of conversations user with <:id> is a part of]}```

2. Get all users except for user with <:id>\
**URL:** ```/conversation/users/:id```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**: ```{"users": [List of users]}```

3. Send a message in a specific conversation\
**URL:** ```/conversation/:conv_id```\
**Request Method**: ```POST```\
**Body**: 
```
{
  sender: id of user sending message
  receiver: id of user receiving message
  message: content of message
}
```
**Expected Return**:
```
{
 "newMessage": new message that was just sent, 
 "conversation": conversation document with <:conv_id>
}
```

## Item (Product Listing) Roues
1. Get all items (product listings) in the database\
**URL:** ```/items```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**:
```
{
 "items": [all items (product listings) in the database]
}
```
2. Get all items (product listings) for a certain user\
**URL:** ```/items/:userid```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**:
```
{
 "items": [all items (product listings) for a certain user]
}
```
3. Get a specific user's specific item (product listing)\
**URL:** ```/items/:userid/:itemid```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**:
```
{
 "owner": <:userid>
 "item": specific item with <:itemid>
}
```
4. Creating a new product listing with owner <:userid>\
**URL:** ```/items/:userid```\
**Request Method**: ```POST```\
**Body**: 
```
{
 title: title of new product listing,
 price: price of product,
 tag: category of product,
 description: description of product
}
```
Note: req.files.image.path stores the the image for the product listing\
**Expected Return**:
```
{
 "item": Newly created product listing,
 "user": User who created product listing
}
```
5. Deleting a product lising \
**URL:** ```/items/:userid/:itemid```\
**Request Method**: ```DELETE```\
**Body**: not used\
**Expected Return**:
```
{
 "user": User who owned deleted product listing
 "item": Deleted product listing,
}
```
6. Update Item Info\
**URL:** ```/items/:userid/:itemid```\
**Request Method**: ```POST```\
**Body**: 
```
{
 title: new title of product listing,
 price: new price of product,
 tag: new category of product,
 description: new description of product
}
```
**Expected Return**:
```
{
 "user": User who owns updated product listing
 "item": Updated product listing,
}
```
## User Routes
1. Create new User/Admin\
**URL:** ```/users```\
**Request Method**: ```POST```\
**Body**: 
```
{
 email: email,
 password: password,
 type: user type (admin/user),
 name: name of new user,
 bio: bio of new user
}
```
**Expected Return**:
```
{
 _id: if of user in database
 email: email,
 password: password,
 type: user type (admin/user),
 name: name of new user,
 bio: bio of new user,
 items: [],
 __v: 
}
```
2. Login\
**URL:** ```/users/login```\
**Request Method**: ```POST```\
**Body**: 
```
{
 email: email,
 password: password
}
```
**Expected Return**:
```
{
 "user": id of a user who successfully logged in,
 "userType": type of user who logged in (admin/user)
}
```

## Profile Routes
1. Upload user profile picture\
**URL:** ```/MyProfile/images/:userid```\
**Request Method**: ```POST```\
**Body**: Not used, but req.files.image.path stores image for the product\
**Expected Return**:
```
{
  user: User with updated profile picture
}
```

2. Get profile information
**URL:** ```/MyProfile/:id```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**:
```
{
  "_id": user's id
  "email": user's email
  "name": user's name
  "bio: user's bio
  "image": user's profile picture
}
```

3. Update profile information
**URL:** ```/MyProfile/:id```\
**Request Method**: ```POST```\
**Body**: 
```
{
  name: updated user's name
  bio: updated user's bio
}
```
**Expected Return**:
```
{
  "username": user's email
  "name": updated user's name
  "bio: updated user's bio
}
```

## Annoucement Routes
1. Get all annoucements\
**URL:** ```/announcement```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**:
```
{
 "annoucement": [All annoucements in database]
}
```
2.Create a new Announcement\
**URL:** ```/announcement```\
**Request Method**: ```POST```\
**Body**: 
```
{
 title: title of annoucement,
 content: announcement content
}
```
**Expected Return**:
```
{
 "_id": id of new Announcement,
 "title": title of new Announcement,
 "content": content of new Announcement,
 "__v": 
}
```
3. Delete an announcement \
**URL:** ```/announcement/:ids```\
**Request Method**: ```DELETE```\
**Body**: not used\
**Expected Return**:
```
{
 "_id": id of deleted Announcement,
 "title": title of deleted Announcement,
 "content": content of deleted Announcement,
 "__v": 
}
```

## Report Post Routes
1. Get all reportedPost \
**URL:** ```/reportedposts```\
**Request Method**: ```GET```\
**Body**: not used\
**Expected Return**:
```
{
 reportedPosts: [All reported product listings]
}
```
2.Report an item\
**URL:** ```/report/:userid/:ownerid/:itemid```\
**Request Method**: ```POST```\
**Body**: not used \
**Expected Return**: 
```
{
 "updatedUser": user who owns the reported product listing
}
```
