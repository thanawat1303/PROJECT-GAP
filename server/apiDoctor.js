require('dotenv').config().parsed
const wordcut = require('thai-wordcut')
const https = require('https');
wordcut.init()

const {Server} = require('socket.io')
const LINE = require('./configLine')
const io = new Server()

module.exports = function apiDoctor (app , Database , apifunc , HOST_CHECK , dbpacket , listDB , socket = io , Line = LINE) {

    app.post('/api/doctor/check' , (req , res)=>{
        res.redirect('/api/doctor/auth');
    })

    app.get('/api/doctor/name' , (req , res)=>{
      
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            con.end()
            res.send(result['data'].fullname_doctor)
        }).catch((err)=>{
            if(err == "not pass") {
                con.end()
                res.redirect('/api/logout')
            } else if( err == "connect" ) {
                res.redirect('/api/logout')
            }
        })
    })

    app.get('/api/doctor/profile/get' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            con.query(
                `
                SELECT name
                FROM station_list
                WHERE id = ?
                ` , [result['data'].station_doctor] , 
                (err , station) => {
                    con.end()
                    res.send({
                        ...result['data'] ,
                        name_station : station[0].name
                    })
                }
            )
        }).catch((err)=>{
            if(err == "not pass") {
                con.end()
                res.redirect('/api/logout')
            } else if( err == "connect" ) {
                res.redirect('/api/logout')
            }
        })
    })

    app.post('/api/doctor/profile/image/edit' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            con.query(
                `
                UPDATE acc_doctor
                SET img_doctor = ?
                WHERE id_table_doctor = ?
                ` , [ req.body.img , result["data"].id_table_doctor ] , 
                (err , resultEdit) => {
                    con.end()
                    res.send("1")
                }
            )
        }).catch((err)=>{
            if(err == "not pass") {
                con.end()
                res.redirect('/api/logout')
            } else if( err == "connect" ) {
                res.redirect('/api/logout')
            }
        })
    })

    app.post('/api/doctor/profile/text/edit' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            const SET = req.body.type === "name" ? "fullname_doctor = ?" :
                            req.body.type === "station" ? "station_doctor = ?" :
                            req.body.type === "passwordNew" ? "password_doctor = SHA2( ? , 256)" : ""
            if(SET) {
                con.query(
                    `
                    UPDATE acc_doctor
                    SET ${SET}
                    WHERE id_table_doctor = ?
                    ` , [ req.body.value , result["data"].id_table_doctor ] , 
                    (err , resultEdit) => {
                        if(!err) {
                            if(req.body.type === "passwordNew") {
                                req.session.pass_doctor = req.body.value
                            }
                            con.end()
                            res.send("1")
                        } else {
                            con.end()
                            res.send("")
                        }
                    }
                )
            } else {
                res.send("")
            }
        }).catch((err)=>{
            if(err == "not pass") {
                con.end()
                res.send('password')
            } else if( err == "connect" ) {
                res.send("")
            }
        })
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
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
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
                            return 0
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
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
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
                con.end()
                res.redirect('/api/logout')
            } else if( err == "connect" ) {
                res.redirect('/api/logout')
            }
        })
    
    })

    app.post('/api/doctor/station/list' , (req , res)=>{
        let con = Database.createConnection(listDB)
        con.connect(( err )=>{
            if (err) {
                dbpacket.dbErrorReturn(con, err, res);
                console.log("connect");
                return 0;
            }

            con.query(`SELECT * FROM station_list WHERE is_use = 1` , (err , result)=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("query");
                    return 0
                }
                con.end()
                res.send(result)
                
            })
        })
    })

    app.post('/api/doctor/plant/list' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT name , 
                    (
                        SELECT COUNT(name_plant)
                        FROM formplant , 
                            (
                                SELECT id_farmHouse 
                                FROM housefarm , 
                                    (
                                        SELECT uid_line , link_user
                                        FROM acc_farmer
                                        WHERE (register_auth = 0 OR register_auth = 1) and station = ?
                                    ) as farmer
                                WHERE housefarm.uid_line = farmer.uid_line OR housefarm.link_user = farmer.link_user
                            ) as house
                        WHERE formplant.name_plant = plant_list.name and house.id_farmHouse = formplant.id_farmHouse
                    ) as countPlant
                    FROM plant_list
                    WHERE is_use = 1
                    ORDER BY name
                    ` , [result.data.station_doctor]
                    , (err , result)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                        return 0
                    }
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
    
    // req manager farmer
    // app.post('/api/doctor/farmer/approv' , (req , res)=>{
    //     let username = req.session.user_doctor
    //     let password = req.session.pass_doctor
    
    //     if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
    //         res.redirect('/api/logout')
    //         return 0
    //     }

    //     let con = Database.createConnection(listDB)
    
    //     apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
    //         if(result['result'] === "pass") {
    //             con.query(`
    //                 SELECT fullname_doctor , img_doctor , status_delete , status_account
    //                 FROM acc_doctor
    //                 WHERE id_doctor=?; 
    //             ` , [req.body['id']] , (err , profile)=>{
    //                 if (err) {
    //                     dbpacket.dbErrorReturn(con, err, res);
    //                     console.log("query");
    //                 }
    //                 con.end()
    //                 res.send(profile)
    //             })
    //         }
    //     }).catch((err)=>{
    //         con.end()
    //         if(err == "not pass") {
    //             res.redirect('/api/logout')
    //         }
    //     })
    // })

    app.post('/api/doctor/farmer/get/count' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                const queryType = req.body.auth === 1 ?
                                    `
                                    SELECT id_table , link_user
                                    FROM acc_farmer
                                    WHERE link_user = "${req.body.link_user}" and register_auth = 1 and station = "${result['data']['station_doctor']}"
                                    ORDER BY date_register DESC
                                    ` :
                                    `
                                    SELECT id_table , link_user
                                    FROM acc_farmer
                                    WHERE id_table = "${req.body.id_table}" and register_auth = ${req.body.auth === 0 ? 0 : 2} and station = "${result['data']['station_doctor']}"
                                    ORDER BY date_register DESC
                                    `

                con.query(queryType, (err , result)=>{
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

    app.post('/api/doctor/farmer/get/detail' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT * 
                    FROM acc_farmer
                    WHERE id_table = ? and link_user = ? and station = "${result['data']['station_doctor']}"
                    ` , [ req.body.id_table , req.body.link_user ]
                    , (err , result)=>{
                    if (err){
                        dbpacket.dbErrorReturn(con , err , res)
                        return 0
                    };
    
                    con.end()
                    res.send(result)
                })
            }
        } catch(err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/farmer/edit' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                delete req.body.password
                const id = req.body.id_farmer ? `id_farmer = "${req.body.id_farmer}"` : "";
                const fullname = req.body.fullname ? `fullname = "${req.body.fullname}"` : "";
                const location = req.body.lag && req.body.lng ? `location = POINT(${req.body.lag} , ${req.body.lng})` : "";
                const station = req.body.station ? `station = "${req.body.station}"` : "";
                const newPassword = req.body.newPassword ? `password = SHA2( "${req.body.newPassword}" , 254 )` : "";
                
                const SET = [id , fullname , location , station , newPassword].filter(val=>val).join(" , ")

                if(SET) {
                    con.query(
                        `
                            UPDATE acc_farmer
                            SET ${SET}
                            WHERE id_table = ?
                        ` , [ req.body.id_table ] , (err , resultEdit) => {
                            console.log(err)
                            if(!err) {
                                if(SET.length != 0) {
                                    con.query(
                                        `
                                        SELECT uid_line
                                        FROM acc_farmer
                                        WHERE id_table = ?
                                        ` , [ req.body.id_table ] , async (err , resultSelect) => {
                                            if(!err) {
                                                try {
                                                    await new Promise( async (resole , reject)=>{
                                                        const dataSend = {
                                                            type : "text" , 
                                                            text : `ผู้ส่งเสริม ${result["data"].fullname_doctor}\n\n`+
                                                                    `ทำการเปลี่ยนข้อมูลของท่าน :`+
                                                                    `${req.body.id_farmer ? `\nรหัสประจำตัวเกษตกร : ${req.body.id_farmer}` : ""}`+
                                                                    `${req.body.fullname ? `\nชื่อ : ${req.body.fullname}` : ""}`+
                                                                    `${req.body.station ? `\nศูนย์ในการดูแล : ${req.body.station}` : ""}`+
                                                                    `${req.body.newPassword ? `\nรหัสผ่าน : ${req.body.newPassword}` : ""}`+
                                                                    `${(req.body.lag && req.body.lng) ? `\nตำแหน่งที่ตั้ง :` : ""}`
                                                        }
                                                        await Line.pushMessage(resultSelect[0].uid_line , dataSend)
                                                        resole("")
                                                    })
    
                                                    if(req.body.lag && req.body.lng) {
                                                        Line.pushMessage(resultSelect[0].uid_line , {
                                                            type : "location",
                                                            latitude : req.body.lag,
                                                            longitude : req.body.lng
                                                        })
                                                    }
                                                } catch(e) {console.log(e)}
                                            }
                                            con.end()
                                        }
                                    )         
                                }
                                res.send("1")
                            } else {
                                con.end()
                                res.send("")
                            }
                        }
                    )
                } else {
                    res.send("")
                }
            }
        } catch(err) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            } else {
                res.send("")
            }
        }
    })

    app.post('/api/doctor/farmer/get/account/confirm' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT id_doctor , fullname_doctor , img_doctor
                    FROM acc_doctor
                    WHERE id_table_doctor = ?
                    ` , [ req.body.id_table_doctor]
                    , (err , result)=>{
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
    
    app.post('/api/doctor/farmer/list' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                const Limit = isNaN(parseInt(req.body.limit)) ? 0 : req.body.limit;
                let queryType = req.body.approve === 0 ?
                    `
                    SELECT filterFarmer.* , 
                    (
                        SELECT date
                        FROM message_user
                        WHERE message_user.uid_line_farmer = acc_farmer.uid_line 
                                and COALESCE(JSON_CONTAINS(id_read , '"read"' , '$."${result['data']['id_table_doctor']}"') , 0) = 0
                                and type = ""
                        ORDER BY message_user.date DESC
                        LIMIT 1
                    ) as is_msg
                    FROM acc_farmer , 
                    (
                        SELECT id_table , img , date_register , fullname , link_user , uid_line , 
                        (
                            SELECT EXISTS (
                                SELECT id_table 
                                FROM acc_farmer as farmer
                                WHERE farmer.uid_line = acc_farmer.uid_line and 
                                        station = "${result['data']['station_doctor']}" and 
                                        register_auth = 1
                            )
                        ) as CheckOver
                        FROM acc_farmer 
                        WHERE 
                            station = "${result['data']['station_doctor']}" and 
                            register_auth = 0
                    ) as filterFarmer
                    WHERE filterFarmer.id_table = acc_farmer.id_table and filterFarmer.CheckOver != 1
                    ORDER BY is_msg DESC , filterFarmer.date_register ASC
                    LIMIT ${Limit};
                    `: 
                    req.body.approve === 1 ?
                    `
                    SELECT acc_farmer.id_table , acc_farmer.img , acc_farmer.fullname , acc_farmer.link_user , acc_farmer.date_register
                        , farmer_main.Count , acc_farmer.date_doctor_confirm , acc_farmer.uid_line ,
                    (
                        SELECT fullname_doctor
                        FROM acc_doctor
                        WHERE acc_doctor.id_table_doctor = acc_farmer.id_doctor
                    ) as name_doctor ,
                    (
                        SELECT date
                        FROM message_user , 
                        (
                            SELECT uid_line
                            FROM acc_farmer as farmer_check
                            WHERE farmer_check.link_user = acc_farmer.link_user
                            ORDER BY date_register DESC
                            LIMIT 1
                        ) as farmer
                        WHERE message_user.uid_line_farmer = farmer.uid_line
                                and COALESCE(JSON_CONTAINS(id_read , '"read"' , '$."${result['data']['id_table_doctor']}"') , 0) = 0
                                and type = ""
                        ORDER BY message_user.date DESC
                        LIMIT 1
                    ) as is_msg
                    FROM acc_farmer , 
                    (
                        SELECT MAX(date_register) as DateLast , link_user , COUNT(link_user) as Count
                        FROM acc_farmer 
                        WHERE station = "${result['data']['station_doctor']}" and register_auth = 1
                        GROUP BY link_user
                    ) as farmer_main
                    WHERE acc_farmer.link_user = farmer_main.link_user 
                        and acc_farmer.date_register = farmer_main.DateLast
                    ORDER BY is_msg DESC , date_register DESC
                    LIMIT ${Limit};
                    ` :
                    `
                    SELECT filterFarmer.* , 
                    (
                        SELECT date
                        FROM message_user
                        WHERE message_user.uid_line_farmer = acc_farmer.uid_line 
                                and COALESCE(JSON_CONTAINS(id_read , '"read"' , '$."${result['data']['id_table_doctor']}"') , 0) = 0
                                and type = ""
                        ORDER BY message_user.date DESC
                        LIMIT 1
                    ) as is_msg
                    FROM acc_farmer , 
                    (
                        SELECT id_table , img , date_register , fullname , link_user , uid_line , 
                        (
                            SELECT EXISTS (
                                SELECT id_table 
                                FROM acc_farmer as farmer
                                WHERE farmer.uid_line = acc_farmer.uid_line and 
                                        station = "${result['data']['station_doctor']}" and 
                                        register_auth = 1
                            )
                        ) as CheckOver
                        FROM acc_farmer 
                        WHERE 
                            station = "${result['data']['station_doctor']}" and 
                            register_auth = 2
                    ) as filterFarmer
                    WHERE filterFarmer.id_table = acc_farmer.id_table and filterFarmer.CheckOver != 1
                    ORDER BY is_msg DESC , filterFarmer.date_register ASC
                    LIMIT ${Limit};
                    `
                con.query(queryType, (err , result)=>{
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

    app.post('/api/doctor/farmer/account/comfirm' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const OverAccount = await new Promise((resole , reject)=>{
                    con.query(
                        `
                        SELECT (
                            SELECT EXISTS (
                                SELECT id_table
                                FROM acc_farmer ,
                                (
                                    SELECT uid_line 
                                    FROM acc_farmer
                                    WHERE id_table = ?
                                ) as getUser
                                WHERE acc_farmer.uid_line = getUser.uid_line and register_auth = 1
                            )
                        ) as checkOver
                        ` , [ req.body.id_table ] , (err , check)=>{
                            resole(parseInt(check[0].checkOver))
                        }
                    )
                })

                if(!OverAccount) {
                    const convert= await new Promise((resole , reject)=> {
                        con.query(
                            `
                            SELECT link_user , uid_line
                            FROM acc_farmer
                            WHERE id_table = ? and register_auth = 1 and station = "${result['data']['station_doctor']}"
                            ` , [ req.body.id_table_convert ]
                            , (err , result)=>{
                            if (err){
                                dbpacket.dbErrorReturn(con , err , res)
                                return 0
                            };
        
                            resole(result)
                        })
                    })
    
                    let Link_user = ""
                    if(convert[0]){
                        if(convert[0].link_user.indexOf("cvpf-") >= 0) Link_user = convert[0].link_user
                        else Link_user = `cvpf-${new Date().getTime()}${convert[0].link_user.slice(0 , 3)}`
                        
                        if(convert[0].link_user != Link_user) {
                            await new Promise((resole , reject)=> {
                                con.query(
                                    `
                                    UPDATE acc_farmer 
                                    SET link_user = ?
                                    WHERE register_auth = 1 and id_table = ? and station = "${result['data']['station_doctor']}"
                                    `,[ Link_user , req.body.id_table_convert ],
                                    (err, result )=>{
                                        if (err){
                                            dbpacket.dbErrorReturn(con , err , res)
                                            return 0
                                        };
            
                                        con.query(
                                            `
                                            UPDATE housefarm 
                                            SET link_user = ?
                                            WHERE uid_line = ?
                                            ` , [ Link_user , convert[0].uid_line ] ,
                                            (err, result ) => {
                                                if (err){
                                                    dbpacket.dbErrorReturn(con , err , res)
                                                    return 0
                                                };
                                                
                                                resole(1)
                                            }
                                        )
                                    }
                                )
                            })
                        }
                    }
    
                    const statusChange = req.body.status_change === 0 ? 0 : 2;
                    con.query(
                        `
                        UPDATE acc_farmer 
                        SET 
                            register_auth = 1 , 
                            id_doctor = ? , 
                            date_doctor_confirm = ? ,
                            id_farmer = ?
                            ${Link_user ? `, link_user = "${Link_user}"` : ""}
                        WHERE register_auth = ? and id_table = ? and station = "${result['data']['station_doctor']}"
                        `,[ result['data']['id_table_doctor'] , new Date() , req.body.id_farmer , statusChange , req.body.id_table ],
                        (err, result )=>{
                            if (err){
                                dbpacket.dbErrorReturn(con , err , res)
                                return 0
                            };
    
                            if(Link_user) {
                                con.query(
                                    `
                                    UPDATE housefarm 
                                    SET link_user = ?
                                    WHERE uid_line = ?
                                    ` , [ Link_user , req.body.uid_line ] ,
                                    (err, result ) => {
                                        if (err){
                                            dbpacket.dbErrorReturn(con , err , res)
                                            return 0
                                        };
    
                                        con.end()
                                    }
                                )
                            } else {
                                con.end()
                            }
    
                            res.send("113")
                        }
                    )
                } else {
                    con.end()
                    res.send("over")
                }
            }
        } catch (err ) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        } 
    })

    app.post('/api/doctor/farmer/account/cancel' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                    UPDATE acc_farmer 
                    SET 
                        register_auth = 2 , 
                        date_doctor_confirm = ? ,
                        id_doctor = ?
                    WHERE id_table = ? and (register_auth = 0 || register_auth = 1)
                    ` , [new Date() , result['data']['id_table_doctor'] , req.body.id_table] , 
                    (err, result ) => {
                        if (err){
                            dbpacket.dbErrorReturn(con , err , res)
                            return 0
                        };

                        con.end()
                        res.send("113")
                    }
                )
            }
        } catch (err ) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        } 
    })

    app.post('/api/doctor/farmer/convert/list' , (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT acc_farmer.id_table , acc_farmer.fullname , acc_farmer.img , acc_farmer.id_farmer
                    FROM acc_farmer , 
                    (
                        SELECT MAX(date_register) as date , MAX(id_table) as id_table
                        FROM acc_farmer
                        WHERE id_table != ? and register_auth = 1 and station = "${result['data']['station_doctor']}"
                        GROUP BY link_user
                    ) as selectList
                    WHERE acc_farmer.id_table = selectList.id_table 
                            and (INSTR(acc_farmer.fullname , ?) OR INSTR(acc_farmer.id_farmer , ?))
                    ORDER BY acc_farmer.date_register DESC
                    LIMIT ${req.body.limit};
                    ` , [ req.body.id_table , req.body.search , req.body.search]
                    , (err , result)=>{
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

    app.post('/api/doctor/farmer/convert/cancel' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(`
                    SELECT uid_line , link_user
                    FROM acc_farmer
                    WHERE id_table = ?
                ` , [req.body.id_table] ,
                (err, search ) => {
                    if (err){
                        dbpacket.dbErrorReturn(con , err , res)
                        return 0
                    };

                    con.query(
                        `
                        UPDATE acc_farmer
                        SET link_user = ?
                        WHERE id_table = ?
                        ` , [search[0].uid_line , req.body.id_table] ,
                        (err, result ) => {
                            if (err){
                                dbpacket.dbErrorReturn(con , err , res)
                                return 0
                            };

                            con.query(
                                `
                                UPDATE housefarm
                                SET link_user = ?
                                WHERE uid_line = ?
                                ` , [search[0].uid_line , search[0].uid_line] ,
                                (err, update ) => {
                                    if (err){
                                        dbpacket.dbErrorReturn(con , err , res)
                                        return 0
                                    };

                                    con.end()
                                    res.send(search[0].link_user)
                                }
                            )
                        }
                    )
                })
            }
        } catch (err ) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        } 
    })

    app.post('/api/doctor/farmer/convert/comfirm' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const convert= await new Promise((resole , reject)=> {
                    con.query(
                        `
                        SELECT link_user , uid_line
                        FROM acc_farmer
                        WHERE id_table = ? and register_auth = 1 and station = "${result['data']['station_doctor']}"
                        ` , [ req.body.id_table_convert ]
                        , (err , result)=>{
                        if (err){
                            dbpacket.dbErrorReturn(con , err , res)
                            return 0
                        };
    
                        resole(result)
                    })
                })

                let Link_user = ""
                if(convert[0]){
                    if(convert[0].link_user.indexOf("cvpf-") >= 0) Link_user = convert[0].link_user
                    else Link_user = `cvpf-${new Date().getTime()}${convert[0].link_user.slice(0 , 3)}`
                    
                    if(convert[0].link_user != Link_user) {
                        await new Promise((resole , reject)=> {
                            con.query(
                                `
                                UPDATE acc_farmer 
                                SET link_user = ?
                                WHERE register_auth = 1 and id_table = ? and station = ?
                                `,[ Link_user , req.body.id_table_convert , result['data']['station_doctor']],
                                (err, result )=>{
                                    if (err){
                                        dbpacket.dbErrorReturn(con , err , res)
                                        return 0
                                    };
        
                                    con.query(
                                        `
                                        UPDATE housefarm 
                                        SET link_user = ?
                                        WHERE uid_line = ?
                                        ` , [ Link_user , convert[0].uid_line ] ,
                                        (err, result ) => {
                                            if (err){
                                                dbpacket.dbErrorReturn(con , err , res)
                                                return 0
                                            };
                                            
                                            resole(1)
                                        }
                                    )
                                }
                            )
                        })
                    }
                }

                con.query(
                    `
                    UPDATE acc_farmer 
                    SET link_user = ?
                    WHERE register_auth = 1 and id_table = ? and station = ?
                    `,[Link_user , req.body.id_table , result['data']['station_doctor'] ],
                    (err, result )=>{
                        if (err){
                            dbpacket.dbErrorReturn(con , err , res)
                            return 0
                        };

                        if(Link_user) {
                            con.query(
                                `
                                UPDATE housefarm 
                                SET link_user = ?
                                WHERE uid_line = ?
                                ` , [ Link_user , req.body.uid_line ] ,
                                (err, result ) => {
                                    if (err){
                                        dbpacket.dbErrorReturn(con , err , res)
                                        return 0
                                    };

                                    con.end()
                                }
                            )
                        } else {
                            con.end()
                        }

                        res.send(Link_user)
                    }
                )
            }
        } catch (err ) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        } 
    })
    // account end

    //massage start
    app.post('/api/doctor/farmer/msg/count' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT COUNT(message_user.id) as count_msg
                    FROM message_user , 
                    (
                        SELECT uid_line
                        FROM acc_farmer
                        WHERE id_table = ? OR link_user = ?
                    ) as farmer
                    WHERE message_user.uid_line_farmer = farmer.uid_line
                            and COALESCE(JSON_CONTAINS(id_read , '"read"' , '$."?"') , 0) = 0
                            and type = ""
                    ` , [req.body.id_table , req.body.link_user , result["data"].id_table_doctor] , 
                    (err , count)=>{
                        con.end()
                        res.send(count)
                    }
                )
            }
        } catch(err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/farmer/msg/read' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                    UPDATE message_user
                    SET id_read = JSON_SET(id_read, '$."?"', 'read')
                    WHERE uid_line_farmer = ?
                    ` , [result["data"].id_table_doctor , req.body.uid_line] , 
                    (err , read)=>{
                        socket.to(req.body.uid_line).emit("new_msg" , "read")
                        con.end()
                        res.send("1")
                    }
                )
            }
        } catch(err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/farmer/msg/send' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const TextSend = req.body.textSend.trim()
                if(TextSend) {
                    con.query(
                        `
                        INSERT INTO message_user
                        ( message , uid_line_farmer , id_read , type , type_message ) VALUES ( ? , ? , '{"?" : "read"}' , ? , "text")
                        ` , [ TextSend , req.body.uid_line , result["data"].id_table_doctor , result["data"].id_table_doctor ] , async (err) => {
                            if(err) con.end()
                            else {
                                con.end()
                                await Line.pushMessage(req.body.uid_line , {
                                    type : "text" , text : `ส่งจากหมอ ${result["data"].fullname_doctor} : \n${TextSend}`
                                })
                                socket.to(req.body.uid_line).emit("new_msg")
                            }
                        }
                    )
                }
            }
        } catch(err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/farmer/msg/get' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result = await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                if(req.body.open_msg === "start") {
                    const LimitFirst = await new Promise((resole , reject)=>{
                        con.query(
                            `
                            SELECT COUNT(*) as count_unread
                            FROM message_user
                            WHERE uid_line_farmer = ? 
                                    and COALESCE(JSON_CONTAINS(id_read , '"read"' , '$."${result['data']['id_table_doctor']}"') , 0) = 0
                            ` , [ req.body.uid_line ] , 
                            (err , list_unread)=>{
                                resole(parseInt(list_unread[0].count_unread))
                            }
                        )
                    })

                    const ListMsg = await new Promise((resole , reject)=>{
                        con.query(
                            `
                            SELECT * , 
                            (
                                SELECT fullname_doctor
                                FROM acc_doctor
                                WHERE id_table_doctor = message_user.type
                            ) as name_doctor ,
                            (
                                SELECT EXISTS (
                                    SELECT id_table_doctor
                                    FROM acc_doctor
                                    WHERE id_table_doctor = ? and id_table_doctor = message_user.type
                                )
                            ) as is_me ,
                            (
                                SELECT img_doctor
                                FROM acc_doctor
                                WHERE id_table_doctor = ? and id_table_doctor = message_user.type
                            ) as img_doctor
                            FROM message_user
                            WHERE uid_line_farmer = ?
                            ORDER BY date DESC
                            LIMIT ${LimitFirst ? LimitFirst + 5 : 15} OFFSET 0
                            ` , [ result["data"].id_table_doctor , result["data"].id_table_doctor , req.body.uid_line ] , 
                            (err , list_msg)=>{
                                resole(list_msg)
                            }
                        )
                    })

                    if(LimitFirst) ListMsg.splice(LimitFirst , 0 , {type_message : "unread"})
                    ListMsg.reverse()

                    con.end()
                    res.send(ListMsg)
                } else if (req.body.open_msg === "get") {
                    const ListMsg = await new Promise((resole , reject)=>{
                        con.query(
                            `
                            SELECT *
                            , 
                            (
                                SELECT fullname_doctor
                                FROM acc_doctor
                                WHERE id_table_doctor = message_user.type
                            ) as name_doctor ,
                            (
                                SELECT EXISTS (
                                    SELECT id_table_doctor
                                    FROM acc_doctor
                                    WHERE id_table_doctor = ? and id_table_doctor = message_user.type
                                )
                            ) as is_me ,
                            (
                                SELECT img_doctor
                                FROM acc_doctor
                                WHERE id_table_doctor = ? and id_table_doctor = message_user.type
                            ) as img_doctor
                            FROM message_user
                            WHERE uid_line_farmer = ? and id > ?
                            ORDER BY date ASC
                            LIMIT 999999
                            ` , [ result["data"].id_table_doctor , result["data"].id_table_doctor , req.body.uid_line , req.body.id_start ] , 
                            (err , list_msg)=>{
                                resole(list_msg)
                            }
                        )
                    })

                    // let countPush = 0
                    // await new Promise( async (resole , reject)=>{
                    //     for (let Msg of ListMsg) {
                    //         const MsgOfLine = (
                    //                 (Msg.type_message == "text" || Msg.type_message == "location") ? Msg.message :
                    //                 await Line.getMessageContent(Msg.message.toString())
                    //             );
                            
                    //         const MsgSend = (
                    //                 (Msg.type_message == "text" || Msg.type_message == "location") ? MsgOfLine :
                    //                 await new Promise((resole , reject)=>{
                    //                     https.get( MsgOfLine.responseUrl , {
                    //                         method : "GET",
                    //                         headers : {
                    //                             Authorization : "Bearer 3bRyKhlM01xFG6hDC+x5ZlfT0r44XF4L5wHORR9CJc87tmjrHoQJad6kLvOa8cbX7hSHVu6SB08UcWx2I9QjdNWRLo6fwsExPTbm7Wuaw7Eq6zh6DJXs9FFQqSbXxZKvHJt4jURZqu4Z0NcP6zJ4wwdB04t89/1O/w1cDnyilFU="
                    //                         }
                    //                     } , (res)=>{
                    //                         let Data = Buffer.alloc(0);
                    //                         res.on('data' , (chunk)=>{
                    //                             Data = Buffer.concat([Data, chunk]);
                    //                         })

                    //                         res.on('end', () => {
                    //                             resole(Data)
                    //                         });
                    //                     })
                    //                 })
                    //             )

                    //         delete Msg.message;
                    //         Msg.msgLine = MsgSend;
                    //         countPush++;
                    //         if(countPush == ListMsg.length) resole()
                    //     }
                    // })

                    con.end()
                    res.send(ListMsg)
                } else if (req.body.open_msg === "load") {
                    const LIMIT = isNaN(parseInt(req.body.limit)) ? 0 : req.body.limit
                    const OFFSET = isNaN(parseInt(req.body.offset)) ? 0 : req.body.offset

                    const ListMsg = await new Promise((resole , reject)=>{
                        con.query(
                            `
                            SELECT * , 
                            (
                                SELECT fullname_doctor
                                FROM acc_doctor
                                WHERE id_table_doctor = message_user.type
                            ) as name_doctor ,
                            (
                                SELECT EXISTS (
                                    SELECT id_table_doctor
                                    FROM acc_doctor
                                    WHERE id_table_doctor = ? and id_table_doctor = message_user.type
                                )
                            ) as is_me ,
                            (
                                SELECT img_doctor
                                FROM acc_doctor
                                WHERE id_table_doctor = ? and id_table_doctor = message_user.type
                            ) as img_doctor
                            FROM message_user
                            WHERE uid_line_farmer = ? and id < ?
                            ORDER BY date DESC
                            LIMIT ${LIMIT}
                            ` , [ result["data"].id_table_doctor , result["data"].id_table_doctor , req.body.uid_line , req.body.id_start ] , 
                            (err , list_msg)=>{
                                resole(list_msg)
                            }
                        )
                    })

                    ListMsg.reverse()
                    con.end()
                    res.send(ListMsg)
                }
            }
        } catch(err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })
    //massage end

    // form start
    app.post('/api/doctor/form/list' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {

                // select out table
                const TextInsert = req.body.textInput ?? "";
                const TypePlant = req.body.typePlant ?? null ;
                const Submit = (req.body.statusForm >= 0 && req.body.statusForm <= 2) ? req.body.statusForm : null ;
                const StatusFarmer = (req.body.statusFarmer >= 0 && req.body.statusFarmer <= 1) ? req.body.statusFarmer : null;
                
                const TypeDate = (req.body.typeDate == 1) ? "date_success" : (req.body.typeDate == 0) ? "date_plant" : null;
                const StartDate = (new Date(req.body.StartDate).toString() !== "Invalid Date") ? req.body.StartDate : null ;
                const EndDate = (new Date(req.body.EndDate).toString() !== "Invalid Date") ? req.body.EndDate : null ;

                const OrderBy = (req.body.typeDate == 1) ? "date_success" : "date_plant";
                const Limit = (!isNaN(req.body.limit)) ? req.body.limit : null;

                con.query(
                    `
                    SELECT fromInsert.* 
                    FROM formplant ,
                    (
                        SELECT formplant.id , formplant.submit , formplant.name_plant , formplant.date_plant ,
                        formplant.system_glow , formplant.insect , formplant.generation , formplant.qty , formplant.date_harvest ,
                            (
                                SELECT COUNT(id)
                                FROM formfertilizer
                                WHERE id_plant = formplant.id
                            ) as ctFer ,
                            (
                                SELECT COUNT(id)
                                FROM formchemical
                                WHERE id_plant = formplant.id
                            ) as ctChe ,
                            (
                                SELECT type_plant
                                FROM plant_list
                                WHERE name = formplant.name_plant
                            ) as type_main ,
                            (
                                SELECT id_plant
                                FROM success_detail
                                WHERE id_plant = formplant.id and INSTR(id_success , ?)
                                GROUP BY id_plant
                            ) as success_id_plant
                        FROM formplant , 
                            (
                                SELECT id_farmHouse
                                FROM housefarm , 
                                    (
                                        SELECT uid_line , link_user
                                        FROM acc_farmer
                                        WHERE ${StatusFarmer !== null ? `register_auth = ${StatusFarmer}` : "(register_auth = 0 OR register_auth = 1)"} and station = ?
                                    ) as farmer
                                WHERE housefarm.uid_line = farmer.uid_line or housefarm.link_user = farmer.link_user
                            ) as house
                        WHERE formplant.id_farmHouse = house.id_farmHouse
                                ${TypePlant !== null ? `and formplant.name_plant = '${TypePlant}'` : ""}
                                ${Submit !== null ? `and formplant.submit = ${Submit}` : ""}
                                ${(TypeDate !== null && StartDate !== null && EndDate !== null) ? `and ( UNIX_TIMESTAMP(formplant.${TypeDate}) >= UNIX_TIMESTAMP('${StartDate}') and UNIX_TIMESTAMP(formplant.${TypeDate}) <= UNIX_TIMESTAMP('${EndDate}') )` : ""}
                                
                        ORDER BY ${OrderBy}
                    ) as fromInsert
                    WHERE formplant.id = fromInsert.id and ( INSTR(formplant.id , ?) or formplant.id = fromInsert.success_id_plant )
                    ORDER BY submit ASC
                    ${(Limit !== null) ? `LIMIT ${Limit}` : ""}
                    `
                    , [TextInsert , result['data']['station_doctor'] , TextInsert ] , 
                    (err , listFarm)=>{
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("select form");
                        }

                        con.end()
                        res.send(listFarm)
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.get('/api/doctor/form/get/detail' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const TypeForm = (req.query.type === '0') ? "plant" : (req.query.type === '1') ? "fertilizer" : "chemical";
                const subjectWhereID = (req.query.type === '0') ? "id" : (req.query.type === '1') ? "id_plant" : "id_plant";
                
                con.query(
                    `
                    SELECT * ,
                    (
                        SELECT COUNT(status)
                        FROM editform
                        WHERE status = 0 and type_form = ? and id_form = form${TypeForm}.id
                    ) as countStatus
                    ${ req.query.type === '0' ?
                        `
                        ,
                        (
                            SELECT id_table
                            FROM acc_farmer , 
                            (
                                SELECT link_user
                                FROM housefarm
                                WHERE id_farmHouse = formplant.id_farmHouse
                            ) as house
                            WHERE acc_farmer.link_user = house.link_user
                            ORDER BY date_register
                            LIMIT 1
                        ) as id_farmer
                        , (
                            SELECT type_plant
                            FROM plant_list
                            WHERE name = formplant.name_plant
                        ) as type_main
                        ` : ''
                    }
                    FROM form${TypeForm}
                    WHERE ${subjectWhereID} = ?
                    ` , [TypeForm , req.query.id_form] ,
                    (err, result )=>{
                        if(err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("select form");
                        }

                        con.end()
                        res.send(result)
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/form/edit/get' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const type = req.body.id_edit ? "*" : "id_edit" ;
                const where = req.body.id_edit ? `and editform.id_edit = '${req.body.id_edit}'` : "" ;
                con.query(
                    ` 
                        SELECT editform.${type} 
                        FROM editform
                        WHERE editform.id_form = ? and type_form = ? ${where}
                        ORDER BY date DESC
                    ` 
                , [  req.body.id_form , req.body.type_form ] , 
                (err, result )=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("select plant editform");
                        return 0;
                    }

                    if(req.body.id_edit) {
                        con.query(
                            `
                            SELECT * FROM detailedit
                            WHERE id_edit = ?
                            ` , [req.body.id_edit] , 
                            (err, detail ) => {
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log("select detailedit");
                                    return 0;
                                }

                                con.end()
                                res.send({
                                    head : result[0] ,
                                    detail : detail
                                })
                            }
                            )
                    } else {
                        con.end()
                        res.send(result)
                    }
                })
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.put('/api/doctor/form/edit/change/status' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                        UPDATE editform
                        SET status = ? , note = ? , id_doctor = ?
                        WHERE id_edit = ?
                    ` , [ req.body.status , req.body.note , result['data']['id_table_doctor'] , req.body.id_edit ] ,
                    (err, result ) => {
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("update plant editform");
                            return 0;
                        }

                        con.end()
                        res.send("133")
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    //profile farmer
    app.get('/api/doctor/form/get/farmer' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT acc_farmer.*
                    FROM acc_farmer , 
                        (
                            SELECT link_user
                            FROM housefarm , 
                            (
                                SELECT id_farmHouse
                                FROM formplant
                                WHERE id = ?
                            ) as plant
                            WHERE housefarm.id_farmHouse = plant.id_farmHouse
                        ) as house
                    WHERE acc_farmer.link_user = house.link_user
                    ORDER BY date_register
                    LIMIT 1
                    ` , [req.query.id_form] ,
                    (err , result) => {
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("get profile");
                            return 0;
                        }

                        con.end()
                        res.send(result)
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    //manage
    app.get('/api/doctor/form/manage/get' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const Order = req.query.typePage === "success_detail" ? "date_of_doctor DESC" 
                                : req.query.typePage === "report_detail" ? "date_report"
                                : "date_check";
                con.query(
                    `
                        SELECT * , 
                        (
                            SELECT fullname_doctor
                            FROM acc_doctor
                            WHERE id_table_doctor = ${req.query.typePage}.id_table_doctor
                        ) as name_doctor ,
                        (
                            SELECT id_doctor
                            FROM acc_doctor
                            WHERE id_table_doctor = ${req.query.typePage}.id_table_doctor
                        ) as id_doctor ,
                        (
                            SELECT EXISTS (
                                SELECT id_table_doctor
                                FROM acc_doctor
                                WHERE id_table_doctor = ? and id_table_doctor = ${req.query.typePage}.id_table_doctor
                            )
                        ) as check_doctor
                        FROM ${req.query.typePage}
                        WHERE id_plant = ?
                        ORDER BY ${Order}
                    ` , [result.data.id_table_doctor , req.query.id_plant ] ,
                    (err, result ) => {
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("get manage");
                            return 0;
                        }

                        if(req.query.typePage === "success_detail" || req.query.typePage === "check_plant_detail") {
                            con.query(
                                `
                                SELECT 
                                ${ req.query.typePage === "success_detail" ?
                                    `
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM check_plant_detail
                                            WHERE id_plant = ? and state_check = 0
                                            LIMIT 1
                                        )
                                    ) as check_plant_before 
                                    , 
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM check_plant_detail
                                            WHERE id_plant = ? and state_check = 1
                                            LIMIT 1
                                        )
                                    ) as check_plant_after ,
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM success_detail
                                            WHERE id_plant = ? and type_success = 1
                                            LIMIT 1
                                        )
                                    ) as Check_success_after
                                    ` : 
                                    req.query.typePage === "check_plant_detail" ? 
                                    `
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM success_detail
                                            WHERE id_plant = ? and type_success = 0
                                            LIMIT 1
                                        )
                                    ) as check_success_before 
                                    , 
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM success_detail
                                            WHERE id_plant = ? and type_success = 1
                                            LIMIT 1
                                        )
                                    ) as check_success_after ,
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM check_plant_detail
                                            WHERE id_plant = ? and state_check = 1
                                            LIMIT 1
                                        )
                                    ) as check_plant_after
                                    ` 
                                    : ""
                                }
                                ` , [ req.query.id_plant , req.query.id_plant , req.query.id_plant ] ,
                                (err , optionCheck) => {
                                    if (err) {
                                        dbpacket.dbErrorReturn(con, err, res);
                                        console.log("get manage");
                                        return 0;
                                    }
    
                                    con.end()
                                    res.send({
                                        list : result,
                                        option : optionCheck
                                    })
                                }
                            )
                        } else {
                            con.end()
                            res.send({
                                list : result,
                                option : []
                            })
                        }
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/form/manage/success/insert' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                
                const CheckInsert = req.body.type == 1 ? await new Promise((resole , reject)=>{
                    con.query(
                        `
                            SELECT EXISTS (
                                SELECT id
                                FROM check_plant_detail
                                WHERE id_plant = ? and status_check = 0
                            ) as ResultAfter
                        ` , [ req.body.id_plant ] , 
                        (err, result ) => {
                            resole(parseInt(result[0].ResultAfter))
                        }
                    )
                }) : req.body.type == 0 ? await new Promise((resole , reject)=>{
                    con.query(
                        `
                            SELECT EXISTS (
                                SELECT id
                                FROM check_plant_detail
                                WHERE id_plant = ? and state_check = 1
                            ) as ResultBefore
                        ` , [ req.body.id_plant ] , 
                        (err, result ) => {
                            resole(!parseInt(result[0].ResultBefore))
                        }
                    )
                }) : "";

                const CheckSuccess = await new Promise((resole , reject)=>{
                    con.query(
                        `
                        SELECT
                        (
                            SELECT EXISTS (
                                SELECT id
                                FROM success_detail
                                WHERE id_plant = ? and type_success = 1
                                LIMIT 1
                            )
                        ) as Check_success_after
                        ` , [req.body.id_plant] ,
                        (err , resultCheck)=>{
                            resole(parseInt(resultCheck[0].Check_success_after))
                        }
                    )
                })
                
                if(CheckInsert && !CheckSuccess) {
                    const Random = await new Promise( async (resole , reject)=>{
                        while(true) {
                            let random = apifunc.generateID(4 , "num")
                            let resultFound= await new Promise((resole , reject)=> {
                                con.query(
                                    `
                                    SELECT id
                                    FROM success_detail
                                    WHERE id_success = ?
                                    ` , [ random ] , 
                                    (err, result ) => {
                                        resole(result)
                                    }
                                )
                            })
    
                            if(resultFound.length === 0) {
                                resole(random)
                                break;
                            }
                        }
                    })

                    con.query(
                        `
                            INSERT success_detail
                            ( id_plant , id_success , id_table_doctor , type_success , date_of_farmer )
                            VALUES 
                            ( ? , ? , ? , ? , '')
                        ` , [ req.body.id_plant , Random , result["data"].id_table_doctor , req.body.type ] ,
                        (err, result ) => {
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("get manage");
                                return 0;
                            }
    
                            if(req.body.type == 0) {
                                con.query(
                                    `
                                    UPDATE formplant 
                                    SET submit = 1
                                    WHERE id = ? and submit = 0
                                    ` , [ req.body.id_plant ] , 
                                    (err , update)=>{
                                        con.end()
                                        res.send("113")
                                    }
                                )
                            } else if (req.body.type == 1) {
                                // con.query(
                                //     `
                                //     UPDATE formplant 
                                //     SET submit = 2
                                //     WHERE id = ? and submit = 1
                                //     ` , [ req.body.id_plant ] , 
                                //     (err , update)=>{
                                        
                                //     }
                                // )
                                con.end()
                                res.send("113")
                            }
                        }
                    )
                } else {
                    con.end()
                    res.send("not")
                }
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        }
    })

    app.post('/api/doctor/form/manage/report/insert' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT COUNT(id) as count
                    FROM report_detail
                    WHERE id_plant = ?
                    ` , [req.body.id_plant] ,
                    (err , reportChk)=> {
                        if(reportChk[0].count < 2) {
                            con.query(
                                `
                                    INSERT report_detail
                                    (id_plant , report_text , id_table_doctor)
                                    VALUES
                                    (? , ? , ?)
                                ` , [ req.body.id_plant , req.body.report_text , result.data.id_table_doctor ] ,
                                (err , result) =>{
                                    if (err) {
                                        dbpacket.dbErrorReturn(con, err, res);
                                        console.log("insert report");
                                        return 0;
                                    }
            
                                    con.end()
                                    res.send("113")
                                }
                            )
                        } else {
                            con.end()
                            res.send("max")
                        }
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        }
    })

    app.post('/api/doctor/form/manage/report/edit' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const DateNew = apifunc.DateTime(new Date())
                con.query(
                    `
                    UPDATE report_detail
                    SET report_text = ? , date_report = ?
                    WHERE id_plant = ? and id = ? and id_table_doctor = ?
                    ` , [ req.body.report_text , DateNew , req.body.id_plant , req.body.id , result.data.id_table_doctor ],
                    (err , resultEdit) => {
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("edit report");
                            return 0;
                        }

                        con.end()
                        res.send("113")
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        }
    })

    app.post('/api/doctor/form/manage/checkplant/insert' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {

                const Check = await new Promise((resolve , reject)=>{
                    con.query(
                        `
                        SELECT (
                            SELECT EXISTS (
                                SELECT id
                                FROM success_detail
                                WHERE type_success = ? and id_plant = ?
                            )
                        ) as check_success
                        ` , [ req.body.stateCheck , req.body.id_plant ] , 
                        (err , result) => {
                            resolve(result[0].check_success)
                        }
                    )
                })

                if(parseInt(Check)) {
                    con.query(
                        `
                            INSERT check_plant_detail
                            (id_plant , status_check , state_check , note_text , id_table_doctor)
                            VALUES
                            (? , ? , ? , ? , ?)
                        ` , [ req.body.id_plant , req.body.statusCheck , req.body.stateCheck , req.body.report_text , result.data.id_table_doctor ] ,
                        (err , result) =>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("insert plant check");
                                return 0;
                            }

                            if(req.body.stateCheck == 1) {
                                con.query(
                                    `
                                    UPDATE formplant 
                                    SET submit = 2
                                    WHERE id = ? and submit = 1
                                    ` , [ req.body.id_plant ] , 
                                    (err , update)=>{
                                        con.end()
                                        res.send("113")
                                    }
                                )
                            } else {
                                con.end()
                                res.send("113")
                            }
                        }
                    )
                } else {
                    con.end()
                    res.send("not")
                }
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        }
    })

    app.post('/api/doctor/form/manage/checkform/insert' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                con.query(
                    `
                    SELECT EXISTS (
                        SELECT id
                        FROM check_form_detail
                        WHERE id_plant = ?
                    ) as CheckResult
                    ` , [ req.body.id_plant ] , 
                    (err , check) => {
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("insert form check");
                            return 0;
                        }

                        if(!parseInt(check[0].CheckResult)) {
                            con.query(
                                `
                                    INSERT check_form_detail
                                    (id_plant , status_check , note_text , id_table_doctor)
                                    VALUES
                                    (? , ? , ? , ?)
                                ` , [ req.body.id_plant , req.body.statusCheck , req.body.report_text , result.data.id_table_doctor ] ,
                                (err , result) =>{
                                    if (err) {
                                        dbpacket.dbErrorReturn(con, err, res);
                                        console.log("insert form check");
                                        return 0;
                                    }
            
                                    con.end()
                                    res.send("113")
                                }
                            )
                        } else {
                            con.end()
                            res.send("not") 
                        }
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        }
    })

    // export
    app.post('/api/doctor/form/export' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {

                // select out table
                const TextInsert = req.body.textInput ?? "";
                const TypePlant = req.body.typePlant ?? null ;
                const Submit = (req.body.statusForm >= 0 && req.body.statusForm <= 2) ? req.body.statusForm : null ;
                const StatusFarmer = (req.body.statusFarmer >= 0 && req.body.statusFarmer <= 1) ? req.body.statusFarmer : null;
                
                const TypeDate = (req.body.typeDate == 1) ? "date_success" : (req.body.typeDate == 0) ? "date_plant" : null;
                const StartDate = (new Date(req.body.StartDate).toString() !== "Invalid Date") ? req.body.StartDate : null ;
                const EndDate = (new Date(req.body.EndDate).toString() !== "Invalid Date") ? req.body.EndDate : null ;

                const OrderBy = (req.body.typeDate == 1) ? "date_success" : "date_plant";

                con.query(
                    `
                    SELECT fromInsert.* 
                    FROM formplant ,
                    (
                        SELECT formplant.* ,
                            (
                                SELECT type_plant
                                FROM plant_list
                                WHERE name = formplant.name_plant
                            ) as type_main ,
                            (
                                SELECT id_plant
                                FROM success_detail
                                WHERE id_plant = formplant.id and INSTR(id_success , ?)
                                GROUP BY id_plant
                            ) as success_id_plant
                        FROM formplant , 
                            (
                                SELECT id_farmHouse
                                FROM housefarm , 
                                    (
                                        SELECT uid_line , link_user
                                        FROM acc_farmer
                                        WHERE ${StatusFarmer !== null ? `register_auth = ${StatusFarmer}` : "(register_auth = 0 OR register_auth = 1)"} and station = ?
                                    ) as farmer
                                WHERE housefarm.uid_line = farmer.uid_line or housefarm.link_user = farmer.link_user
                            ) as house
                        WHERE formplant.id_farmHouse = house.id_farmHouse
                                ${TypePlant !== null ? `and formplant.name_plant = '${TypePlant}'` : ""}
                                ${Submit !== null ? `and formplant.submit = ${Submit}` : ""}
                                ${(TypeDate !== null && StartDate !== null && EndDate !== null) ? `and ( UNIX_TIMESTAMP(formplant.${TypeDate}) >= UNIX_TIMESTAMP('${StartDate}') and UNIX_TIMESTAMP(formplant.${TypeDate}) <= UNIX_TIMESTAMP('${EndDate}') )` : ""}
                                
                        ORDER BY ${OrderBy}
                    ) as fromInsert
                    WHERE formplant.id = fromInsert.id and ( INSTR(formplant.id , ?) or formplant.id = fromInsert.success_id_plant )
                    `
                    , [TextInsert , result['data']['station_doctor'] , TextInsert ] , 
                    async (err , listFarm)=>{
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("select form");
                        }

                        const DataExport = await new Promise( async (resole , reject)=>{
                            const Data = new Array
                            for(let val of listFarm){

                                const Farmer = await new Promise((resole , reject)=>{
                                    con.query(
                                        `
                                        SELECT acc_farmer.id_farmer , acc_farmer.fullname , 
                                            (
                                                SELECT name
                                                FROM station_list
                                                WHERE id = acc_farmer.station
                                            ) as station
                                        FROM acc_farmer , 
                                            (
                                                SELECT link_user
                                                FROM housefarm , 
                                                (
                                                    SELECT id_farmHouse
                                                    FROM formplant
                                                    WHERE id = ?
                                                ) as plant
                                                WHERE housefarm.id_farmHouse = plant.id_farmHouse
                                            ) as house
                                        WHERE acc_farmer.link_user = house.link_user
                                        ORDER BY date_register
                                        LIMIT 1
                                        ` , [val.id] ,
                                        (err , result) => {
                                            resole(result)
                                        }
                                    )
                                })

                                const Fertirizer = await new Promise((resole , reject)=>{
                                    con.query(
                                        `
                                            SELECT * 
                                            FROM formfertilizer
                                            WHERE id_plant = ?
                                        ` , [val.id] ,
                                        (err , result) => {
                                            resole(result)
                                        }
                                    )
                                })
    
                                const chemical = await new Promise((resole , reject)=>{
                                    con.query(
                                        `
                                            SELECT * 
                                            FROM formchemical
                                            WHERE id_plant = ?
                                        ` , [val.id] ,
                                        (err , result) => {
                                            resole(result)
                                        }
                                    )
                                })
    
                                const Report = await new Promise((resole , reject)=>{
                                    con.query(
                                        `
                                            SELECT * , 
                                            (
                                                SELECT fullname_doctor
                                                FROM acc_doctor
                                                WHERE id_table_doctor = report_detail.id_table_doctor
                                            ) as name_doctor
                                            FROM report_detail
                                            WHERE id_plant = ?
                                        ` , [val.id] ,
                                        (err , result) => {
                                            const ResultEx = result.map((val , key)=>{
                                                val.report_text = wordcut.cut(val.report_text)
                                                return val
                                            })
                                            resole(ResultEx)
                                        }
                                    )
                                })
    
                                const CheckForm = await new Promise((resole , reject)=>{
                                    con.query(
                                        `
                                            SELECT * , 
                                            (
                                                SELECT fullname_doctor
                                                FROM acc_doctor
                                                WHERE id_table_doctor = check_form_detail.id_table_doctor
                                            ) as name_doctor
                                            FROM check_form_detail
                                            WHERE id_plant = ?
                                        ` , [val.id] ,
                                        (err , result) => {
                                            const ResultEx = result.map((val , key)=>{
                                                val.note_text = wordcut.cut(val.note_text)
                                                return val
                                            })
                                            resole(ResultEx)
                                        }
                                    )
                                })
    
                                const CheckPlant = await new Promise((resole , reject)=>{
                                    con.query(
                                        `
                                            SELECT * , 
                                            (
                                                SELECT fullname_doctor
                                                FROM acc_doctor
                                                WHERE id_table_doctor = check_plant_detail.id_table_doctor
                                            ) as name_doctor
                                            FROM check_plant_detail
                                            WHERE id_plant = ?
                                        ` , [val.id] ,
                                        (err , result) => {
                                            resole(result)
                                        }
                                    )
                                })
    
                                Data.push({
                                    dataForm : val,
                                    farmer : Farmer,
                                    ferti : Fertirizer,
                                    chemi : chemical,
                                    report : Report,
                                    checkForm : CheckForm,
                                    checkPlant : CheckPlant
                                })
                            }
                            con.end()
                            resole(Data)
                        })

                        res.send(DataExport)
                    }
                )
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })
    // end formplant

    //data
    app.post('/api/doctor/data/get' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const From = req.body.type == "plant" ? "plant_list" : 
                                req.body.type == "fertilizer" ? "fertilizer_list" : 
                                req.body.type == "chemical" ? "chemical_list" :
                                req.body.type == "source" ? "source_list" : ""
                
                const QuerySearch = Object.entries(req.body.check).map((Data)=>{
                    const Check = req.body.type == "plant" ? { name : 1 , type_plant : 1 } : 
                                    req.body.type == "fertilizer" ? { name : 1 , name_formula : 1 } : 
                                    req.body.type == "chemical" ? { name : 1 , name_formula : 1 } :
                                    req.body.type == "source" ? { name : 1 } : ""
                    if(!Check || !Check[Data[0]]) return null
                    else if(Data[0] == "name_formula" && req.body.type == "fertilizer") return `( ${Data[0]} LIKE '${Data[1]}' )`
                    else return `INSTR( ${Data[0]} , '${Data[1]}' )`
                })

                const StartRow = !isNaN(req.body.StartRow) ? req.body.StartRow : 0
                const Limit = !isNaN(req.body.Limit) ? req.body.Limit : 0
                if(From && QuerySearch.filter(val => val == null).length === 0) {
                    con.query(
                        `
                        SELECT * 
                        FROM ${From}
                        ${QuerySearch.join(" and ") ? `WHERE ${QuerySearch.join(" and ")}` : ""}
                        ORDER BY is_use DESC , id DESC
                        LIMIT ${Limit} OFFSET ${StartRow}
                        ` , 
                        (err , list) => {
                            if(err) {
                                console.log(err)
                                con.end()
                                res.send("error")
                                return 0
                            }
    
                            con.end()
                            res.send(list)
                        }
                    )
                } else {
                    con.end()
                    res.send("error")
                }
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/data/check/overlape' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const From = req.body.type == "plant" ? "plant_list" : 
                                req.body.type == "fertilizer" ? "fertilizer_list" : 
                                req.body.type == "chemical" ? "chemical_list" :
                                req.body.type == "source" ? "source_list" : ""
                if(From) {
                    try {
                        const where = Object.entries(req.body.check).map((checkData)=>{
                            checkData[1] = `"${checkData[1].trim()}"`
                            return checkData.join(" = ")
                        }).join(" and ")
                        con.query(
                            `
                            SELECT (
                                SELECT EXISTS (
                                    SELECT id 
                                    FROM ${From}
                                    WHERE ${where} and is_use = 1
                                )
                            ) as checkData
                            ` , 
                            (err , data) => {
                                if(err) console.log(err)
        
                                con.end()
                                res.send(data[0].checkData.toString())
                            }
                        )
                    } catch (err) {
                        con.end()
                        res.send("error")
                    }
                } else {
                    con.end()
                    res.send("error")
                }
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })

    app.post('/api/doctor/data/insert' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const From = req.body.type == "plant" ? "plant_list" : 
                                req.body.type == "fertilizer" ? "fertilizer_list" : 
                                req.body.type == "chemical" ? "chemical_list" :
                                req.body.type == "source" ? "source_list" : ""
                if(From) {
                    try {
                        const where = Object.entries(req.body.check).map((checkData)=>{
                            checkData[1] = `"${checkData[1].trim()}"`
                            return checkData.join(" = ")
                        }).join(" and ")
                        con.query(
                            `
                            SELECT (
                                SELECT EXISTS (
                                    SELECT id 
                                    FROM ${From}
                                    WHERE ${where}
                                )
                            ) as checkData
                            ` , 
                            (err , data) => {
                                if(err) console.log(err)
        
                                if(!data[0].checkData) {
                                    const Key = Object.entries(req.body.data).map(val=>val[0])
                                    const InsertArray = Object.entries(req.body.data).map(val=> val[0] === "location" && val[1] ? "ST_PointFromText(?)" : "?")
                                    const dataInsert = Object.entries(req.body.data).map(val=>val[1])
                                    try {
                                        con.query(
                                            `
                                                INSERT INTO ${From} 
                                                ( ${Key.join(" , ")} ) 
                                                VALUES 
                                                ( ${InsertArray.join(" , ")} )
                                            ` , dataInsert , (err , result)=>{
                                                if(err){
                                                    console.log(err)
                                                    con.end()
                                                    res.send("err")
                                                    return 0
                                                }
    
                                                con.end()
                                                res.send("insert")
                                            }
                                        )
                                    } catch(err) {
                                        con.end()
                                        res.send("error")
                                    }
                                } else {
                                    con.end()
                                    res.send("over")
                                }
                            }
                        )
                    } catch (err) {
                        con.end()
                        res.send("error")
                    }
                } else {
                    con.end()
                    res.send("error")
                }
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.send("password")
            }
        }
    })

    app.post('/api/doctor/data/edit' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.body.password
    
        if(username === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const From = req.body.type == "plant" ? "plant_list" : 
                                req.body.type == "fertilizer" ? "fertilizer_list" : 
                                req.body.type == "chemical" ? "chemical_list" :
                                req.body.type == "source" ? "source_list" : ""
                if(From) {
                    try {
                        const OverCheck = Object.entries(req.body.check).map((checkData)=>{
                            checkData[1] = `"${checkData[1].trim()}"`
                            return checkData.join(" = ")
                        }).join(" and ")

                        const resultCheck = OverCheck.length ? await new Promise((resole , reject)=>{
                            con.query(
                                `
                                SELECT (
                                    SELECT EXISTS (
                                        SELECT id 
                                        FROM ${From}
                                        WHERE ${OverCheck}
                                    )
                                ) as checkData
                                ` , (err , resultIn)=>{
                                    resole(parseInt(resultIn[0].checkData))
                                }
                            )
                        }) : false;

                        if(!resultCheck) {
                            const update = Object.entries(req.body.data).map(data=>{
                                if(data[0] === "location") data[1] = data[1] != "0" ? `ST_PointFromText("${data[1].trim()}")` : "NULL"
                                else data[1] = `"${data[1].trim()}"`
                                return data.join(" = ")
                            }).join(' , ')

                            await new Promise((resole , reject)=>{
                                con.query(
                                    `
                                    UPDATE ${From}
                                    SET ${update}
                                    WHERE id = ?
                                    ` , [req.body.id_list] , (err , updateData) => {
                                        resole()
                                    }
                                )
                            })

                            con.query(
                                `
                                SELECT * 
                                FROM ${From} 
                                WHERE id = ?
                                ` , [req.body.id_list] , (err , select) => {
                                    if(err){
                                        console.log(err)
                                        con.end()
                                        res.send("err select")
                                        return 0
                                    }

                                    con.end()
                                    res.send({
                                        data : select,
                                        result : "pass"
                                    })
                                }
                            )
                        } else {
                            con.end()
                            res.send({
                                result : "over"
                            })
                        }
                    } catch (err) {
                        con.end()
                        res.send({
                            result : "error"
                        })
                    }
                } else {
                    con.end()
                    res.send({
                        result : "error"
                    })
                }
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.send({
                    result : "password"
                })
            }
        }
    })

    app.post('/api/doctor/data/change' , async (req , res)=>{
        let username = req.session.user_doctor
        let password = req.session.pass_doctor
    
        if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
            res.redirect('/api/logout')
            return 0
        }
    
        let con = Database.createConnection(listDB)
    
        try {
            const result= await apifunc.auth(con , username , password , res , "acc_doctor")
            if(result['result'] === "pass") {
                const From = req.body.type == "plant" ? "plant_list" : 
                                req.body.type == "fertilizer" ? "fertilizer_list" : 
                                req.body.type == "chemical" ? "chemical_list" :
                                req.body.type == "source" ? "source_list" : ""
                const state = req.body.state == 0 ? 0 : 1; 
                if(From) {
                    con.query(
                        `
                        UPDATE ${From} SET is_use = ? WHERE id = ? and is_use != ?
                        ` , [ state , req.body.id_list , state ] ,
                        (err , list) => {
                            if(err) {
                                console.log(err)
                                con.end()
                                res.send("error")
                                return 0
                            }
    
                            con.end()
                            res.send('113')
                        }
                    )
                } else {
                    con.end()
                    res.send("error")
                }
            }
        } catch (err) {
            con.end()
            if(err == "not pass") {
                res.redirect('/api/logout')
            }
        }
    })
    
    // app.post("/doctor/api/doctor/pull" , (req , res)=>{
    //     let username = req.session.user_doctor
    //     let password = req.session.pass_doctor
    
    //     if(username === '' || password === '' || (req.hostname !== HOST_CHECK)) {
    //         res.redirect('/api/logout')
    //         return 0
    //     }
    
    //     let con = Database.createConnection(listDB)
    
    //     apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
    //         if(result['result'] === "pass") {
    //             con.query(
    //                 `
    //                 SELECT fullname , id_farmer , id_doctor , img , location , station , date_register , uid_line 
    //                 FROM acc_farmer 
    //                 WHERE id_table=? and register_auth = ? 
    //                 ORDER BY date_register DESC
    //                 ` , 
    //             [req.body['id'] , (req.body['type']) ? 1 : 0] , (err , resul)=>{
    //                 if (err) {
    //                     dbpacket.dbErrorReturn(con, err, res);
    //                     console.log("query");
    //                 }

    //                 con.end()
    //                 res.send(resul[0])
    //             })
    //         }
    //     }).catch((err)=>{
    //         con.end()
    //         if(err == "not pass") {
    //             res.redirect('/api/logout')
    //         }
    //     })
    
    //     // apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
    //     //     if(result['result'] === "pass") {
    //     //         con.query('UPDATE acc_farmer SET id_doctor = ? , register_auth = 1 WHERE register_auth = 0;' , 
    //     //         [username] , (err , resul)=>{
    
    //     //         })
    //     //     }
    //     // }).catch((err)=>{
    //     //     con.end()
    //     //     if(err == "not pass") {
    //     //         res.redirect('/api/logout')
    //     //     }
    //     // })
    // })
    
    // app.post('/doctor/api/doctor/farmer/confirm' , (req , res)=>{
    //     let username = req.session.user_doctor
    //     let password = req.body['password']
    
    //     if(username === '' || (req.hostname !== HOST_CHECK)) {
    //         res.redirect('/api/logout')
    //         return 0
    //     }
    
    //     let con = Database.createConnection(listDB)
    
    //     apifunc.auth(con , username , password , res , "acc_doctor").then((result)=>{
    //         if(result['result'] === "pass") {
    //             if(req.body['ans']) {
    //                 con.query(`
    //                         SELECT id_table , uid_line
    //                         FROM acc_farmer 
    //                         WHERE id_farmer=? 
    //                             and register_auth=1 
    //                             and UNIX_TIMESTAMP(date_register) < UNIX_TIMESTAMP(?)
    //                             and station = ?
    //                     `   , [req.body['farmer'] , req.body['date'] , req.body['station']]
    //                         , (err , resultOn)=>{
    //                             if (err) {
    //                                 dbpacket.dbErrorReturn(con, err, res);
    //                                 console.log("query");
    //                             }

    //                             let arrayID = resultOn.map((item) => item.id_table)
    //                             let uid_line = resultOn.map((item) => item.uid_line)
    //                             con.query(`
    //                                 SELECT id_table , uid_line
    //                                 FROM acc_farmer 
    //                                 WHERE id_farmer=? 
    //                                     and register_auth=1 
    //                                     and UNIX_TIMESTAMP(date_register) > UNIX_TIMESTAMP(?)
    //                                     and station = ?
    //                                 ORDER BY date_register DESC;
    //                             ` 
    //                             , [req.body['farmer'] , req.body['date'] , req.body['station']]
    //                             , (err , ObThan)=>{
    //                                 if (err) {
    //                                     dbpacket.dbErrorReturn(con, err, res);
    //                                     console.log("query");
    //                                 }

    //                                 let idLast = "" , idLineLast = "" , checkQuery = 0
    //                                 if(ObThan.length > 0) {
    //                                     arrayID = arrayID.concat(ObThan.filter((val , index) => index > 0)
    //                                                     .map((item) => item.id_table) , [req.body['id']]).join(', ')
    //                                     uid_line = uid_line.concat(ObThan.filter((val , index) => index > 0)
    //                                                     .map((item) => item.uid_line) , [req.body['uid_line']])

    //                                     idLast = ObThan.filter((val , index) => index == 0)
    //                                                     .map((item) => item.id_table).join("")
    //                                     idLineLast = ObThan.filter((val , index) => index == 0)
    //                                                     .map((item) => item.uid_line).join("")
    //                                 } else {
    //                                     arrayID = arrayID.join(', ')

    //                                     idLast = req.body['id']
    //                                     idLineLast = req.body['uid_line']
    //                                 }
    //                                 if(arrayID) { //unconnect user
    //                                     con.query(
    //                                         `
    //                                             UPDATE acc_farmer 
    //                                             SET register_auth=2 , id_farmer = ?
    //                                             WHERE id_table IN (${arrayID}) 
    //                                                 and (register_auth=1 or register_auth=0)
    //                                                 and station = ?
    //                                         `
    //                                         , [req.body['farmer'] , req.body['station']]
    //                                         , (err , resultAll) => {
    //                                             checkQuery+=1
    //                                             if(checkQuery == 4) {
    //                                                 con.end()
    //                                                 res.send("complete")
    //                                             }
    //                                         })
    //                                 }

    //                                 let Uid_line_query = uid_line.join(', ')
    //                                 if(Uid_line_query) {
    //                                     con.query(
    //                                         `
    //                                             UPDATE formplant 
    //                                             SET id_uid_line=?
    //                                             WHERE id_uid_line IN (${Uid_line_query})
    //                                         `
    //                                         , [idLineLast]
    //                                         , (err , resultAll) => {
    //                                             checkQuery+=1
    //                                             if(checkQuery == 4) {
    //                                                 con.end()
    //                                                 res.send("complete")
    //                                             }
    //                                         })
    //                                 }
    //                                 con.query(
    //                                     `
    //                                         UPDATE acc_farmer 
    //                                         SET register_auth=1 , id_doctor=? , date_doctor_confirm=? , id_farmer = ?
    //                                         WHERE id_table=? and register_auth = 0
    //                                     `
    //                                     , [ username ,  , new Date() , req.body['farmer'] , idLast]
    //                                     , (err , resultAll) => {
    //                                         checkQuery+=1
    //                                         if(checkQuery == 4) {
    //                                             con.end()
    //                                             res.send("complete")
    //                                         }
    //                                     })
                                    
    //                                 con.query(
    //                                     `
    //                                         UPDATE formplant 
    //                                         SET id_farmer=?
    //                                         WHERE id_uid_line=?
    //                                     `
    //                                     , [ req.body['farmer'] , idLineLast]
    //                                     , (err , resultAll) => {
    //                                         checkQuery+=1
    //                                         if(checkQuery == 4) {
    //                                             con.end()
    //                                             res.send("complete")
    //                                         }
    //                                     })

    //                                 console.log(arrayID)
    //                                 console.log(uid_line)
    //                             })
    //                         })
    //             } else {
    //                 con.query(`
    //                         UPDATE acc_farmer 
    //                         SET register_auth=3 , id_doctor=? , uid_line="" , date_doctor_confirm=?
    //                         WHERE id_table=? and register_auth = 0`
    //                         , [ username , new Date() , req.body['id']]
    //                         , (err , result)=>{
    //                             if (err) {
    //                                 dbpacket.dbErrorReturn(con, err, res);
    //                                 console.log("query");
    //                             }
    
    //                             if(result.changedRows == 1) {
    //                                 con.end()
    //                                 if(req.body['uid_line']) {
    //                                     // unconnect form save before and Uid_line of req.body['uid_line']
    //                                 }
    //                                 res.send('complete')
    //                             } 
    //                             else res.send('not found')
    //                         })
    //             }
                
    //             // con.query(`UPDATE acc_farmer SET register_auth=3 , id_doctor=?
    //             //             WHERE id_table != ? and register_auth = 0 and uid_line=?` 
    //             // , [username , req.body['id'] , req.body['uid_line']] 
    //             // , (err , result)=>{
    //             //     if (err) {
    //             //         dbpacket.dbErrorReturn(con, err, res);
    //             //         console.log("query");
    //             //     }

    //             //     if(result.changedRows == (req.body['count'] - 1)) {
                        
    //             //     }
    //             // })
    //         }
    //     }).catch((err)=>{
    //         con.end()
    //         if(err == "not pass") {
    //             res.send('account not pass')
    //         }
    //     })
    // })
    // manage farmer
}