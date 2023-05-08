require('dotenv').config().parsed
// import module express config
const app = require('./apiFarmer')

// module DB and connect DB
const db = require('mysql')
const dbpacket = require('./dbConfig')
const apifunc = require('./apifunc')

// req
app.post('/api/docter/check' , (req , res)=>{
    res.redirect('/api/docter/auth');
})

app.all('/api/docter/auth' , (req , res)=>{
  
    // เช็คการเข้าสู่ระบบจริงๆ
    let username = req.session.user_docter ?? req.body['username'] ?? '';
    let password = req.session.pass_docter ?? req.body['password'] ?? '';

    if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
        res.redirect('/api/logout')
        return 0
    }

    let con = db.createConnection(dbpacket.listConfig())

    // db.resume()

    apifunc.auth(con , username , password , res , "docter").then((result)=>{
        if(result === "pass") {
        req.session.user_docter = username
        req.session.pass_docter = password
        res.send('1')
        }
        con.destroy()
    }).catch((err)=>{
        if(err == "not pass") {
        res.redirect('/api/logout')
        con.destroy()
        } else if( err == "connect" ) {
        res.redirect('/api/logout')
        }
    })

})

module.exports = app