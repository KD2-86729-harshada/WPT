//*next* will work on middleware as callback function

//url will go in request.header

//payload* token is jwt paket --> in config.js........... 
//sign /payload/verify -->3function
//payload is to create the token

const express = require("express")

const db = require("../db")
const utils = require("../utils")
const config = require("../config")

const router = express.Router();

router.get('/',(req,res)=>
{
    const stat = `select * from bookings;`

    db.pool.execute(stat, (Error, booking)=>
    {
        res.send(utils.createResult(Error, booking))
    })
})

router.post('/', (req,res)=>
{
    const {propertyId, total, fromDate, toDate} = req.body
    const stat = `insert into bookings(userId, propertyId, total, fromDate, toDate) values (?, ?, ?, ?, ?);`

    db.pool.execute
    (
        stat, 
        [req.userId, propertyId, total, fromDate, toDate],
        (Error,booking)=>{res.send(utils.createResult(Error, booking))}
    )
})

module.exports = router

