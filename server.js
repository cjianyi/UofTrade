'use strict'

/* Server environment setup */
// To run in development mode, run normally: node server.js
// To run in development with the test user logged in the backend, run: TEST_USER_ON=true node server.js
// To run in production mode, run in terminal: NODE_ENV=production node server.js
const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)

const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON // option to turn on the test user.
const TEST_USER_ID = '5fb8b011b864666580b4efe3' // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USER_EMAIL = 'test@user.com'
//////

const path = require('path')
const bcrypt = require('bcryptjs')
const express = require("express");

// starting the express server
const app = express();

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require('cors')
if (env !== 'production') { app.use(cors()) }

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { Conversation } = require("./models/Conversation");
const { User } = require("./models/User");
const { Announcement } =  require("./models/Announcement")
// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing parts of the request into a usable object (onto req.body)
const bodyParser = require('body-parser') 
app.use(bodyParser.json()) // parsing JSON body
app.use(bodyParser.urlencoded({ extended: true })); // parsing URL-encoded form data (from form POST requests)

// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require('connect-mongo') // to store session information on the database in production

function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
    return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}
// multipart middleware: allows you to access uploaded file from req.file
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// cloudinary: configure using credentials found on your Cloudinary Dashboard
// sign up for a free account here: https://cloudinary.com/users/register/free
const cloudinary = require('cloudinary');
const { constants } = require('buffer')
cloudinary.config({
    cloud_name: 'dm6zvx4kf',
    api_key: '773454846511876',
    api_secret: '0xD7IHlbHoDnUJihlR7WrDw6SH8'
});

// Serve the build


//Middleware

//check if mongo connection has an error
const mongoChecker = (req, res, next) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
    log('Issue with mongoose connection')
    res.status(500).send('Internal server error')
    return;
    } else {
        next()  
    }   
}

//Session handling
app.use(
    session({
        secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60000,
            httpOnly: true
        },
        // store the sessions on the database in production
        store: env === 'production' ? MongoStore.create({
                                                mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/UofTradeApi'
                                 }) : null
    })
);

//Conversation Routes
//get all conversations user is a part of
app.get('/conversation/:id', mongoChecker, async (req, res) => {
    const id = req.params.id
    
    //validate id from client
    if (!ObjectID.isValid(id)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    
    try {
        const allConversations = await Conversation.find()
        //TODO: add a conversation object for all users when a user is created
        if (!allConversations) {
            res.status(404).send("Resource not found")
        }
        else {
            const userConversations = allConversations.filter((c) => c.people.includes(id))
            res.send({"conversations": userConversations})
        }        
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})


//get all users except for user id
app.get("/conversation/users/:id", mongoChecker, async(req, res) => {
    const id = req.params.id

    //validate id from client
    if (!ObjectID.isValid(id)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    try {
        const allUsers = await User.find()
        const users = allUsers.filter((u) => u._id != id) 
        res.send({"users": users})
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }    
})

//add a new message to conversation history, update Conversation document
app.post('/conversation/:conv_id', mongoChecker, async(req, res) => {
  
    const conversation_id = req.params.conv_id

     //validate id from client
     if (!ObjectID.isValid(conversation_id)) {  
        res.status(404).send("Resource not found")  
        return;  
    }    

    const newMessage = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        message: req.body.message
    }
    try {
        const convo = await Conversation.findById(conversation_id)
        if (!convo) {
            res.status(404).send("Resource not found")  
        }
        else {
            const fieldsToChange = { messageHistory: [] }
            const allMessages = convo.messageHistory
            allMessages.push(newMessage)
            fieldsToChange.messageHistory = allMessages

            //update document in database
            const updatedConversation = await Conversation.findOneAndUpdate({_id: conversation_id}, {$set: fieldsToChange}, {new: true, useFindAndModify: false})

            if (!updatedConversation) {
                res.status(404).send("Resource not found")  
            }

            else {
                res.send({ "newMessage": allMessages[allMessages.length - 1], "conversation": updatedConversation})
            }
        }
    }
    catch(error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }


})

//Item Routes
//get all Items (for Marketplace)
app.get("/items", mongoChecker, async (req, res) => {
    try {
        const allusers = await User.find()
        const allItems = []
        allusers.map((u) => {
            u.items.map((i) => {
                allItems.push({ owner: u._id, item: i})
            })
        })
        res.send({ "items": allItems})
    }
    catch(error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

// get items for a specific user
app.get("/items/:userid", mongoChecker, async (req, res) => {
    const userid = req.params.userid
    if (!ObjectID.isValid(userid)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  

    try {
         const user = await User.findById(userid)
        if (!user) {
            res.status(404).send("Resource not found")
        }
        const items = []
        for (let i = 0; i < user.items.length; i++){
            items.push({item: user.items[i], owner: userid})
        }
        res.send({"items": items})
    }
    catch(error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.get('/items/:userid/:itemid', mongoChecker, async (req, res) => {
    const userid = req.params.userid
    const itemid = req.params.itemid

    
    //validate userid from client
    if (!ObjectID.isValid(userid)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    //validate item
    if (!ObjectID.isValid(itemid)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    
    try {
        const user = await User.findById(userid)
        if (!user) {
            res.status(404).send("Resource not found")
        }
        else {
            for (let i = 0; i < user.items.length; i++){  
                if (user.items[i]["_id"].toString() === itemid.toString()){  
                    const owner = userid.toString()
                    res.send({
                        "owner": owner,
                        "item": user.items[i]
                    }
                    )  
                    return;  
                }  
            }  
            res.status(404).send('Resource not found')   
        }        
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.post('/items/:userid', mongoChecker, multipartMiddleware, async(req, res) => {
    cloudinary.uploader.upload(
        req.files.image.path, // req.files contains uploaded files
        async function (result) {
            // find userid
            const userid = req.params.userid
            if (!ObjectID.isValid(userid)) {  
                res.status(404).send("Resource not found")  
                return;  
            }  
            // Create a new image using the Image mongoose model
            const img = {
                image_id: result.public_id, // image id on cloudinary server
                image_url: result.url, // image url on cloudinary server
                created_at: new Date(),
            };
            const item = {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                tag: req.body.tag,
                usersReported: [],
                image: img
            }
            // append the new item to the user
            try {
                const user = await User.findById(userid)
                if (!user) {
                    res.status(404).send("Resource not found")
                }
                else {
                    user.items.push(item)
                    const new_items = user.items
                    try{
                
                        const result = await User.findOneAndUpdate({_id: userid}, {$set: {items: new_items}}, {new: true, useFindAndModify: false})
                        if (!result) {
                            res.status(404).send('Resource not found')
                        }else{
                            res.send({
                                item: user.items[user.items.length - 1],
                                user: user
                            })
                        }
                    }catch (error){
                        console.log(error)
                        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                            res.status(500).send('Internal server error')
                        } else {
                            res.status(400).send('Bad Request') // bad request for changing the reservation.
                        }
                    }
                    
                }        
            }
            catch (error) {
                console.log(error)
                res.status(500).send("Internal Server Error")
            }
        });
})
// remove item route
app.delete('/items/:userid/:itemid', mongoChecker, async (req, res) => {
    const userid = req.params.userid
    const itemid = req.params.itemid
    
    
    //validate userid from client
    if (!ObjectID.isValid(userid)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    //validate item
    if (!ObjectID.isValid(itemid)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    
    try {
        const user = await User.findById(userid)
        if (!user) {
            res.status(404).send("Resource not found")
        }
        else {
            for (let i = 0; i < user.items.length; i++){  
                if (user.items[i]["_id"].toString() === itemid.toString()){  
                    const item = user.items[i]
                    user.items.splice(i, 1)
                    const new_user = await User.findOneAndUpdate({_id: userid}, {$set: {items: user.items}}, {new: true, useFindAndModify: false})
                    res.send({
                        "user": new_user,
                        "item": item,
                    }
                    )  
                    return;  
                }  
            }  
            res.status(404).send('Resource not found')   
        }        
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//update item info
app.post('/items/:userid/:itemid', mongoChecker, async (req, res) => {
    const userid = req.params.userid
    const itemid = req.params.itemid
    
    
    //validate userid from client
    if (!ObjectID.isValid(userid)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    //validate item
    if (!ObjectID.isValid(itemid)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    
    try {
        const user = await User.findById(userid)
        if (!user) {
            res.status(404).send("Resource not found")
        }
        else {
            for (let i = 0; i < user.items.length; i++){  
                if (user.items[i]["_id"].toString() === itemid.toString()){  
                    const item = user.items[i]
                    item.title = req.body.title
                    item.price = req.body.price
                    item.description = req.body.description
                    const new_user = await User.findOneAndUpdate({_id: userid}, {$set: {items: user.items}}, {new: true, useFindAndModify: false})
                    res.send({
                        "user": new_user,
                        "item": item,
                    }
                    )  
                    return;  
                }  
            }  
            res.status(404).send('Resource not found')   
        }        
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})
//User Routes

//create new User route
app.post("/users", mongoChecker, async(req, res) => {
    

    try {
        //gets all current users
        
        
        const allUsers = await User.find()
        if (!allUsers) {
            res.status(404).send("Resource not found")
        }
        else {
            // check if email already exists in db
            for (let i = 0; i < allUsers.length; i++){
                if (allUsers[i].email === req.body.email){
                    res.status(409).send('email already in use')
                    return
                }
            }
        }
        const newUser = new User ({
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            name: req.body.name,
            bio: req.body.bio,
            items: []
        })        
        const result = await newUser.save()
        const oldUsers = allUsers.filter((u) => u.id != result.id)
        //create a Conversation document for new user with all users before
        if (oldUsers.length != 0)
        {
            for (let i = 0; i < oldUsers.length; i++) {
                const newConvo = new Conversation({
                    people: [oldUsers[i].id, result.id],
                    messageHistory: []
                })
                const savedConvo = await newConvo.save()
            }
        }
        res.send(result)

    }
    catch(error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.post("/users/login", (req, res) => {
    const email  = req.body.email
    const password = req.body.password

    User.findByEmailPassword(email, password)
        .then(user => {
            req.session.user = user._id;
            req.session.email = user.email
            res.send({ "user": user._id, "userType": user.type })
        })
        .catch(error => {
            res.status(400).send("Wrong Credentials")
        })
})


// profile routes
app.post("/MyProfile/images/:userid", mongoChecker, multipartMiddleware, async (req, res) => {
    cloudinary.uploader.upload(
        req.files.image.path, 
        async function (result) {
            // find userid
            const userid = req.params.userid
            if (!ObjectID.isValid(userid)) {  
                res.status(404).send("Resource not found")  
                return;  
            }  
            // Create a new image using the Image mongoose model
            const img = {
                image_id: result.public_id, // image id on cloudinary server
                image_url: result.url, // image url on cloudinary server
                created_at: new Date(),
            }
            // append the new item to the user
            try {
                const user = await User.findById(userid)
                if (!user) {
                    res.status(404).send("Resource not found")
                }
                else {
                    user.profile_picture = img
                    const new_user = await User.findOneAndUpdate({_id: userid}, {$set: {profile_picture: img}}, {new: true, useFindAndModify: false})  
                    res.send(  
                        {  
                            user: new_user
                        })  
                }        
            }
            catch (error) {
                console.log(error)
                res.status(500).send("Internal Server Error")
            }
        });
})

app.get("/MyProfile/:id", mongoChecker, async (req, res) => {
    const user_id = req.params.id

    //validate id from client
    if (!ObjectID.isValid(user_id)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  

    try {
        const user = await User.findById(user_id)
        
        if (!user) {
            res.status(404).send("Resource not found")
        } else{
            res.send({"_id": user._id, "email": user.email, "name": user.name, "bio": user.bio, "image": user.profile_picture})
            
        }
        
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }

});

app.post("/MyProfile/:id", mongoChecker, async (req, res) => {
    const user_id = req.params.id

	if (!ObjectID.isValid(user_id)) {
		res.status(404).send()
		return;  // so that we don't run the rest of the handler.
	}
    // Find the fields to update and their values
    // Update the user by their id.
	try {
        const user = await User.findById(user_id)
        if (!user) {
            res.status(404).send("Resource not found")
        }
        user.name = req.body.name
        user.bio = req.body.bio

		const user_update = await User.findOneAndUpdate({_id: user_id}, {$set: {username: user.email, name: user.name, bio: user.bio, "image": user.profile_picture}}, {new: true, useFindAndModify: false})
		if (!user_update) {
			res.status(404).send('Resource not found')
		} else {   
			res.send({"username": user_update.email, "name": user_update.name, "bio": user_update.bio})
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})


// announcement routes

app.get("/announcement", mongoChecker, async(req, res) => {
    try{
        const announcements = await Announcement.find()
        if (!announcements) {
            res.status(404).send("Resource not found")
        }else{
            res.send({"announcement": announcements})
        }
    }catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }


})
app.post("/announcement", mongoChecker, async(req, res) => {
    const newAnnouncement = new Announcement ({
        title: req.body.title,
        content: req.body.content
    })
    
    try{
        const result = await newAnnouncement.save()
        res.send(result)

    }catch (error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})
    
app.delete('/announcement/:ids', mongoChecker, async(req, res) => {
    const id = req.params.ids
    if (!ObjectID.isValid(id)) {
        res.status(404).send('Resource not found')
        return;
    }
    try{
        const announcements = await Announcement.findByIdAndRemove(id)
        if (!announcements){
            res.status(404).send("hh")
        
        }else{
            res.send(announcements)
        }
        
    }catch(error){
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// get reported post route
app.get("/reportedposts", mongoChecker, async(req, res) => {
    try {
        const allUsers = await User.find()
        const reportedPosts = []
        for (let i = 0; i < allUsers.length; i++){
            const userItems = allUsers[i].items
            for (let j = 0; j < userItems.length; j++){
                const item = userItems[j]
                if (item.usersReported.length > 0){
                    reportedPosts.push({item: item, num_reports: item.usersReported.length, owner: allUsers[i]._id})
                }
            }
        }
        res.send({reportedPosts: reportedPosts})
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }    
})


//report an item
//userid is current user
//ownerid is owner of post
//itemid is id of post to report
app.post('/report/:userid/:ownerid/:itemid', mongoChecker, async(req, res) => {
    const user_id = req.params.userid
    const owner_id = req.params.ownerid
    const item_id = req.params.itemid

    if (!ObjectID.isValid(user_id)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    if (!ObjectID.isValid(owner_id)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  
    if (!ObjectID.isValid(item_id)) {  
        res.status(404).send("Resource not found")  
        return;  
    }  

    try {
        const user = await User.findById(owner_id)

        if (!user) {
            res.status(404).send("Resource not found")
        }
        const listing = user.items.filter((i) =>i._id == item_id)
        const reported = listing[0].usersReported

        if (!reported.includes(user_id)) {

            listing[0].usersReported.push(user_id)

            const allItems = user.items
            const fieldsToChange = { items: allItems }

            const userUpdated = await User.findOneAndUpdate({_id: owner_id}, {$set: fieldsToChange}, {new: true, useFindAndMofify: false})

            if (!userUpdated) {
                res.status(404).send("Resource not found")
            }
            else {
                res.send({"updatedUser": userUpdated})
            }
            
        }
        else{
            res.status(403).send("You already reported the error")
            return;
        }
        
    }
    catch(error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})


app.use(express.static(path.join(__dirname, "/uoftrade/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.

    // send index.html
    res.sendFile(path.join(__dirname, "/uoftrade/build/index.html"));
});
/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});



