require('dotenv').config().parsed
export default function apiAdmin (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any) {
  app.post('/api/admin/check' , (req:any , res:any)=>{
    res.redirect('/api/admin/auth');
  })
  
  app.post('/api/admin/doctor/list' , (req:any , res:any)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK && HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    apifunc.auth(con , username , password , res , "admin").then((result:any)=>{
      if(result['result'] === "pass") {
        let data = req.body
        let select = data.typeDelete === 0 ? ", status_account" : ""
        con.query(
          `
            SELECT 
            (
                SELECT name_station FROM station_list WHERE acc_doctor.station_doctor=station_list.id_station
            ) as station , id_table_doctor , fullname_doctor , id_doctor , img_doctor ${select}
            FROM acc_doctor
            WHERE status_delete=? LIMIT 25;
          ` 
        , 
        [data.typeDelete] ,
        (err:any , result:any)=>{
          if (err){
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          };
  
          con.end()
          res.send(result)
        })
      }
    }).catch((err:any)=>{
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    })
  })

  app.post('/api/admin/doctor/get' , (req:any , res:any)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK && HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    apifunc.auth(con , username , password , res , "admin").then((result:any)=>{
      if(result['result'] === "pass") {
        let data = req.body
        con.query(
          `
            SELECT 
            (
                SELECT name_station FROM station_list WHERE acc_doctor.station_doctor=station_list.id_station
            ) as station , id_table_doctor , fullname_doctor , id_doctor , img_doctor , status_account , status_delete
            FROM acc_doctor
            WHERE id_table_doctor=? LIMIT 25;
          ` 
        , 
        [data.id_table] ,
        (err:any , result:any)=>{
          if (err){
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          };
  
          con.end()
          res.send(result)
        })
      }
    }).catch((err:any)=>{
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    })
  })

  app.post('/api/admin/add' , async (req:any , res:any)=>{
    if(req.body['id_doctor'] && req.body['passwordDT'] && req.body['passwordAd'] && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
        
      let username = req.session.user_admin
      let password = req.body['passwordAd']
  
      if(username === '') {
        res.redirect('/api/logout')
        return 0
      }
  
      let con = Database.createConnection(listDB)
  
      try {
        let auth = await apifunc.auth(con , username , password , res , "admin")
        if(auth['result'] === "pass") {
          con.query(`
                    SELECT id_table_doctor
                    FROM acc_doctor 
                    WHERE id_doctor=? and status_delete=0
                    ` , [req.body['id_doctor']] , 
                    (err : any , account : any)=>{

                      if(err) {
                        dbpacket.dbErrorReturn(con , err , res)
                        console.log("check doctor")
                        return 0
                      }

                      if(account[0]) {
                        con.end()
                        res.send("overflow")
                      } else {
                        con.query(`INSERT INTO acc_doctor
                                      (
                                        fullname_doctor , 
                                        id_doctor , 
                                        uid_line_doctor , 
                                        password_doctor , 
                                        img_doctor , 
                                        station_doctor , 
                                        status_account , 
                                        status_delete
                                      ) 
                                      VALUES ('',?,'',SHA2(?,256),'','',1,0)` , 
                          [req.body['id_doctor'],req.body['passwordDT']] , 
                          (err:any , result:any)=>{
                            if(err) {
                              dbpacket.dbErrorReturn(con , err , res)
                              console.log("insert doctor")
                              return 0
                            }
                            con.end()
                            if(result.affectedRows == 1) res.send('correct')
                            else res.send("incorrect insert")
                        })
                      }
                    })
                    
        }
      } catch (err : any) {
        if(err == "not pass") {
          con.end()
          res.send("incorrect")
        }
      }
    }
    
    else {
      res.send('error session')
    }
  
  })
  

  app.post('/api/admin/changeState' , (req:any,res:any)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK && HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    apifunc.auth(con , username , password , res , "admin").then((result:any)=>{
      if(result['result'] === "pass") {
        if(req.body['ID'] && req.body['status'] != undefined) {
          con.query(`UPDATE acc_doctor SET status_account = ? WHERE id_doctor = ?;` , [(req.body['status'] == 1) ? 0 : 1 , req.body['ID']] , (err:any,result:any)=>{
            if(err) {
              dbpacket.dbErrorReturn(con , err , res)
              return 0
            }
  
            con.end()
  
            // console.log(result)
            if(result.changedRows == 1) res.send('1')
            else res.send('error')
          })
        } else {
          con.end()
          res.send('error ID or status')
        }
      }
    }).catch((err:any)=>{
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    })
  })
  
  app.post('/api/admin/delete' , (req:any , res:any)=>{
    let timeoutSession = 20
    if(req.body['ID'] &&
        req.session.checkDelete['value'] === process.env.KEY_SESSION + "delete" && 
        new Date().getTime() - req.session.checkDelete['time'] <= timeoutSession &&
        (req.hostname == HOST_CHECK || !HOST_CHECK)) {
      
      delete req.session.checkDelete
  
      let username = req.session.user_admin
      let password = req.session.pass_admin
  
      if(username === '' || password === '') {
        res.redirect('/api/logout')
        return 0
      }
  
      let con = Database.createConnection(listDB)
  
      apifunc.auth(con , username , password , res , "admin").then((result:any)=>{
        if(result['result'] === "pass") {
          con.query(`UPDATE acc_doctor SET status_delete = 1 WHERE id_doctor=?` , [req.body['ID']] , (err:any , result:any)=>{
            if(err) {
              dbpacket.dbErrorReturn(con , err , res)
              return 0
            }
      
            con.end()
            res.send('1')
          })
        }
  
      }).catch((err:any)=>{
        con.end()
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
  app.all('/api/admin/auth' , async (req:any , res:any)=>{
    
    // เช็คการเข้าสู่ระบบจริงๆ
    let username = req.session.user_admin ?? req.body['username'] ?? '';
    let password = req.session.pass_admin ?? req.body['password'] ?? '';
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK && HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    // Database.resume()
    try {
      let auth = await apifunc.auth(con , username , password , res , "admin")
      con.end()
      if(auth['result'] === "pass") {
        req.session.user_admin = username
        req.session.pass_admin = password
        res.send('1')
      }
    } catch (err : any) {
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      } else if( err == "connect" ) {
        res.redirect('/api/logout')
      }
    }
  })
  
  app.get('/api/logout' , (req:any , res:any) => {
    console.log('Logout')
    res.clearCookie('connect.sid').send('')
  })
}

  // app.post('/api/admin/chkOver' , (req:any , res:any)=>{
  //   let username = req.session.user_admin
  //   let password = req.session.pass_admin
  
  //   if(username === '' || password === '' || (req.hostname !== HOST_CHECK && HOST_CHECK)) {
  //     res.redirect('/api/logout')
  //     return 0
  //   }
  
  //   let con = Database.createConnection(listDB)
  
  //   apifunc.auth(con , username , password , res , "admin").then((result:any)=>{
  //     if(result['result'] === "pass") {
  //       if(req.body['ID']) {
  //         con.query(`SELECT id_doctor FROM acc_doctor WHERE id_doctor=?` , [req.body['ID']] , (err:any,result:any)=>{
  //           if(err) {
  //             dbpacket.dbErrorReturn(con , err , res)
  //             return 0
  //           }
  
  //           con.end()
            
  //           if(result[0]) res.send('over')
  //           else res.send('1')
  
  //         })
  //       } else {
  //         con.end()
  //         res.send('error ID')
  //       }
  //     }
  //   }).catch((err:any)=>{
  //     con.end()
  //     if(err == "not pass") {
  //       res.redirect('/api/logout')
  //     }
  //   })
  
  //   // con.connect((err:any) => {
  //   //   if(err) {
  //   //     dbpacket.dbErrorReturn(con , err , res:any)
  //   //     return 0
  //   //   }
  
  //   //   con.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err:any , result:any)=>{
  //   //     if (err) {
  //   //       dbpacket.dbErrorReturn(con , err , res:any)
  //   //       return 0
  //   //     };
    
  //   //     if(result[0]){
    
  //   //       if(req.body['ID']) {
  //   //         con.query(`SELECT id_doctor FROM acc_doctor WHERE id_doctor=?` , [req.body['ID']] , (err:any,result:any)=>{
  //   //           if(err) {
  //   //             dbpacket.dbErrorReturn(con , err , res:any)
  //   //             return 0
  //   //           }
  
  //   //           con.end()
              
  //   //           if(result[0]) res.send('over')
  //   //           else res.send('1')
  
  //   //         })
  //   //       } else {
  //   //         con.end()
  //   //         res.send('error ID')
  //   //       }
    
  //   //     } else {
  //   //       con.end()
  //   //       res.redirect('/api/logout')
  //   //     }
  //   //   })
  //   // })
  // })
  
  // check action of user
  // app.post('/api/admin/checkUserAction' , (req:any , res:any)=> {
  //   let username = req.session.user_admin ?? '';
  //   let password = req.body['password'] ?? '';
  
  //   if(username === '' || (req.hostname !== HOST_CHECK && HOST_CHECK)) {
  //     res.redirect('/api/logout')
  //     return 0
  //   }
  
  //   let con = Database.createConnection(listDB)
  
  //   con.connect((err:any)=>{
  //     if(err) {
  //       dbpacket.dbErrorReturn(con , err , res)
  //       return 0
  //     }
  
  //     con.query(`SELECT * FROM admin WHERE username=? AND password=SHA2( ? , 256)` , [username , password] , (err:any , result:any)=>{
  //       if (err) {
  //         dbpacket.dbErrorReturn(con , err , res)
  //         return 0
  //       };
    
  //       if(result[0]){
  //         console.log(req.session.checkADD)
  //         if(req.body['type'] == "add") 
  //             req.session.checkADD = 
  //                   {
  //                     value : process.env.KEY_SESSION + "add",
  //                     time : new Date().getTime()
  //                   }
  //         else if(req.body['type'] == "delete") 
  //             req.session.checkDelete = 
  //                   {
  //                     value : process.env.KEY_SESSION + "delete",
  //                     time : new Date().getTime()
  //                   }
  //         res.send('1')
  //       } else {
  //         res.send('incorrect')
  //       }
    
  //       con.end()
  //     })
  //   })
  // })


// import module express config
// const app = require('./apiDoctor')

// // module DB and connect DB
// const db = require('mysql')

// const dbpacket = require('./dbConfig')
// const listDB = dbpacket.listConfig()

// const apifunc = require('./apifunc')

// const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_NAMEDEV
// req
