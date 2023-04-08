require('dotenv').config().parsed
// import module express config
const app = require('./configExpress')
// module DB and connect DB
const db = require('./dbConfig')

// req
app.post('/check' , (req , res)=>{
  res.redirect('login');
})

app.all('/login' , (req , res)=>{
  // เช็คการเข้าสู่ระบบจริงๆ
  let username = req.session.username ?? req.body['username'] ?? '';
  let password = req.session.password ?? req.body['password'] ?? '';

  if(username === '' || password === '') {
    res.redirect('logout')
    return 0
  }

  db.resume()

  db.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err , result)=>{
    if (err) throw err;
    if(result[0]){
      req.session.username = username
      req.session.password = password
      res.send('1')
    } else {
      res.redirect('logout')
    }
    // db.pause()
  })
})

app.get('/logout' , (req , res) => {
  console.log('LOGOUT')
  res.clearCookie('connect.sid').send('')
})

module.exports = app