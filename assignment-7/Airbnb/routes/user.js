//router is used to handel navigation from file to file
const express = require("express");

//database 
const db = require("../db");

//if error comes in users then it will handel by util.js
const utils = require("../utils");

//for routing purpose (we want to use rout user to server)
const router = express.Router();

const crypto = require('crypto-js');
const jwt =require('jsonwebtoken');
const config = require('../config');

//call back functions
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const stmt = `select id, firstName, lastName, phoneNumber, isDeleted from user where email = ? and password = ?`
    //? means it will fill up email and password

    //encrypted
    //npm i crypto 
    const encryptedPassword = String(crypto.SHA256(password))

    db.pool.execute(stmt, [email, encryptedPassword], (err, users) => {
        if (err) {
            //if any error comes it will send to utils-createErrorResult(and pass err here i.e err)
            res.send(utils.createErrorResult(err));
        }
        else {
            if (users.length == 0) 
            {
                res.send(utils.createErrorResult('user does not exist'));
            }
            else
            {
                const user = users[0]
                if (user.isDeleted)
                {
                    res.send(utils.createErrorResult('Your account is closed'));
                }
                else
                {
                    //create the payload
                    const payload = {id : user.id}
                    const token = jwt.sign(payload, config.secret)
                    const userData = 
                    {
                        token,
                        name: `${user['firstName']} ${user ['lastName']}`,
                    }
                    res.send(utils.createSuccessResult(userData)) 
                }
            }
            
        }
    });
})

router.post('/register', (req, res) => {
    //we have to get data from req.body (described in server.js)
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    //interacting with database from node.js
    //stmt -> constatnt variable that holds the sql query as a string
    const stmt = `insert into user (firstName,  lastName, email, password, phoneNumber) values (?,?,?,?,?);`
    const encryptedPassword = String(crypto.SHA256(password))


    //this function is executing the sql query using a connection pool
    db.pool.execute(stmt, [firstName, lastName, email, encryptedPassword, phoneNumber], (err, user) => {
        if (err) {
            //error comes
            res.send(utils.createErrorResult(err));
        }
        else {
            //successful insert
            res.send(utils.createSuccessResult(user));
        }
    })
});

router.put('/profile/', (req,res)=>
{
    const {firstName, lastName, phoneNumber} = req.body
    const stat = `update user set firstName = ?, lastName = ?, phoneNumber = ? where id = ?;`

    db.pool.execute
    (
        stat, 
        [firstName, lastName, phoneNumber, req.userId],
        (error, result)=>
        {
            res.send (utils.createResult(error, result))
        }
    )
})

router.get('/profile/', (req, res) => {
    const stmt = `select firstName ,lastName, phoneNumber, email from user where id =?;`
    db.pool.execute(stmt,[req.userId] ,(err, result)=>
        {
            res.send(utils.createResult(err, result))
        })
})


router.get ('/profile/:id', (req,res)=>
{
    const {id} = req.params
    const stat = `select * from user where id =?;`

    db.pool.query
    (stat, [id], (error, properties)=>
    {
        res.send(utils.createResult(error,properties[0]))
    })
})


//we have to export routers to server  
module.exports = router