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
                    SELECT fullname_doctor , img_doctor , status_delete , status_account
                    FROM acc_doctor
                    WHERE id_doctor=?; 
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
                                    SELECT acc_farmer.id_farmer , acc_farmer.fullname , acc_farmer.img FROM acc_farmer , 
                                        (
                                            SELECT MAX(id_table) AS id_table , id_farmer , MAX(date_register) AS date_register
                                            FROM acc_farmer 
                                            WHERE station = "${result['data']['station_doctor']}" and register_auth = 1 
                                            GROUP BY id_farmer 
                                            ORDER BY date_register
                                        ) AS MaxRowDate
                                    WHERE acc_farmer.id_table = MaxRowDate.id_table LIMIT 30;
                                    ` 
                                    :
                                (req.body['type'] === 'push') ? 
                                    `
                                    SELECT acc_farmer.id_table , acc_farmer.fullname , acc_farmer.img , acc_farmer.date_register , LineID.countID
                                    FROM acc_farmer , (
                                        SELECT MAX(date_register) as DateLast , uid_line , MAX(id_table) as id_table , COUNT(uid_line) as countID
                                        FROM acc_farmer 
                                        WHERE station = "${result['data']['station_doctor']}" and register_auth = 0 
                                        GROUP BY uid_line
                                    ) AS LineID
                                    WHERE acc_farmer.id_table=LineID.id_table and acc_farmer.date_register=LineID.DateLast
                                    ORDER BY acc_farmer.date_register 
                                    DESC LIMIT 30;
                                    ` 
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
                con.query('SELECT fullname , id_farmer , id_doctor , img , location , station , date_register , uid_line FROM acc_farmer WHERE id_table=? and register_auth = ? ORDER BY date_register DESC' , 
                [req.body['id'] , (req.body['type']) ? 1 : 0] , (err , resul)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                    }

                    con.end()
                    res.send(resul[0])
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
                if(req.body['ans']) {
                    con.query(`
                            SELECT id_table , uid_line
                            FROM acc_farmer 
                            WHERE id_farmer=? 
                                and register_auth=1 
                                and UNIX_TIMESTAMP(date_register) < UNIX_TIMESTAMP(?)
                                and station = ?
                        `   , [req.body['farmer'] , req.body['date'] , req.body['station']]
                            , (err , resultOn)=>{
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log("query");
                                }

                                let arrayID = resultOn.map(item => item.id_table)
                                let uid_line = resultOn.map(item => item.uid_line)
                                con.query(`
                                    SELECT id_table , uid_line
                                    FROM acc_farmer 
                                    WHERE id_farmer=? 
                                        and register_auth=1 
                                        and UNIX_TIMESTAMP(date_register) > UNIX_TIMESTAMP(?)
                                        and station = ?
                                    ORDER BY date_register DESC;
                                ` 
                                , [req.body['farmer'] , req.body['date'] , req.body['station']]
                                , (err , ObThan)=>{
                                    if (err) {
                                        dbpacket.dbErrorReturn(con, err, res);
                                        console.log("query");
                                    }

                                    let idLast = "" , idLineLast = "" , checkQuery = 0
                                    if(ObThan.length > 0) {
                                        arrayID = arrayID.concat(ObThan.filter((val , index) => index > 0)
                                                        .map(item => item.id_table) , [req.body['id']]).join(', ')
                                        uid_line = uid_line.concat(ObThan.filter((val , index) => index > 0)
                                                        .map(item => item.uid_line) , [req.body['uid_line']])

                                        idLast = ObThan.filter((val , index) => index == 0)
                                                        .map(item => item.id_table).join("")
                                        idLineLast = ObThan.filter((val , index) => index == 0)
                                                        .map(item => item.uid_line).join("")
                                    } else {
                                        arrayID = arrayID.join(', ')

                                        idLast = req.body['id']
                                        idLineLast = req.body['uid_line']
                                    }
                                    if(arrayID) { //unconnect user
                                        con.query(
                                            `
                                                UPDATE acc_farmer 
                                                SET register_auth=2 , id_farmer = ?
                                                WHERE id_table IN (${arrayID}) 
                                                    and (register_auth=1 or register_auth=0)
                                                    and station = ?
                                            `
                                            , [req.body['farmer'] , req.body['station']]
                                            , (err , resultAll) => {
                                                checkQuery+=1
                                                if(checkQuery == 3) {
                                                    con.end()
                                                    res.send("complete")
                                                }
                                            })
                                    }

                                    let Uid_line_query = uid_line.join(', ')
                                    if(Uid_line_query) {
                                        con.query(
                                            `
                                                UPDATE formplant 
                                                SET id_uid_line=?
                                                WHERE id_uid_line IN (${Uid_line_query})
                                            `
                                            , [idLineLast]
                                            , (err , resultAll) => {
                                                checkQuery+=1
                                                if(checkQuery == 3) {
                                                    con.end()
                                                    res.send("complete")
                                                }
                                            })
                                    }
                                    con.query(
                                        `
                                            UPDATE acc_farmer 
                                            SET register_auth=1 , id_doctor=? , date_doctor_confirm=? , id_farmer = ?
                                            WHERE id_table=? and register_auth = 0
                                        `
                                        , [ username ,  , new Date() , req.body['farmer'] , idLast]
                                        , (err , resultAll) => {
                                            checkQuery+=1
                                            if(checkQuery == 3) {
                                                con.end()
                                                res.send("complete")
                                            }
                                        })

                                    console.log(arrayID)
                                    console.log(uid_line)
                                })
                            })
                } else {
                    con.query(`
                            UPDATE acc_farmer 
                            SET register_auth=3 , id_doctor=? , uid_line="" , date_doctor_confirm=?
                            WHERE id_table=? and register_auth = 0`
                            , [ username , new Date() , req.body['id']]
                            , (err , result)=>{
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log("query");
                                }
    
                                if(result.changedRows == 1) {
                                    con.end()
                                    if(req.body['uid_line']) {
                                        // unconnect form save before and Uid_line of req.body['uid_line']
                                    }
                                    res.send('complete')
                                } 
                                else res.send('not found')
                            })
                }
                
                // con.query(`UPDATE acc_farmer SET register_auth=3 , id_doctor=?
                //             WHERE id_table != ? and register_auth = 0 and uid_line=?` 
                // , [username , req.body['id'] , req.body['uid_line']] 
                // , (err , result)=>{
                //     if (err) {
                //         dbpacket.dbErrorReturn(con, err, res);
                //         console.log("query");
                //     }

                //     if(result.changedRows == (req.body['count'] - 1)) {
                        
                //     }
                // })
            }
        }).catch((err)=>{
            con.end()
            if(err == "not pass") {
                res.send('account not pass')
            }
        })
    })
    
    app.post('/api/doctor/listForm' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                con.query(`
                            SELECT formplant.id_plant , formplant.type_plant , formplant.date_plant , 
                            acc_farmer.id_farmer , acc_farmer.fullname   
                            FROM formplant , 
                                (
                                    SELECT id_farmer , uid_line , fullname FROM acc_farmer 
                                    WHERE station = ? and register_auth = 1
                                ) AS acc_farmer
                            WHERE formplant.id_uid_line = acc_farmer.uid_line and formplant.submit_plant=?
                            ORDER BY date_plant 
                            LIMIT 30;
                            ` , 
                            [ result['data']['station_doctor'] , req.body['type']] , (err , listFarm)=>{
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log("query");
                                }
                                con.end()
                                res.send(listFarm)
                            })
            }
        }).catch((err)=>{
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        })
    })

}