//we are installing npm i multer* for images upload and images stores in folder and we have to give path of folder
//if multor not work then use *npm i upload*
//database uses blob to store that images

const express = require("express");
const db = require ("../db");
const utils = require ("../utils");

//import multer
const multer = require("multer");   

//creating object to upload file 
// upload here is a middleware for handling form-data
const upload = multer ({dest : 'images'})

const router = express.Router();


//for file version we use form data

//use the middleware (upload) to upload single 'icon'
router.post('/',upload.single('icon'),(req,res)=>
{
    const {title, details} = req.body

    //get the name of uploaded file
    const fileName = req.file.filename

    const stat = `insert into category (title, details, image) value (?,?,?);`

    db.pool.execute(
        stat,[title, details, fileName],
        (Error, categories)=>
        {
            res.send(utils.createResult(Error, categories))
        }
    )
})


//get
router.get('/',(req,res)=>
    {
        //sql query (query fire)
        const stat = `select id, title, details, image from category;`
    
        //pooling query and if error comes it will handel by utils
        db.pool.execute(stat,(Error,categories)=>
        {
            res.send(utils.createResult(Error,categories))
        })
    })

module.exports = router


