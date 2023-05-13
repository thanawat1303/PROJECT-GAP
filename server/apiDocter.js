require('dotenv').config().parsed

// import module express config
const app = require('./apiFarmer')

// module DB and connect DB
const db = require('mysql')

const dbpacket = require('./dbConfig')
const apifunc = require('./apifunc')

const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_NAMEDEV

// req
app.post('/api/doctor/check' , (req , res)=>{
    res.redirect('/api/doctor/auth');
})

app.post('/api/doctor/checkline' , (req , res)=>{
    let con = db.createConnection(dbpacket.listConfig())
    con.connect((err)=>{
        if (err) {
            dbpacket.dbErrorReturn(con, err, res);
            console.log("connect");
            return 0;
        }

        con.query(`SELECT id_docter FROM acc_docter WHERE uid_line_docter=${req.body['id']}` , (err , result)=>{
            if (err) {
                dbpacket.dbErrorReturn(con, err, res);
                console.log("query");
            }

            if (result[0]) {
                res.send(result[0]['id_docter'])
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

    let con = db.createConnection(dbpacket.listConfig())

    // db.resume()

    apifunc.auth(con , username , password , res , "acc_docter").then((result)=>{
        if(result['result'] === "pass") {
            if (result['data']['status_account'] == 0
                    || result['data']['status_delete'] == 1) {
                con.end()
                res.send('account')
            }
            else {
                let fullname = req.body['firstname'] + " " + req.body['lastname']
                con.query(`UPDATE acc_docter SET fullname_docter=? , station_docter=? WHERE id_docter = ?`
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

app.post('/api/doctor/listFarmer' , (req , res)=>{
    let username = req.session.user_doctor
    let password = req.session.pass_doctor

    if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
        res.redirect('/api/logout')
        return 0
    }

    let con = db.createConnection(dbpacket.listConfig())

    apifunc.auth(con , username , password , res , "acc_docter").then((result)=>{
        if(result['result'] === "pass") {
            let queryType = (req.body['type'] === 'list') ? 
                                `SELECT id_table , id_farmer , fullname , img FROM acc_farmer WHERE station = "${result['data']['station_docter']}" and register_auth = 1 LIMIT 30;` :
                            (req.body['type'] === 'push') ? 
                                `SELECT id_table , fullname , img , date_register FROM acc_farmer WHERE station = "${result['data']['station_docter']}" and register_auth = 0 ORDER BY date_register DESC LIMIT 30;` : ""
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

    let con = db.createConnection(dbpacket.listConfig())

    apifunc.auth(con , username , password , res , "acc_docter").then((result)=>{
        if(result['result'] === "pass") {
            con.query('SELECT fullname , img , location , date_register FROM acc_farmer WHERE id_table=? and register_auth = 0 ORDER BY date_register DESC' , 
            [req.body['id']] , (err , resul)=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("query");
                }

                if(resul[0]) {
                    res.send(resul[0])
                } else {
                    res.send('not found')
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

    // apifunc.auth(con , username , password , res , "acc_docter").then((result)=>{
    //     if(result['result'] === "pass") {
    //         con.query('UPDATE acc_farmer SET id_docter = ? , register_auth = 1 WHERE register_auth = 0;' , 
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

app.post('/doctor/api/doctor/confirmAcc' , (req , res)=>{
    let username = req.session.user_doctor
    let password = req.body['password']

    if(username === '' || req.hostname !== HOST_CHECK) {
        res.redirect('/api/logout')
        return 0
    }

    let con = db.createConnection(dbpacket.listConfig())

    apifunc.auth(con , username , password , res , "acc_docter").then((result)=>{
        if(result['result'] === "pass") {
            con.query(`
                        UPDATE acc_farmer SET register_auth=? , id_docter=? , id_farmer=?
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

app.all('/api/doctor/auth' , (req , res)=>{
  
    // เช็คการเข้าสู่ระบบจริงๆ
    let username = req.session.user_doctor ?? req.body['username'] ?? '';
    let password = req.session.pass_doctor ?? req.body['password'] ?? '';

    if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
        res.redirect('/api/logout')
        return 0
    }

    let con = db.createConnection(dbpacket.listConfig())

    // db.resume()

    apifunc.auth(con , username , password , res , "acc_docter").then((result)=>{
        if(result['result'] === "pass") {
            if (result['data']['status_account'] == 0
                    || result['data']['status_delete'] == 1) {
                res.send('account')
            }
            else if(result['data']['fullname_docter'] 
                    && result['data']['station_docter']) {
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

module.exports = app