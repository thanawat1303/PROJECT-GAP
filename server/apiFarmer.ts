require('dotenv').config().parsed
import line from "./configLine";
import * as fs from "fs"
export default function apiFarmer (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any , LINE = line) {

    app.post('/api/farmer/sign' , (req:any , res:any)=>{
        if(req.body['uid'] && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            req.session.uid = req.body['uid']
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT id_table FROM acc_farmer WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)` , 
                    [req.body['uid']] ,
                    (err:any , result:any)=>{
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("query");
                            return 0
                        }
                        con.end()
                        if(result[0]) res.send("search")
                        else res.send("no")
                })
            })
        } else res.send("error auth")
    })

    app.post('/api/farmer/listStation' , (req:any , res:any)=>{
        if(req.session.uid && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT * FROM station_list` , (err:any , result:any)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                        return 0
                    }
                    con.end()
                    res.send(result)
                    
                })
            })
        } else res.send("")
    })

    app.post('/api/farmer/signup' , (req : any , res : any)=>{
        if(req.session.uid && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT id_table FROM acc_farmer WHERE uid_line = ? and register_auth = 0` , 
                            [req.session.uid] , (err : any , search : any) => {
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query search");
                        return 0;
                    }

                    if(!search[0]) {
                        con.query(`INSERT INTO line_chat_gap.acc_farmer(
                            id_farmer,
                            fullname,
                            img,
                            station,
                            location,
                            password,
                            register_auth,
                            uid_line,
                            date_doctor_confirm,
                            id_doctor
                            ) 
                        VALUES (? , ? , ? , ? , POINT(?,?) , SHA2(? , 256) , 0 , ? , "" , "")` , 
                        [
                            req.body['oldID'] , 
                            `${req.body['firstname']} ${req.body['lastname']}` ,
                            req.body['Img'] ,
                            req.body['station'] ,
                            req.body['lat'] ,
                            req.body['lng'] ,
                            req.body['password'] ,
                            req.session.uid
                        ] , (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("insert");
                                return 0;
                            }
                            if(result.affectedRows > 0) {
                                if(result.affectedRows > 1) console.log(result)
                                con.end()
                                try {LINE.linkRichMenuToUser(req.session.uid , "richmenu-e27bfb6f25e7ba8daa207df690e18489")} 
                                catch (e) {
                                    fs.appendFileSync(__dirname.replace('\server' , '/logs/errorfile.json') , `richMenuAddFarm : {id:${req.session.uid} , date : ${new Date().getTime}}`)
                                }
                                res.send("insert complete")
                            }
                        })
                    } else {
                        con.end()
                        res.send("search")
                    }
                })
            })
        } else res.send("")
    })

    app.post('/api/farmer/selectfarmhouse' , (req:any , res:any)=>{
        if(req.session.uid == req.body['uid'] && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`
                            SELECT id_farmHouse FROM housefarm , 
                                (
                                    SELECT uid_line FROM acc_farmer 
                                    WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)
                                    GROUP BY uid_line
                                ) as farmer 
                            WHERE housefarm.uid_line = farmer.uid_line and housefarm.id_farmHouse = ?
                        ` , [
                                req.body['uid'] , req.body['id_farmhouse']
                            ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select house");
                                return 0;
                            }

                            con.end()
                            if(result[0]) res.send("access")
                            else res.send("not")
                        })
                // auth(req.body['uid'] , con , dbpacket , res).then((result)=>{
                //     if(req.body['uid'] == result) {
                //         con.query(`SELECT id_farmHouse FROM housefarm WHERE `)
                //     }
                // })
            })
        } else res.send("error auth")
    })

    app.post('/api/farmer/insertformplant' , (req:any , res:any)=>{
        if(req.session.uid && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`
                            SELECT id_farmHouse FROM housefarm , 
                                (
                                    SELECT uid_line FROM acc_farmer 
                                    WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)
                                    GROUP BY uid_line
                                ) as farmer 
                            WHERE housefarm.uid_line = farmer.uid_line and housefarm.id_farmHouse = ?
                        ` , [
                                req.body['uid'] , req.body['id_farmhouse']
                            ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select house");
                                return 0;
                            }

                            if(result[0]) {
                                con.query(`INSERT INTO formplant 
                                            ( 
                                                id_farmHouse , type_plant , generation_plant , qty_plant , 
                                                space_plant , date_harvest , system_plant , water_plant ,
                                                water_flow_plant , history_plant , submit_plant , id_farmer
                                            ) VALUES (
                                                ? , ? , ? , ? , 
                                                ? , ? , ? , ? ,
                                                ? , ? , ? , ""
                                            );
                                            ` , 
                                            [
                                                req.body['id_farmhouse'] , req.body['type_plant'] , req.body['generation'] , req.body['qty'] ,
                                                req.body['space'] , req.body['date_hervest'] , req.body['system'] , req.body['water'] ,
                                                req.body['water_flow'] , req.body['history'] , 0 
                                            ] ,
                                            (err : any , insert : any)=>{
                                                console.log(insert)
                                                con.end()
                                                res.send("insert")
                                            })
                            }
                            else {
                                con.end()
                                res.send("not")
                            }
                        })
            })
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant' , (req:any , res:any)=>{
        if(req.session.uid == req.body['uid'] && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                const where = (req.body['id_formplant']) ? 
                                `and formplant.id_plant = "${req.body['id_formplant']}"` :
                                ""

                const select = (req.body['id_formplant']) ? 
                                    `formplant.*` :
                                    `formplant.id_plant , formplant.type_plant , formplant.submit_plant , 
                                        formplant.date_plant , formplant.generation , formplant.qty_plant`
                con.query(`
                            SELECT ${select}
                            FROM formplant , 
                                (
                                    SELECT id_farmHouse FROM housefarm , 
                                        (
                                            SELECT uid_line FROM acc_farmer 
                                            WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)
                                            GROUP BY uid_line
                                        ) as farmer 
                                    WHERE housefarm.uid_line = farmer.uid_line and housefarm.id_farmHouse = ?
                                ) as houseFarm
                            WHERE formplant.id_farmHouse = houseFarm.id_farmHouse ${where}
                        ` , 
                        [
                            req.body['uid'] , req.body['id_farmhouse']
                        ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select listform");
                                return 0;
                            }
                            con.end()
                            res.send(result)
                        })
            })
        } else res.send("error auth")
    })

    app.post('/api/farmer/editformplant' , (req:any , res:any)=>{
        if(req.session.uid && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`
                            SELECT formplant.id_plant
                            FROM formplant , 
                                (
                                    SELECT id_farmHouse FROM housefarm , 
                                        (
                                            SELECT uid_line FROM acc_farmer 
                                            WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)
                                            GROUP BY uid_line
                                        ) as farmer 
                                    WHERE housefarm.uid_line = farmer.uid_line and housefarm.id_farmHouse = ?
                                ) as houseFarm
                            WHERE formplant.id_farmHouse = houseFarm.id_farmHouse and formplant.id_plant = ?
                        ` , 
                        [
                            req.body['uid'] , req.body['id_farmhouse'] , req.body['id_formplant']
                        ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select listform");
                                return 0;
                            }

                            if(result[0]) {
                                // req.body['old_content'] คือ ค่าที่ถูกแก้ไข
                                con.query(`
                                    INSERT INTO editformplant 
                                        (id_form_edit , subject_form , content_edit , because_edit , 
                                            id_doctor_scan , note_edit)
                                        VALUES (? , ? , ? , ? ,  , "" , "")
                                        `[
                                            req.body['id_formplant'] , 
                                            req.body['subject'] , 
                                            req.body['old_content'] ,
                                            req.body['because']
                                        ] , (err : any , correct : any)=>{
                                            if (err) {
                                                dbpacket.dbErrorReturn(con, err, res);
                                                console.log("insert edit");
                                                return 0;
                                            }

                                            con.query(
                                                `
                                                    UPDATE formplant SET ? = ? 
                                                    WHERE id_plant = ? 
                                                ` , [
                                                        req.body['subject'],
                                                        req.body['new_content'],
                                                        req.body['id_formplant']
                                                    ] , (err : any , complete : any)=>{
                                                        con.end()
                                                        if(complete.changeRow == 1) res.send("133")
                                                        else res.send("130")
                                                    })
                                        })
                            } else {
                                con.end()
                                res.send("not found")
                            }
                        })
            })
        } else res.send("error auth")
    })

    app.post('/api/farmer/factor' , (req:any , res:any)=>{
        if(req.session.uid && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                const where = (req.body['id_factor']) ? 
                                `and ${req.body['type']}.id = "${req.body['id_factor']}"` :
                                ""

                con.query(`
                            SELECT ${req.body['type']}.* 
                            FROM ${req.body['type']} , 
                                (
                                    SELECT formplant.id_plant
                                    FROM formplant , 
                                        (
                                            SELECT id_farmHouse FROM housefarm , 
                                                (
                                                    SELECT uid_line FROM acc_farmer 
                                                    WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)
                                                    GROUP BY uid_line
                                                ) as farmer 
                                            WHERE housefarm.uid_line = farmer.uid_line and housefarm.id_farmHouse = ?
                                        ) as houseFarm
                                    WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id_plant = ?
                                ) as formPlant
                            WHERE ${req.body['type']}.id_plant = formPlant.id_plant ${where}
                            ORDER BY ${req.body['order']} ASC
                        ` , 
                        [
                            req.body['uid'] , 
                            req.body['id_farmhouse'] , 
                            req.body['id_plant']
                        ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select listform");
                                return 0;
                            }

                            con.end()
                            res.send(result)
                        })
            })
        } else res.send("error auth")
    })



}

// const auth = (uid : any , con : any , dbpacket : any , res : any) => {
//     return new Promise((resole : any , reject : any)=>
//         con.query(`SELECT uid_line FROM acc_farmer WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)` , 
//             [uid] , (err : any, result : any )=>{
//                 if (err) {
//                     dbpacket.dbErrorReturn(con, err, res);
//                     console.log("select account");
//                     return 0;
//                 }

//                 if(result[0]) resole(result['uid_line'])
//                 else resole("")
//             })
//     )
// }