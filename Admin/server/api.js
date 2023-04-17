require('dotenv').config().parsed
// import module express config
const app = require('./configExpress')
// module DB and connect DB
const db = require('./dbConfig')

// req
app.post('/check' , (req , res)=>{
  res.redirect('login');
})

// check action of user
app.post('/checkUserAction' , (req , res)=> {
  let username = req.session.username ?? '';
  let password = req.body['password'] ?? '';

  if(username === '') {
    res.redirect('logout')
    return 0
  }

  db.resume()

  db.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err , result)=>{
    if (err) throw err;

    if(result[0]){
      console.log(req.session.checkAction)
      req.session.checkAction = process.env.KEY_SESSION
      res.send('1')
    } else {
      res.send('')
    }

    db.pause()
  })
})

app.post('/addDocter' , (req , res)=>{
  console.log(req.session.checkAction)
  if(req.body['ID'] && req.body['passwordDT'] && req.session.checkAction == process.env.KEY_SESSION) {
    db.resume()

    db.query(`INSERT INTO accountdt(
      Fullname_docter , id_docter , Password_docter , Image_docter , Job_care_center , Status_account) 
      VALUES (?,?,?,?,?,?)` , ['',req.body['ID'],req.body['passwordDT'],'','',1] , (err , result)=>{
      if(err) {
        res.send('error Insert')
        return 0
      }

      db.pause()
      delete req.session.checkAction
      res.send('1')
    })
  }
  
  else res.send('error session')
})


// check Login
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

      // create sestion login
      req.session.username = username
      req.session.password = password
      res.send('1')
    } else {
      res.redirect('logout')
    }
    db.pause()
  })
})

app.get('/logout' , (req , res) => {
  console.log('LOGOUT')
  res.clearCookie('connect.sid').send('')
})

module.exports = app