const express = require("express");

const db = require("../db");

const utils = require("../utils");

const router = express.Router();

router.post('/', (req, res) => {
    const {
        categoryId,
        title,
        details,
        address,
        contactNo,
        ownerName,
        isLakeView,
        isTV,
        isAC,
        isWifi,
        isMiniBar,
        isBreakfast,
        isParking,
        guests,
        bedrooms,
        beds,
        bathrooms,
        rent
    } = req.body


    const query = 
    `   insert into property 
        (
        categoryId,    
        title, 
        details, 
        address, 
        contactNo,
        ownerName,
        isLakeView,
        isTV,
        isAC,
        isWifi,
        isMiniBar,
        isBreakfast,
        isParking,
        guests,
        bedrooms,
        beds,
        bathrooms,
        rent) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

    db.pool.execute(query, 
        [
        1,
        title, 
        details, 
        address,
        contactNo,
        ownerName,
        isLakeView,
        isTV,
        isAC,
        isWifi,
        isMiniBar,
        isBreakfast,
        isParking,
        guests,
        bedrooms,
        beds,
        bathrooms,
        rent,
        ], (err, pro) => {
        if (err)
            res.send(utils.createErrorResult(err));

        else
            res.send(utils.createSuccessResult(pro));
    });

})

router.get('/', (req, res)=>
{
    const stmt = `select categoryId, title, details, address, contactNo, rent from property;`
    db.pool.query(stmt, (err, properties)=>
    {
        res.send(utils.createResult(err, properties))
    }) 
})

router.get('/details/:categoryId',(req,res)=>
{
    const { categoryId } = req.params
    const stmt = `select * from property where id = ? ;`
    db.pool.query(stmt, (err,properties)=>
    {
        res.send (utils.createResult(err, properties[0]))
    })
})

module.exports = router