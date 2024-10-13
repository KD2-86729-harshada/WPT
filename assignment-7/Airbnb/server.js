//import express
const express = require('express');

//creates an instance(object) of express by calling express function 
const app = express();

//import utils
const utils = require('./utils');

//config.js
const config = require('./config');

//import jwt
const jwt = require('jsonwebtoken');

//we have to import user here (this imports a seprate routing file user.js from routes folder)
const userrouter = require("./routes/user");

const propertyrouter = require("./routes/property");

const categoryrouter = require("./routes/category");

const bookingrouter = require("./routes/booking");


//middleware to verify the toekn
app.use((req,res,next)=>
{
    //check if the token is required for API
    if
    (
        req.url === '/user/login' ||
        req.url === '/user/register'
        // req.url === '/user/profile/:id' ||
        // req.url.startsWith('/image/')
    )
    {
        //skip verifying token
        next()
    }
    else
    {
        //get the token
        const token = req.headers['token']

        if(!token || token.length === 0)
        {
            res.send(utils.createErrorResult ('missig token'))
        }
        else
        {
            try{
                //verify the token   
                const payload = jwt.verify(token, config.secret)   //payload->extra information

                //add the user id to the request
                req.userId = payload['id']

                //TODO : expiry logic

                //call the real route 
                next()
            }
            catch(ex)
            {
                res.send(utils.createErrorResult('invalid token'))
            }
        }
    }
})

//it is middleware fuction which is use to parse incoming request body as JSON
app.use(express.json())

//this line will telling express to use the userrouter for all routes that starts with /user
app.use ('/user', userrouter)  //url and router from user.js
app.use ('/property',propertyrouter)
app.use ('/category',categoryrouter)
app.use ('/booking', bookingrouter)


//creating server
//app.listen(9999, ...) starts the Express application and tells it to listen for incoming HTTP requests on port 9999
app.listen (9999,() => {console.log("Server is running")});


