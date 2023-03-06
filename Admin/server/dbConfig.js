const db = require('mysql')
require('dotenv').config().parsed

const con = db.createConnection({
    host: process.env.HOST,
    user: process.env.USERDB,
    password : process.env.PASSWORDDB,
    database : process.env.DATABASE
})

con.connect((err)=>{
    if (err) throw err;
    console.log("Connected database")
})

module.exports = con
