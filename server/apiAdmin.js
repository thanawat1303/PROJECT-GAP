require('dotenv').config().parsed
// import module express config
const app = require('./apiDocter')

// module DB and connect DB
const db = require('mysql')
const dbpacket = require('./dbConfig')
const apifunc = require('./apifunc')
// req
app.post('/api/admin/check' , (req , res)=>{
  console.log(req.hostname)
  res.redirect('/api/admin/auth');
})

app.post('/api/admin/chkOver' , (req , res)=>{
  let username = req.session.user_admin
  let password = req.session.pass_admin

  if(username === '' || password === '' || req.hostname !== process.env.HOST_NAME) {
    res.redirect('/api/logout')
    return 0
  }

  let con = db.createConnection(dbpacket.listConfig())

  apifunc.auth(con , username , password , res , "admin").then((result)=>{
    if(result === "pass") {
      if(req.body['ID']) {
        con.query(`SELECT id_docter FROM accountdt WHERE id_docter=?` , [req.body['ID']] , (err,result)=>{
          if(err) {
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          }

          con.destroy()
          
          if(result[0]) res.send('over')
          else res.send('1')

        })
      } else {
        con.destroy()
        res.send('error ID')
      }
    }
  }).catch((err)=>{
    con.destroy()
    if(err == "not pass") {
      res.redirect('/api/logout')
    }
  })

  // con.connect((err) => {
  //   if(err) {
  //     dbpacket.dbErrorReturn(con , err , res)
  //     return 0
  //   }

  //   con.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err , result)=>{
  //     if (err) {
  //       dbpacket.dbErrorReturn(con , err , res)
  //       return 0
  //     };
  
  //     if(result[0]){
  
  //       if(req.body['ID']) {
  //         con.query(`SELECT id_docter FROM accountdt WHERE id_docter=?` , [req.body['ID']] , (err,result)=>{
  //           if(err) {
  //             dbpacket.dbErrorReturn(con , err , res)
  //             return 0
  //           }

  //           con.destroy()
            
  //           if(result[0]) res.send('over')
  //           else res.send('1')

  //         })
  //       } else {
  //         con.destroy()
  //         res.send('error ID')
  //       }
  
  //     } else {
  //       con.destroy()
  //       res.redirect('/api/logout')
  //     }
  //   })
  // })
})

// check action of user
app.post('/api/admin/checkUserAction' , (req , res)=> {
  let username = req.session.user_admin ?? '';
  let password = req.body['password'] ?? '';

  if(username === '' || req.hostname !== process.env.HOST_NAME) {
    res.redirect('/api/logout')
    return 0
  }

  let con = db.createConnection(dbpacket.listConfig())

  con.connect((err)=>{
    if(err) {
      dbpacket.dbErrorReturn(con , err , res)
      return 0
    }

    con.query(`SELECT * FROM admin WHERE username=? AND password=SHA2( ? , 256)` , [username , password] , (err , result)=>{
      if (err) {
        dbpacket.dbErrorReturn(con , err , res)
        return 0
      };
  
      if(result[0]){
        console.log(req.session.checkAction)
        if(req.body['type'] == "add") 
            req.session.checkADD = 
                  {
                    value : process.env.KEY_SESSION + "add",
                    time : new Date().getTime()
                  }
        else if(req.body['type'] == "delete") 
            req.session.checkDelete = 
                  {
                    value : process.env.KEY_SESSION + "delete",
                    time : new Date().getTime()
                  }
        res.send('1')
      } else {
        res.send('incorrect')
      }
  
      con.destroy()
    })
  })
})

app.post('/api/admin/add' , (req , res)=>{
  let timeoutSession = 20
  if(req.body['ID'] && req.body['passwordDT'] && 
      req.session.checkADD['value'] === process.env.KEY_SESSION + "add" && 
      new Date().getTime() - req.session.checkADD['time'] <= timeoutSession &&
      req.hostname === process.env.HOST_NAME) {
    
    delete req.session.checkADD

    let username = req.session.user_admin
    let password = req.session.pass_admin

    if(username === '' || password === '') {
      res.redirect('/api/logout')
      return 0
    }

    let con = db.createConnection(dbpacket.listConfig())

    apifunc.auth(con , username , password , res , "admin").then( async (result)=>{
      if(result === "pass") {
        con.query(`INSERT INTO accountdt(
          Fullname_docter , id_docter , Password_docter , Image_docter , Job_care_center , Status_account , Status_delete) 
          VALUES (?,?,SHA2(?,256),?,?,?,?)` , ['',req.body['ID'],password,'','',1,0] , (err , result)=>{
          if(err) {
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          }
    
          con.destroy()
          res.send('1')
        })
      }
    }).catch((err)=>{
      con.destroy()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    })

    // con.connect((err)=> {
    //   if(err) {
    //     dbpacket.dbErrorReturn(con , err , res)
    //     return 0
    //   }

    //   con.query(`INSERT INTO accountdt(
    //     Fullname_docter , id_docter , Password_docter , Image_docter , Job_care_center , Status_account , Status_delete) 
    //     VALUES (?,?,?,?,?,?,?)` , ['',req.body['ID'],req.body['passwordDT'],'','',1,0] , (err , result)=>{
    //     if(err) {
    //       dbpacket.dbErrorReturn(con , err , res)
    //       return 0
    //     }

    //     console.log(result)
  
    //     con.destroy()
    //     res.send('1')
    //   })
    // })
    // res.send('0')
  }
  
  else {
    delete req.session.checkADD
    res.send('error session')
  }

})

app.post('/api/admin/listDocter' , (req , res)=>{
  let username = req.session.user_admin
  let password = req.session.pass_admin

  if(username === '' || password === '' || req.hostname !== process.env.HOST_NAME) {
    res.redirect('/api/logout')
    return 0
  }

  let con = db.createConnection(dbpacket.listConfig())

  apifunc.auth(con , username , password , res , "admin").then((result)=>{
    if(result === "pass") {
      con.query('SELECT Fullname_docter , id_docter , Image_docter , Job_care_center , Status_account FROM accountdt WHERE Status_delete=0 LIMIT 25;' , (err , result)=>{
        if (err){
          dbpacket.dbErrorReturn(con , err , res)
          return 0
        };

        con.destroy()
        res.send(result)
      })
    }
  }).catch((err)=>{
    con.destroy()
    if(err == "not pass") {
      res.redirect('/api/logout')
    }
  })
})

app.post('/api/admin/changeState' , (req,res)=>{
  let username = req.session.user_admin
  let password = req.session.pass_admin

  if(username === '' || password === '' || req.hostname !== process.env.HOST_NAME) {
    res.redirect('/api/logout')
    return 0
  }

  let con = db.createConnection(dbpacket.listConfig())

  apifunc.auth(con , username , password , res , "admin").then((result)=>{
    if(result === "pass") {
      if(req.body['ID'] && req.body['status'] != undefined) {
        con.query(`UPDATE accountdt SET Status_account = ? WHERE id_docter = ?;` , [(req.body['status'] == 1) ? 0 : 1 , req.body['ID']] , (err,result)=>{
          if(err) {
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          }

          con.destroy()

          // console.log(result)
          if(result.changedRows == 1) res.send('1')
          else res.send('error')
        })
      } else {
        con.destroy()
        res.send('error ID or status')
      }
    }
  }).catch((err)=>{
    con.destroy()
    if(err == "not pass") {
      res.redirect('/api/logout')
    }
  })
})

app.post('/api/admin/delete' , (req , res)=>{
  let timeoutSession = 20
  if(req.body['ID'] &&
      req.session.checkDelete['value'] === process.env.KEY_SESSION + "delete" && 
      new Date().getTime() - req.session.checkDelete['time'] <= timeoutSession &&
      req.hostname === process.env.HOST_NAME) {
    
    delete req.session.checkDelete

    let username = req.session.user_admin
    let password = req.session.pass_admin

    if(username === '' || password === '') {
      res.redirect('/api/logout')
      return 0
    }

    let con = db.createConnection(dbpacket.listConfig())

    apifunc.auth(con , username , password , res , "admin").then((result)=>{
      if(result === "pass") {
        con.query(`UPDATE accountdt SET Status_delete = 1 WHERE id_docter=?` , [req.body['ID']] , (err , result)=>{
          if(err) {
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          }
    
          con.destroy()
          res.send('1')
        })
      }

    }).catch((err)=>{
      con.destroy()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    })
  }
  
  else {
    delete req.session.checkDelete
    res.send('error session')
  }

})
// check Login
app.all('/api/admin/auth' , (req , res)=>{
  
  // เช็คการเข้าสู่ระบบจริงๆ
  let username = req.session.user_admin ?? req.body['username'] ?? '';
  let password = req.session.pass_admin ?? req.body['password'] ?? '';

  if(username === '' || password === '' || req.hostname !== process.env.HOST_NAME) {
    res.redirect('/api/logout')
    return 0
  }

  let con = db.createConnection(dbpacket.listConfig())

  // db.resume()

  apifunc.auth(con , username , password , res , "admin").then((result)=>{
    if(result === "pass") {
      req.session.user_admin = username
      req.session.pass_admin = password
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

app.get('/api/logout' , (req , res) => {
  console.log('Logout')
  res.clearCookie('connect.sid').send('')
})

module.exports = app