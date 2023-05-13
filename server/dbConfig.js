require('dotenv').config().parsed

const DB = {
    listConfig : () => {
        return {
            host: process.env.HOST,
            user: process.argv[2] == process.env.BUILD ? process.env.USER_DBSER : process.env.USER_DBDEV,
            password : process.argv[2] == process.env.BUILD ? process.env.PASSWORD_DBSER : process.env.PASSWORD_DBDEV,
            database : process.argv[2] == process.env.BUILD ? process.env.DATABASE_SER : process.env.DATABASE_DEV
        }
    },
    
    dbErrorReturn : (con , err , res) => {
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

// con.connect((err)=>{
//     if (err) throw err;
//     console.log("Connected DATABASE_DEV")
//     con.pause()
// })

module.exports = DB
