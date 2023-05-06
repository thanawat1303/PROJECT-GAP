require('dotenv').config().parsed
const DB = {
    listConfig : () => {
        return {
            host: process.env.HOST,
            user: process.env.USERDB,
            password : process.env.PASSWORDDB,
            database : process.env.DATABASE
        }
    },
    
    dbErrorReturn : (con , err , res) => {
        console.log(err)
        res.send('error')
        con.destroy()
    }   
}

// const con = db.createConnection({
//     host: process.env.HOST,
//     user: process.env.USERDB,
//     password : process.env.PASSWORDDB,
//     database : process.env.DATABASE
// })

// con.connect((err)=>{
//     if (err) throw err;
//     console.log("Connected database")
//     con.pause()
// })

module.exports = DB
