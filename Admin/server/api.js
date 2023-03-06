require('dotenv').config().parsed
// import module express config
const app = require('./configExpress')
// module DB and connect DB
const db = require('./dbConfig')

// req
app.post('/check' , (req , res)=>{
  (req.body['session'] == null) ? res.redirect('/logout') : res.redirect('login');
})

app.all('/login' , (req , res)=>{
  // เช็คการเข้าสู่ระบบจริงๆ
  let username = req.session.username ?? req.body['username'] ?? ''
  let password = req.session.password ?? req.body['password'] ?? ''
  db.query(`SELECT * FROM admin WHERE username=? AND password=?` , [req.body['username'] , req.body['password']] , (err , result)=>{
    if (err) throw err;
    console.log(result[0])
    if(result[0]){
      console.log('LOGIN')
      req.session.username = req.body['username']
      req.session.password = req.body['password']
      res.send('1')
    } else {
      res.redirect('logout')
    }
  })
})

app.get('/logout' , (req , res) => {
  console.log('LOGOUT')
  res.clearCookie('chatgptU').send('')
})

module.exports = app