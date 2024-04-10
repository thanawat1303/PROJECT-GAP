require('dotenv').config().parsed

const DB = {
    listConfig : (username, password) => {
        return {
            host: process.env.HOST,
            user: username,
            password : password,
            database : process.argv[2] == process.env.BUILD ? process.env.DATABASE_SER : process.env.DATABASE_DEV,
            port : 3307,
        }
    },
    
    dbErrorReturn : (con, err, res) => {
        console.log(err)
        res.send('error')
        con.end()
    }   
}

// const con = db.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER_DBDEV,
//     password : process.env.PASSWORD_DBDEV,
//     DATABASE_DEV : process.env.DATABASE_DEV
// })

// process.argv[2] == process.env.BUILD ? process.env.USER_DBSER : process.env.USER_DBDEV
// process.argv[2] == process.env.BUILD ? process.env.PASSWORD_DBSER : process.env.PASSWORD_DBDEV

// con.connect((err)=>{
//     if (err) throw err;
//     console.log("Connected DATABASE_DEV")
//     con.pause()
// })

module.exports = DB
