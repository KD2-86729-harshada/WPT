//database connectivity mysql2 library which is used to interact with MySQL databases.
const mysql = require("mysql2");

//create connection  
//createPool(): Allows multiple connections to the database with better management of resources.
const pool = mysql.createConnection({
    host: "localhost",
    database : "airbnb_db",
    port : 3306,
    user : "root",
    password : "manager"
});

module.exports={pool};