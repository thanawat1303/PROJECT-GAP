require('dotenv').config().parsed
module.exports = function apiAdmin (app , Database , apifunc , HOST_CHECK , dbpacket , listDB) {
  app.post('/api/admin/check' , (req , res)=>{
    console.log(req.hostname);
    res.redirect('/api/admin/auth');
  })
  
// doctor page
  app.post('/api/admin/doctor/list' , (req , res)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    apifunc.auth(con , username , password , res , "admin").then((result)=>{
      if(result['result'] === "pass") {
        let data = req.body
        let select = data.typeDelete === 0 ? ", status_account" : ""
        con.query(
          `
            SELECT 
            (
              SELECT name FROM station_list WHERE acc_doctor.station_doctor=station_list.id
            ) as station
            , id_table_doctor , fullname_doctor , id_doctor , img_doctor ${select}
            FROM acc_doctor
            WHERE status_delete=? LIMIT 25;
          ` 
        , 
        [data.typeDelete] ,
        (err , result)=>{
          if (err){
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          };
  
          con.end()
          res.send(result)
        })
      }
    }).catch((err)=>{
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    })
  })

  app.post('/api/admin/doctor/get' , async (req , res)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    try {
      const auth = await apifunc.auth(con , username , password , res , "admin")
      if(auth['result'] === "pass") {
        let data = req.body
        con.query(
          `
            SELECT 
            (
                SELECT name FROM station_list WHERE acc_doctor.station_doctor=station_list.id
            ) as station , id_table_doctor , fullname_doctor , id_doctor , img_doctor , status_account , status_delete
            FROM acc_doctor
            WHERE id_table_doctor=? LIMIT 25;
          ` 
        , 
        [data.id_table] ,
        (err , result)=>{
          if (err){
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          };
  
          con.end()
          res.send(result)
        })
      }
    } catch (err) {
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    }
  })

  app.post('/api/admin/doctor/because/get' , async (req , res)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    try {
      const auth = await apifunc.auth(con , username , password , res , "admin")
      if(auth['result'] === "pass") {
        let data = req.body
        const type_status = data.type_status === "status_account" ? "status" : 
                              data.type_status === "status_delete" ? "delete" : "";
        if(type_status && data.id_table) {
          con.query(
            `
              SELECT * 
              FROM because_${type_status}
              WHERE id_table_doctor=?
              ORDER BY date DESC;
            ` 
          , 
          [data.id_table] ,
          (err , result)=>{
            if (err){
              dbpacket.dbErrorReturn(con , err , res)
              return 0
            };
    
            con.end()
            res.send(result)
          })
        }
      }
    } catch (err) {
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    }
  })

  app.post('/api/admin/add' , async (req , res)=>{
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
                    ` , 
          [req.body['id_doctor']] , 
          (err , account)=>{

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
                (err , result)=>{
                  if(err) {
                    dbpacket.dbErrorReturn(con , err , res)
                    console.log("insert doctor")
                    return 0
                  }
                  con.end()
                  res.send(result.affectedRows.toString())
              })
            }
          })   
        }
      } catch (err) {
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

  app.post('/api/admin/manage/doctor' , async (req,res)=>{
    let username = req.session.user_admin
    let password = req.body['password']
  
    if(username === '' || (req.hostname !== HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    try {
      const auth = await apifunc.auth(con , username , password , res , "admin")
      if(auth['result'] === "pass") {
        if(req.body['id_table'] != undefined && (req.body['status'] === 1 || req.body['status'] === 0) && req.body['type_status']) {
          const type_status = req.body['type_status'] === "status_account" ? "status" : 
                              req.body['type_status'] === "status_delete" ? "delete" : "";
          if(type_status) {
            con.query(
              `
              SELECT id_table_doctor 
              FROM acc_doctor 
              WHERE id_table_doctor = ? and status_delete = 0
              `
              , [ req.body['id_table'] ] , (err , deleteResult) => {
                if(err) {
                  dbpacket.dbErrorReturn(con , err , res)
                  console.log(`select check err`)
                  return 0
                }

                if(deleteResult.length) {
                  con.query(
                    `
                      INSERT INTO because_${type_status} 
                      (id_table_doctor , id_admin , because_text , date ${type_status === "status" ? ", type_status" : ""}) VALUES 
                      (? , ? , ? , ? ${type_status === "status" ? `, "${req.body['status']}"` : ""});
                    ` , [ req.body['id_table'] , username , req.body['because'] , new Date()] ,
                    (err , resultBecause) => {
                      if(err) {
                        dbpacket.dbErrorReturn(con , err , res)
                        console.log("insert change status doctor")
                        return 0
                      }
                      if(resultBecause.affectedRows) {
                        con.query(`
                            UPDATE acc_doctor 
                            SET ${req.body['type_status']} = ? 
                            WHERE id_table_doctor = ? ${type_status === "delete" ? "and status_delete = 0" : ""};` , 
                          [req.body['status'] , req.body['id_table']] , 
                          (err,result)=>{
                            if(err) {
                              dbpacket.dbErrorReturn(con , err , res)
                              console.log(`UPDATE ${type_status} err`)
                              return 0
                            }

                            con.end()
                            res.send("133")
                          })
                      } else {
                        con.end()
                        res.send("because")
                      }
                    }
                  )
                }
                else res.send("delete")
              }
            )
          }
        } else {
          con.end()
          res.send('error ID or status')
        }
      }
    }catch(err) {
      con.end()
      if(err == "not pass") {
        res.send("password")
      }
    }
  })

// data page
  app.post('/api/admin/data/list' , async (req , res)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
    let con = Database.createConnection(listDB)
    try {
      const auth = await apifunc.auth(con , username , password , res , "admin")
      if(auth['result'] === "pass") {
        let data = req.body
        con.query(
          `
          SELECT * FROM ${data.type}_list LIMIT 25;
          `
         , (err , result)=>{
          if(err) {
            dbpacket.dbErrorReturn(con , err , res)
            console.log(`select ${data.type} err`)
            return 0
          }
          con.end()
          res.send(result)
         })
      }
    } catch (err) {
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    }
  })

  app.post('/api/admin/data/get' , async (req , res)=>{
    let username = req.session.user_admin
    let password = req.session.pass_admin
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    try {
      const auth = await apifunc.auth(con , username , password , res , "admin")
      if(auth['result'] === "pass") {
        let data = req.body
        con.query(
          `
            SELECT * FROM ${data.type}_list WHERE id=?
          ` 
        , 
        [data.id] ,
        (err , result)=>{
          if (err){
            dbpacket.dbErrorReturn(con , err , res)
            return 0
          };
  
          con.end()
          res.send(result)
        })
      }
    } catch (err) {
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      }
    }
  })

  app.post('/api/admin/data/insert' , async (req , res)=>{
    if(req.body.passwordAd && req.body.type && req.hostname == HOST_CHECK) {
        
      let username = req.session.user_admin
      let password = req.body.passwordAd
  
      if(username === '') {
        res.redirect('/api/logout')
        return 0
      }
  
      let con = Database.createConnection(listDB)
  
      try {
        let auth = await apifunc.auth(con , username , password , res , "admin")
        if(auth['result'] === "pass") {
          let data = req.body
          con.query(
            `
            SELECT * FROM ${data.type}_list WHERE name=? and is_use = 1;
            `
            ,[ data.name ], (err , result)=>{
            if(err) {
              dbpacket.dbErrorReturn(con , err , res)
              console.log(`select ${data.type} err`)
              return 0
            }

            if(!result.length) {
              con.query(`
                          INSERT INTO ${data.type}_list 
                          (
                            name , 
                            is_use 
                            ${
                              data.type === "plant" ? ", type_plant" : 
                              data.type === "station" ? ", location" : ""
                            }
                          ) 
                          VALUES 
                          (
                            ? , 
                            1 
                            ${
                              data.type === "plant" ? `, '${data.type_plant}'` :
                              data.type === "station" ? `, POINT(${data.lat},${data.lng})` : ""
                            }
                          )` , 
              [ data.name ] , (err , insert)=>{
                if(err) {
                  dbpacket.dbErrorReturn(con , err , res)
                  console.log(`insert ${data.type} err`)
                  return 0
                }
                
                con.end()
                res.send(insert.affectedRows.toString())
              })
            } else {
              con.end()
              res.send("overflow")
            }
          })  
        }
      } catch (err) {
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

  app.post('/api/admin/data/change' , async (req , res)=>{
    let username = req.session.user_admin
    let password = req.body['password']
  
    if(username === '' || (req.hostname !== HOST_CHECK)) {
      res.redirect('/api/logout')
      return 0
    }
  
    let con = Database.createConnection(listDB)
  
    try {
      const auth = await apifunc.auth(con , username , password , res , "admin")
      if(auth['result'] === "pass") {
        let data = req.body
        if(data.type === "station" || data.type === "plant") {
          con.query(
            `
            UPDATE ${data.type}_list SET is_use = ? WHERE id = ?;
            `
            , [ data.state_use , data.id_table] , (err , result)=>{
            if(err) {
              dbpacket.dbErrorReturn(con , err , res)
              console.log(`change ${data.type} err`)
              return 0
            }
            con.end()
            res.send("133")
          })
        } else res.send("no")
      }
    } catch (err) {
      con.end()
      if(err == "not pass") {
        res.send("password")
      }
    }
  })
  
  // app.post('/api/admin/delete' , (req , res)=>{
  //   let timeoutSession = 20
  //   if(req.body['ID'] &&
  //       req.session.checkDelete['value'] === process.env.KEY_SESSION + "delete" && 
  //       new Date().getTime() - req.session.checkDelete['time'] <= timeoutSession &&
  //       (req.hostname == HOST_CHECK || !HOST_CHECK)) {
      
  //     delete req.session.checkDelete
  
  //     let username = req.session.user_admin
  //     let password = req.session.pass_admin
  
  //     if(username === '' || password === '') {
  //       res.redirect('/api/logout')
  //       return 0
  //     }
  
  //     let con = Database.createConnection(listDB)
  
  //     apifunc.auth(con , username , password , res , "admin").then((result)=>{
  //       if(result['result'] === "pass") {
  //         con.query(`UPDATE acc_doctor SET status_delete = 1 WHERE id_doctor=?` , [req.body['ID']] , (err , result)=>{
  //           if(err) {
  //             dbpacket.dbErrorReturn(con , err , res)
  //             return 0
  //           }
      
  //           con.end()
  //           res.send('1')
  //         })
  //       }
  
  //     }).catch((err)=>{
  //       con.end()
  //       if(err == "not pass") {
  //         res.redirect('/api/logout')
  //       }
  //     })
  //   }
    
  //   else {
  //     delete req.session.checkDelete
  //     res.send('error session')
  //   }
  
  // })

  // check Login
  app.all('/api/admin/auth' , async (req , res)=>{
    
    // เช็คการเข้าสู่ระบบจริงๆ
    let username = req.session.user_admin ?? req.body['username'] ?? '';
    let password = req.session.pass_admin ?? req.body['password'] ?? '';
  
    if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
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
    } catch (err) {
      con.end()
      if(err == "not pass") {
        res.redirect('/api/logout')
      } else if( err == "connect" ) {
        res.redirect('/api/logout')
      }
    }
  })
  
  app.get('/api/logout' , (req , res) => {
    res.clearCookie('connect.sid').send('')
  })
}

  // app.post('/api/admin/chkOver' , (req , res)=>{
  //   let username = req.session.user_admin
  //   let password = req.session.pass_admin
  
  //   if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
  //     res.redirect('/api/logout')
  //     return 0
  //   }
  
  //   let con = Database.createConnection(listDB)
  
  //   apifunc.auth(con , username , password , res , "admin").then((result)=>{
  //     if(result['result'] === "pass") {
  //       if(req.body['ID']) {
  //         con.query(`SELECT id_doctor FROM acc_doctor WHERE id_doctor=?` , [req.body['ID']] , (err,result)=>{
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
  //   }).catch((err)=>{
  //     con.end()
  //     if(err == "not pass") {
  //       res.redirect('/api/logout')
  //     }
  //   })
  
  //   // con.connect((err) => {
  //   //   if(err) {
  //   //     dbpacket.dbErrorReturn(con , err , res)
  //   //     return 0
  //   //   }
  
  //   //   con.query(`SELECT * FROM admin WHERE username=? AND password=?` , [username , password] , (err , result)=>{
  //   //     if (err) {
  //   //       dbpacket.dbErrorReturn(con , err , res)
  //   //       return 0
  //   //     };
    
  //   //     if(result[0]){
    
  //   //       if(req.body['ID']) {
  //   //         con.query(`SELECT id_doctor FROM acc_doctor WHERE id_doctor=?` , [req.body['ID']] , (err,result)=>{
  //   //           if(err) {
  //   //             dbpacket.dbErrorReturn(con , err , res)
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
  // app.post('/api/admin/checkUserAction' , (req , res)=> {
  //   let username = req.session.user_admin ?? '';
  //   let password = req.body['password'] ?? '';
  
  //   if(username === '' || (req.hostname !== HOST_CHECK)) {
  //     res.redirect('/api/logout')
  //     return 0
  //   }
  
  //   let con = Database.createConnection(listDB)
  
  //   con.connect((err)=>{
  //     if(err) {
  //       dbpacket.dbErrorReturn(con , err , res)
  //       return 0
  //     }
  
  //     con.query(`SELECT * FROM admin WHERE username=? AND password=SHA2( ? , 256)` , [username , password] , (err , result)=>{
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