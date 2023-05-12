require('dotenv').config().parsed
// import module express config
const app = require('./apiFarmer')

// module DB and connect DB
const db = require('mysql')
const dbpacket = require('./dbConfig')
const apifunc = require('./apifunc')

const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_NAMEDEV

// req
app.post('/api/docter/check' , (req , res)=>{
    res.redirect('/api/docter/auth');
})

app.post('/api/docter/checkline' , (req , res)=>{
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

app.post('/api/docter/savePersonal' , (req , res)=>{
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
                con.destroy()
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
                        req.session.user_docter = username
                        req.session.pass_docter = password
                        res.send('pass')
                    } else {
                        console.log("update error")
                        res.send('error')
                    }
                    con.destroy()
                })
            }
        }
    }).catch((err)=>{
        console.log(err)
        if(err == "not pass") {
            res.send('password')
            con.destroy()
        } else if( err == "connect" ) {
            res.redirect('/api/logout')
        }
    })
})

app.post('/api/docter/listFarmer' , (req , res)=>{
    let username = req.session.user_docter
    let password = req.session.pass_docter

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
                                `
                                    SELECT acc_farmer.id_table , acc_farmer.id_farmer , acc_farmer.fullname , acc_farmer.img  FROM acc_farmer , 
                                    (
                                        SELECT MAX(id_table) AS id_table , id_farmer , MAX(date_register) AS date_register
                                        FROM acc_farmer 
                                        WHERE station = "${result['data']['station_docter']}" and register_auth = 0 
                                        GROUP BY id_farmer 
                                        ORDER BY date_register
                                    ) AS MaxRowDate
                                    WHERE acc_farmer.id_table = MaxRowDate.id_table LIMIT 30;
                                ` : ""
            con.query(queryType , (err , result)=>{
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

app.post("/docter/api/docter/pull" , (req , res)=>{
    let username = req.session.user_docter
    let password = req.session.pass_docter

    if(username === '' || password === '' || req.hostname !== HOST_CHECK) {
        res.redirect('/api/logout')
        return 0
    }

    let con = db.createConnection(dbpacket.listConfig())

    apifunc.auth(con , username , password , res , "acc_docter").then((result)=>{
        if(result['result'] === "pass") {
            console.log(req.body['id'])
            con.query('SELECT id_farmer , id_docter , fullname , img , station , location , date_register FROM acc_farmer WHERE id_table=? and register_auth = 0' , 
            [req.body['id']] , (err , resul)=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("query");
                }

                if(resul[0]) {
                    console.log(resul[0])
                    res.send(resul[0])
                } else {
                    console.log('not found')
                    res.send('not found')
                }
            })
        }
    }).catch((err)=>{
        con.destroy()
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
    //     con.destroy()
    //     if(err == "not pass") {
    //         res.redirect('/api/logout')
    //     }
    // })
})

app.all('/api/docter/auth' , (req , res)=>{
  
    // เช็คการเข้าสู่ระบบจริงๆ
    let username = req.session.user_docter ?? req.body['username'] ?? '';
    let password = req.session.pass_docter ?? req.body['password'] ?? '';

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
                req.session.user_docter = username
                req.session.pass_docter = password
                res.send('pass')
            } else {
                res.send(`wait:${username}`)
            }
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

module.exports = app