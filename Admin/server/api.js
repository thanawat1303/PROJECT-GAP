require('dotenv').config().parsed
// import module express config
const app = require('./configExpress')
// module DB and connect DB
const db = require('./dbConfig')

// req
app.post('/admin/check' , (req , res)=>{
  res.redirect('login');
})

app.post('/admin/chkOver' , (req , res)=>{
  let username = req.session.username
  let password = req.session.password

  if(username === '' || password === '') {
    res.redirect('logout')
    return 0
  }

  db.resume()

  db.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err , result)=>{
    if (err) {
      db.pause()
      console.log(err)
      res.send('error')
      return 0
    };

    if(result[0]){

      if(req.body['ID']) {
        db.query(`SELECT id_docter FROM accountdt WHERE id_docter=?` , [req.body['ID']] , (err,result)=>{
          if(err) {
            db.pause()
            console.log(err)
            res.send('error')
            return 0
          }
          
          if(result[0]) res.send('over')
          else res.send('1')
  
          db.pause()
        })
      } else res.send('error ID')

    } else {
      res.redirect('logout')
    }
  })
})

// check action of user
app.post('/admin/checkUserAction' , (req , res)=> {
  let username = req.session.username ?? '';
  let password = req.body['password'] ?? '';

  if(username === '') {
    res.redirect('logout')
    return 0
  }

  db.resume()

  db.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err , result)=>{
    if (err) {
      db.pause()
      console.log(err)
      res.send('error')
      return 0
    };

    if(result[0]){
      console.log(req.session.checkAction)
      req.session.checkAction = process.env.KEY_SESSION
      res.send('1')
    } else {
      res.send('incorrect')
    }

    db.pause()
  })
})

app.post('/admin/addDocter' , (req , res)=>{
  console.log(req.session.checkAction)
  if(req.body['ID'] && req.body['passwordDT'] && req.session.checkAction == process.env.KEY_SESSION) {

    db.resume()

    db.query(`INSERT INTO accountdt(
      Fullname_docter , id_docter , Password_docter , Image_docter , Job_care_center , Status_account) 
      VALUES (?,?,?,?,?,?)` , ['',req.body['ID'],req.body['passwordDT'],'','',1] , (err , result)=>{
      if(err) {
        db.pause()
        console.log(err)
        res.send('error')
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
app.all('/admin/login' , (req , res)=>{
  
  // เช็คการเข้าสู่ระบบจริงๆ
  let username = req.session.username ?? req.body['username'] ?? '';
  let password = req.session.password ?? req.body['password'] ?? '';

  if(username === '' || password === '') {
    res.redirect('logout')
    return 0
  }

  db.resume()

  db.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err , result)=>{
    if (err){
      db.pause()
      console.log(err)
      res.send('error')
      return 0
    };

    if(result[0]){

      // create session login
      req.session.username = username
      req.session.password = password
      res.send('1')

    } else {
      res.redirect('logout')
    }

    db.pause()
  })
})

app.get('/admin/logout' , (req , res) => {
  console.log('LOGOUT')
  res.clearCookie('connect.sid').send('')
})

module.exports = app