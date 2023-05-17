module.exports = apiDoctor = (app , Database , apifunc , HOST_CHECK , dbpacket , listDB) => {

    require('dotenv').config().parsed

    app.post('/api/doctor/check' , (req , res)=>{
        res.redirect('/api/doctor/auth');
    })
    
    app.post('/api/doctor/checkline' , (req , res)=>{
        let con = Database.createConnection(listDB)
        con.connect((err)=>{
            if (err) {
                dbpacket.dbErrorReturn(con, err, res);
                console.log("connect");
                return 0;
            }
    
            con.query(`SELECT id_doctor FROM acc_doctor WHERE uid_line_doctor=${req.body['id']}` , (err , result)=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("query");
                }
    
                if (result[0]) {
                    res.send(result[0]['id_doctor'])
                } else {
                    res.send('')
                }
            })
        })
    })
    
    app.post('/api/doctor/savePersonal' , (req , res)=>{
        let username = req.body['username'] ?? '';
        let password = req.body['password'] ?? '';
    
        if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        // Database.resume()
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                if (result['data']['status_account'] == 0
                        || result['data']['status_delete'] == 1) {
                    con.end()
                    res.send('account')
                }
                else {
                    let fullname = req.body['firstname'] + " " + req.body['lastname']
                    con.query(`UPDATE acc_doctor SET fullname_doctor=? , station_doctor=? WHERE id_doctor = ?`
                    , [fullname , req.body['station'] , username]
                    , (err , val)=>{
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("query");
                        }
                        console.log(val)
                        if(val['changedRows'] == 1){
                            req.session.user_doctor = username
                            req.session.pass_doctor = password
                            res.send('pass')
                        } else {
                            console.log("update error")
                            res.send('error')
                        }
                        con.end()
                    })
                }
            }
        }).catch((err)=>{
            console.log(err)
            if(err == "not pass") {
                res.send('password')
                con.end()
            } else if( err == "connect" ) {
                res.redirect('/api/logout')
            }
        })
    })
    
    app.all('/api/doctor/auth' , (req , res)=>{
      
        // เช็คการเข้าสู่ระบบจริงๆ
        let username = req.session.user_doctor ?? req.body['username'] ?? '';
        let password = req.session.pass_doctor ?? req.body['password'] ?? '';
    
        if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        // Database.resume()
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                if (result['data']['status_account'] == 0
                        || result['data']['status_delete'] == 1) {
                    res.send('account')
                }
                else if(result['data']['fullname_doctor'] 
                        && result['data']['station_doctor']) {
                    req.session.user_doctor = username
                    req.session.pass_doctor = password
                    res.send('pass')
                } else {
                    res.send(`wait:${username}`)
                }
            }
            con.end()
        }).catch((err)=>{
            if(err == "not pass") {
            res.redirect('/api/logout')
            con.end()
            } else if( err == "connect" ) {
            res.redirect('/api/logout')
            }
        })
    
    })
    
    // req manager farmer
    app.post('/api/doctor/approverFm' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
            res.redirect('/api/logout')
            return 0
        }
    เกษตร
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                con.query(`
                    SELECT fullname_doctor , img_doctor 
                    FROM acc_doctor
                    WHERE id_doctor=? and status_delete=0 and status_account=1; 
                ` , [req.body['id']] , (err , profile)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                    }
                    con.end()
                    res.send(profile)
                })
            }
        }).catch((err)=>{
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        })
    })
    
    app.post('/api/doctor/listFarmer' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                let queryType = (req.body['type'] === 'list') ? 
                                    `
                                    SELECT acc_farmer.id_farmer , acc_farmer.fullname , acc_farmer.img , MaxRowDate.CountFM  FROM acc_farmer , 
                                        (
                                            SELECT MAX(id_table) AS id_table , id_farmer , COUNT(id_farmer) AS CountFM , MAX(date_register) AS date_register
                                            FROM acc_farmer 
                                            WHERE station = "${result['data']['station_doctor']}" and register_auth = 1 
                                            GROUP BY id_farmer 
                                            ORDER BY date_register
                                        ) AS MaxRowDate
                                    WHERE acc_farmer.id_table = MaxRowDate.id_table LIMIT 30;
                                    ` 
                                    :
                                (req.body['type'] === 'push') ? 
                                    `SELECT id_table , fullname , img , date_register FROM acc_farmer WHERE station = "${result['data']['station_doctor']}" and register_auth = 0 ORDER BY date_register DESC LIMIT 30;` 
                                    : 
                                (req.body['type'] === 'profile') ? 
                                    `SELECT id_table , date_register FROM acc_farmer WHERE station = "${result['data']['station_doctor']}" and register_auth = 1 and id_farmer=${req.body['farmer']} ORDER BY date_register DESC;` : ""
                con.query(queryType , (err , result)=>{
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
    
    app.post("/doctor/api/doctor/pull" , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                con.query('SELECT fullname , id_farmer , id_doctor , img , location , date_register FROM acc_farmer WHERE id_table=? and register_auth = ? ORDER BY date_register DESC' , 
                [req.body['id'] , (req.body['type']) ? 1 : 0] , (err , resul)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                    }
    
                    if(resul[0]) {
                        res.send(resul[0])
                    } else {
                        res.send([])
                    }
    
                    con.end()
                })
            }
        }).catch((err)=>{
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        })
    
        // apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
        //     if(result['result'] === "pass") {
        //         con.query('UPDATE acc_farmer SET id_doctor = ? , register_auth = 1 WHERE register_auth = 0;' , 
        //         [username] , (err , resul)=>{
    
        //         })
        //     }
        // }).catch((err)=>{
        //     con.end()
        //     if(err == "not pass") {
        //         res.redirect('/api/logout')
        //     }
        // })
    })
    
    app.post('/doctor/api/doctor/confirmFm' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body['password']
    
        if(username === '' || req.hostname !== HOST_CHECK) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                con.query(`
                            UPDATE acc_farmer SET register_auth=? , id_doctor=? , id_farmer=?
                            WHERE id_table=? and register_auth = 0`
                            , [req.body['ans'] ? 1 : 3 , username , req.body['farmer'] , req.body['id']]
                            , (err , result)=>{
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log("query");
                                }
    
                                if(result.changedRows == 1) {
                                    // con.query(`UPDATE acc_farmer SET register_auth=3 WHERE date_register < ? and id_table < ?` , [])
                                    con.end()
                                    if(req.body['ans']) {
                                        // add Line
                                    } else {
                                        // unconnect form save before
                                    }
                                    res.send('complete')
                                } 
                                else res.send('not found')
                            })
            }
        }).catch((err)=>{
            con.end()
            if(err == "not pass") {
                res.send('account not pass')
            }
        })
    })
    
    app.post('/api/doctor/listForm' , (req , res)=>{
        console.log("connect")
    })

}