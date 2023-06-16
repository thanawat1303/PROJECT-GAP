require('dotenv').config().parsed
import line from "./configLine";
import * as fs from "fs"
export default function apiFarmer (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any , LINE = line) {

    app.post('/api/farmer/sign' , (req:any , res:any)=>{
        if(req.session.user_doctor != undefined || req.session.pass_doctor != undefined) {
            delete req.session.pass_doctor
            delete req.session.user_doctor
        }

        if(req.body['uid'] && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            req.session.uidFarmer = req.body['uid']
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT id_table , register_auth FROM acc_farmer WHERE uid_line = ?` , 
                    [req.body['uid']] ,
                    (err:any , result:any)=>{
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("query");
                            return 0
                        }
                        con.end()
                        if(result[0]) {
                            if(result[0].register_auth == 0 || result[0].register_auth == 1) {
                                if(req.body['page'] === "signup") {
                                    try {
                                        LINE.linkRichMenuToUser(req.body['uid'] , "richmenu-1a986abf1bce4343ceb3f9f7fed17f30")
                                    } catch (e) {
                                        console.log(e)
                                    }
                                    // req.session.page = req.body['page']
                                }
                                res.send("search")
                            } else {
                                try {
                                    LINE.linkRichMenuToUser(req.body['uid'] , "richmenu-29008f2338b228f0e50630151d38c29e")
                                } catch (e) {
                                    console.log(e)
                                }
                                res.send("no")
                            }
                        }
                        else {
                            res.send("no account")
                        }
                })
            })
        } else res.send("error auth")
    })

    app.post('/api/farmer/station/search' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
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

    app.post('/api/farmer/station/get' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT name FROM station_list WHERE id=?`, [req.body.id_station] , (err:any , result:any)=>{
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
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT id_table FROM acc_farmer WHERE uid_line = ? and register_auth = 0` , 
                            [req.session.uidFarmer] , (err : any , search : any) => {
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
                            req.session.uidFarmer
                        ] , (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("insert");
                                return 0;
                            }
                            if(result.affectedRows > 0) {
                                if(result.affectedRows > 1) console.log(result)
                                con.end()
                                try {LINE.linkRichMenuToUser(req.session.uidFarmer , "richmenu-1a986abf1bce4343ceb3f9f7fed17f30")} 
                                catch (e) {
                                    fs.appendFileSync(__dirname.replace('\server' , '/logs/errorfile.json') , `richMenuAddFarm : {id:${req.session.uidFarmer} , date : ${new Date().getTime}}`)
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
    

    app.post('/api/farmer/farmhouse/add' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                auth(req.session.uidFarmer , con , dbpacket , res).then((result : any)=>{
                    con.query(
                        `
                        INSERT INTO housefarm 
                            (
                                uid_line , 
                                name_house , 
                                img_house , 
                                id_farmer
                            )
                        VALUES (? , ? , ? , ?)` , 
                                    [
                                        result.uid_line , req.body['name'] , req.body['img'] , result.id_farmer
                                    ] , (err : any , insert : any)=>{
                                        if (err) {
                                            dbpacket.dbErrorReturn(con, err, res);
                                            console.log(`insert farmhouse ${result.uid_line}`);
                                            return 0
                                        }

                                        con.end()
                                        console.log(insert)
                                        if(insert.affectedRows > 0) {
                                            if(insert.affectedRows > 1) console.log(insert)
                                            res.send("133")
                                        } else {
                                            res.send("130")
                                        }
                                    })
                }).catch((err : any)=>{
                    res.send("no")
                })
            })

        } else res.send("error auth")
    })

    app.post('/api/farmer/farmhouse/select' , (req:any , res:any)=>{
        if(req.session.uidFarmer == req.body['uid'] && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
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

    app.post('/api/farmer/formplant/insert' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
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
                                let data = req.body
                                con.query(`INSERT INTO formplant 
                                            ( 
                                                id, id_farmHouse , type_main , type ,
                                                generation , date_glow , date_plant,
                                                posi_w , posi_h,
                                                qty , area , date_harvest, system_glow ,
                                                water , water_flow ,
                                                history , insect, qtyInsect,
                                                seft , submit , date_success
                                            ) VALUES (
                                                ? , ? , ? , ? , 
                                                ? , ? , ? , 
                                                ? , ? ,
                                                ? , ? , ? , ? ,
                                                ? , ? ,
                                                ? , ? , ? ,
                                                ? , ? , ""
                                            );
                                            ` , 
                                            [
                                                new Date().getTime() , data.id_farmhouse , data.typePlantHead , data.type , 
                                                data.generetion , new Date(data.dateGlow) , new Date(data.datePlant) , 
                                                data.posiW , data.posiH ,
                                                data.qty , data.area , new Date(data.dateOut) , data.system ,
                                                data.water , data.waterStep , 
                                                data.history , data.insect , data.qtyInsect ,
                                                data.seft , 0
                                            ] ,
                                            (err : any , insert : any)=>{
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

    app.post('/api/farmer/formplant/select' , (req:any , res:any)=>{
        if(req.session.uidFarmer == req.body['uid'] && 
                (req.hostname == HOST_CHECK || !HOST_CHECK) && 
                req.session.page === "authplant") {
            let con = Database.createConnection(listDB)
            delete req.session.page
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                const where = (req.body['id_formplant']) ? 
                                `and formplant.id = "${req.body['id_formplant']}"` :
                                ""

                const select = (req.body['id_formplant']) ? 
                                    `formplant.*` :
                                    `formplant.id , formplant.type_main , formplant.type , formplant.submit , 
                                        formplant.date_plant , formplant.generation , formplant.qty`
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
                            ORDER BY date_plant DESC
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

    app.post('/api/farmer/formplant/edit' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`
                            SELECT formplant.id
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
                            WHERE formplant.id_farmHouse = houseFarm.id_farmHouse and formplant.id = ?
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
                                                    WHERE id = ? 
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

    app.post('/api/farmer/factor/select' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
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
                                    SELECT formplant.id
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
                                    WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                                ) as formPlant
                            WHERE ${req.body['type']}.id_plant = formPlant.id ${where}
                            ORDER BY ${req.body['order']} ASC
                        ` , 
                        [
                            req.body['uid'] , 
                            req.body['id_farmhouse'] , 
                            req.body['id']
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

    app.post('/api/farmer/factor/fertilizer/insert' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`
                            SELECT formplant.id
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
                            WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                        ` , [
                                req.body['uid'] , req.body['id_farmhouse'] , req.body['id']
                            ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select house");
                                return 0;
                            }

                            if(result[0].id == req.body['id']) {
                                let data = req.body
                                console.log(result[0].id , data.name , data.formula_name , data.use , data.volume , data.source , new Date(data.date))
                                con.query(`INSERT INTO formfertilizer 
                                            ( 
                                                id_plant , name , formula_name , use_is , volume , source , date
                                            ) VALUES (
                                                ? , ? , ? , ? , ? , ? , ?
                                            );
                                            ` , 
                                            [
                                                result[0].id , data.name , data.formula_name , data.use , data.volume , data.source , new Date(data.date)
                                            ] ,
                                            (err : any , insert : any)=>{
                                                console.log(insert)
                                                con.end()
                                                if(insert.affectedRows >= 1) res.send("133")
                                                else res.send("130")
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

}

const auth = (uid : any , con : any , dbpacket : any , res : any) => {
    return new Promise((resole : any , reject : any)=>
        con.query(`SELECT * FROM acc_farmer WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)` , 
            [uid] , (err : any, result : any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("select account");
                    return 0;
                }

                if(result[0]) resole(result[0])
                else reject("not found")
            })
    )
}