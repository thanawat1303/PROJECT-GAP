require('dotenv').config().parsed
const line = require('./configLine')
const fs = require('fs')
const RichSign = "richmenu-e6dd99ccb1aebb953c976a8188b20cd7"
const RichHouse = "richmenu-93377925aa45b5dc5585f85749f8af8b"

const {Server} = require('socket.io')
const io = new Server()

module.exports = function apiFarmer (app , Database , apifunc , HOST_CHECK , dbpacket , listDB , socket = io , LINE = line) {

    app.post('/api/farmer/sign' , async (req , res)=>{
        if(req.session.user_doctor != undefined || req.session.pass_doctor != undefined) {
            delete req.session.pass_doctor
            delete req.session.user_doctor
        }

        if(req.body['uid'] && (req.hostname == HOST_CHECK)) {
            req.session.uidFarmer = req.body['uid']
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.end()
                res.send(auth.result)
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/account/check' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {

            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                // req.session.token = {
                //     data : new Date().getTime().toString(),
                //     time : new Date().
                // }
                con.end()
                res.send(auth.result)
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/station/search' , (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT * FROM station_list WHERE is_use = 1` , (err , result)=>{
                    con.end()
                    if(!err) res.send(result)
                    else res.send("error auth")
                })
            })
        } else res.send("error auth")
    })

    app.post('/api/farmer/station/get' , (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT name FROM station_list WHERE id=? and is_use = 1`, [req.body.id_station] , 
                (err , result)=>{
                    con.end()
                    if(!err) res.send(result)
                    else res.send("error auth")
                })
            })
        } else res.send("error auth")
    })

    app.get("/image/farmer/:id_table" , (req , res)=>{
        if(req.params.id_table) {
            let con = Database.createConnection(listDB)
            con.connect(( err )=>{
                if (!err) {
                    con.query(`SELECT img FROM acc_farmer WHERE id_table = ?` , 
                        [req.params.id_table] ,
                        (err , result)=>{
                            con.end()
                            if (!err) {
                                if(result[0]) {
                                    const base64Image = result[0]["img"].toString(); //Buffer to string
                                    const base64Data = base64Image.replace(`data:image/jpeg;base64,`, '');
        
                                    // // แปลง Base64 เป็น Buffer
                                    const imageBuffer = Buffer.from(base64Data, 'base64');
                            
                                    // // // ตั้งค่า Header 'Content-Type'
                                    res.setHeader('Content-Type', 'image/png');
                                    res.setHeader('Transfer-Encoding' , 'chunked')
                            
                                    // ส่งกลับรูปภาพให้กับผู้ใช้
                                    res.end(imageBuffer);
                                }
                                else res.send("not found")
                            } else {
                                res.send("not found")
                            }
                    })
                } res.send("not found")
            })
        } else {
            res.send("not found")
        }
        
    })

    app.post('/api/farmer/signup' , async (req , res)=>{
        const userLine = await new Promise( async (resole , reject)=>{
            try {
                await LINE.getLinkToken(req.session.uidFarmer)
                resole(true)
            } catch(e) {
                resole(false)
            }
        })

        if(userLine && req.session.uidFarmer && (req.hostname == HOST_CHECK) && /^[ก-ฮะ-์]+$/.test(req.body['firstname']) && /^[ก-ฮะ-์]+$/.test(req.body['firstname'])) {
            let con = Database.createConnection(listDB)
            con.connect(( err )=>{
                if (!err) {
                    con.query(`SELECT id_table FROM acc_farmer WHERE uid_line = ? and (register_auth = 0 || register_auth = 1)` , 
                        [req.session.uidFarmer] , (err , search) => {
                        if (!err) {
                            if(!search[0]) {
                                con.query(`INSERT INTO acc_farmer(
                                    id_farmer,
                                    fullname,
                                    img,
                                    station,
                                    location,
                                    password,
                                    register_auth,
                                    uid_line,
                                    date_doctor_confirm,
                                    id_table_doctor,
                                    link_user,
                                    tel_number,
                                    text_location
                                    ) 
                                VALUES ("" , ? , ? , ? , POINT(?,?) , SHA2(? , 256) , 0 , ? , "" , "" , ? , ? , ?)` , 
                                [
                                    `${req.body['firstname'].trim()} ${req.body['lastname'].trim()}` ,
                                    req.body['Img'] ,
                                    req.body['station'] ,
                                    req.body['lat'] ,
                                    req.body['lng'] ,
                                    req.body['password'].trim() ,
                                    req.session.uidFarmer ,
                                    req.session.uidFarmer ,
                                    req.body['telnumber'].trim() ,
                                    req.body['text_location'].trim()
                                ] , (err , result)=>{
                                    con.end()
                                    if (!err) {
                                        if(result.affectedRows > 0) {
                                            try {LINE.linkRichMenuToUser(req.session.uidFarmer , RichHouse)} 
                                            catch (e) {
                                                fs.appendFileSync(__dirname.replace('\server' , '/logs/errorfile.json') , `richMenuAddFarm : {id:${req.session.uidFarmer} , date : ${new Date().getTime}}`)
                                            }
                                            
                                            try {
                                                sendNotifyToDoctor(result.insertId , req.body['station'] , "มีเกษตรกรสมัครบัญชีเข้ามาใหม่")
                                            } catch(e) {}
                                            
                                            res.send("insert complete")
                                        } else {
                                            res.send("error auth")
                                        }
                                    } else {
                                        res.send("error auth")
                                    }
                                })
                            } else {
                                con.end()
                                res.send("search")
                            }
                        } else {
                            con.end()
                            res.send("error auth")
                        }
                    })
                } else {
                    res.send("error")
                }
            })
        } else res.send("error auth")
    })
    
    app.post('/api/farmer/farmhouse/add' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                if(auth) {
                    con.query(
                        `
                        INSERT INTO housefarm 
                            (
                                uid_line , 
                                name_house , 
                                img_house , 
                                link_user,
                                location
                            )
                        VALUES (? , ? , ? , ? , POINT(? , ?))` , 
                        [
                            auth.data.uid_line , req.body['name'].toString().trim() , req.body['img'] , auth.data.link_user , req.body['lag'] , req.body['lng']
                        ] , (err , insert)=>{
                            con.end()
                            if (!err) {
                                if(insert.affectedRows > 0) {
                                    if(insert.affectedRows > 1) console.log(insert)
                                    res.send("133")
                                } else {
                                    res.send("130")
                                }
                            } else {
                                res.send("error auth")
                            }
                        })
                }
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/farmhouse/select' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT id_farm_house FROM housefarm
                            WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                        ` , [
                                auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse
                            ] , 
                        (err , result)=>{
                            con.end()
                            if (!err) {
                                if(result[0]) res.send("access")
                                else res.send("not")
                            } else res.send("error auth")
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.get('/api/farmer/farmhouse/get/detail' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(
                        `
                        SELECT name_house , img_house , id_farm_house , location
                        FROM housefarm
                        WHERE id_farm_house = ? and link_user = ?
                        ` , 
                        [ req.query.id_farmhouse , auth.data.link_user] , 
                        (err , result)=>{
                            con.end()
                            if (!err) {
                                if(result[0]) {
                                    result.map(val=>{
                                        val.img_house = val.img_house.toString()
                                        return val
                                    })
                                    res.send(result)
                                }
                                else res.send("not")
                            } else res.send("error auth")
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/farmhouse/edit' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const name = (req.body.name) ? `name_house = "${req.body.name}"` : ""
                const img = (req.body.img) ? `img_house = "${req.body.img}"` : ""
                const location = (req.body.lag && req.body.lng) ? `location = POINT(${req.body.lag} , ${req.body.lng})` : ""
                const SET = [name , img , location].filter(val=>val).join(" , ")
                if(SET.length != 0) {
                    con.query(
                        `
                        UPDATE housefarm
                        SET ${SET}
                        WHERE id_farm_house = ? and link_user = ?
                        ` , 
                        [ req.body.id_farmhouse , auth.data.link_user ] , 
                        (err , result)=>{
                            con.end()
                            if (!err) res.send("113")
                            else res.send("error auth")
                    })
                } else res.send("error auth")
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })
    // end farmhouse

    // start formplant
    app.post('/api/farmer/formplant/select' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK) ) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const where = (req.body.id_formplant) ? 
                                `and formplant.id = "${req.body.id_formplant}"` :
                                ""

                const select = (req.body.id_formplant) ? 
                                    `formplant.*` :
                                    `formplant.id , formplant.name_plant , formplant.state_status , 
                                        formplant.date_plant , formplant.generation , formplant.qty , 
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM report_detail
                                            WHERE report_detail.id_plant = formplant.id
                                        ) 
                                    ) as report ,
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM check_form_detail
                                            WHERE check_form_detail.id_plant = formplant.id
                                        ) 
                                    ) as form , 
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM check_plant_detail
                                            WHERE check_plant_detail.id_plant = formplant.id
                                        ) 
                                    ) as plant , 
                                    (
                                        SELECT EXISTS (
                                            SELECT id
                                            FROM success_detail
                                            WHERE id_plant = formplant.id and date_of_farmer = ""
                                        )
                                    ) as success
                                    `
                con.query(`
                            SELECT ${select} ,
                            (
                                SELECT type_plant 
                                FROM plant_list 
                                WHERE plant_list.name = formplant.name_plant and plant_list.is_use = 1
                            ) as type_plant
                            FROM formplant , 
                                (
                                    SELECT id_farm_house FROM housefarm
                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.id_farm_house = houseFarm.id_farm_house ${where}
                            ORDER BY formplant.state_status ASC , id DESC
                        ` , 
                        [
                            auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse
                        ] , 
                        async (err , result)=>{
                            if (!err) {
                                if(result[0]) {
                                    if(req.body.id_formplant) {
                                        const ResultEdit = await new Promise((resole , reject)=>{
                                            con.query(
                                                `
                                                SELECT editform.id_edit , editform.status
                                                FROM editform , 
                                                (
                                                    SELECT formplant.id
                                                    FROM formplant , 
                                                        (
                                                            SELECT id_farm_house FROM housefarm
                                                            WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                                        ) as houseFarm
                                                    WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                                                ) as formplant
                                                WHERE editform.id_form = formplant.id and type_form = "plant"
                                                ORDER BY date DESC
                                                ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_formplant ] ,
                                                async (err , resultEditList) => {
                                                    const subjectResultPass = new Map()
                                                    for(let edit of resultEditList) {
                                                        await new Promise((resole , reject)=>{
                                                            con.query(
                                                                `
                                                                SELECT subject_form
                                                                FROM detailedit
                                                                WHERE id_edit = ?
                                                                ` , [edit.id_edit] ,
                                                                (err , resultDetail) => {
                                                                    for(let detail of resultDetail) {
                                                                        if(!subjectResultPass.has(detail.subject_form) && edit.status != 0) {
                                                                            subjectResultPass.set(detail.subject_form , edit.status)
                                                                        }
                                                                    }
    
                                                                    resole("")
                                                                }
                                                            )
                                                        })
                                                    }
                                                    resole(subjectResultPass)
                                                }
                                            )
                                        })
                                        
                                        con.end()
                                        result[0].subjectResult = Object.fromEntries(ResultEdit)
                                        res.send(result)
                                    } else {
                                        con.end()
                                        res.send(result)
                                    }
                                }
                                else {
                                    con.end()
                                    if(req.body.id_formplant) res.send("not found")
                                    else res.send(result)
                                }
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/check' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK) ) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT formplant.id , formplant.state_status
                            FROM formplant , 
                                (
                                    SELECT id_farm_house FROM housefarm
                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.id = ? and houseFarm.id_farm_house = formplant.id_farm_house
                        ` , 
                        [
                            auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_form_plant
                        ] , 
                        (err , result)=>{
                            con.end()
                            if (!err) {
                                if(result[0]) res.send(result)
                                else res.send("not found")
                            } else res.send("error auth")
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/plant/list' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`SELECT name , id , qty_harvest FROM plant_list WHERE is_use = 1` , (err , result)=>{
                    con.end()
                    if (!err) {
                        res.send(result)
                    } else res.send("error auth")
                })
            } catch(err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/history' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK) ) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const QtyDate = await new Promise((resole , reject)=>{
                    con.query(
                        `
                        SELECT qty_harvest
                        FROM plant_list
                        WHERE name = ?
                        ` , [req.body.name_plant_list] , 
                        (err , result)=>{
                            resole(result)
                        }
                    )
                })

                con.query(`
                            SELECT formplant.*
                            FROM formplant , 
                                (
                                    SELECT id_farm_house FROM housefarm
                                    WHERE (housefarm.uid_line = ? or housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.name_plant = ? and houseFarm.id_farm_house = formplant.id_farm_house
                            ORDER BY date_plant DESC
                            LIMIT 1
                        ` , 
                        [
                            auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.name_plant_list
                        ] , 
                        (err , result)=>{
                            con.end()
                            if (!err) {
                                res.send({
                                    FromHistory : result,
                                    qtyDate : QtyDate
                                })
                            } else res.send("error auth")
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/insert' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT id_farm_house FROM housefarm
                            WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                        ` , [
                                auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse
                            ] , 
                        (err , result)=>{
                            if (!err) {
                                if(result[0]) {
                                    const data = req.body
                                    con.query(`INSERT INTO formplant 
                                                ( 
                                                    id, id_farm_house , name_plant ,
                                                    generation , date_glow , date_plant,
                                                    posi_w , posi_h,
                                                    qty , area , date_harvest, system_glow ,
                                                    water , water_flow ,
                                                    history , insect, qtyInsect,
                                                    seft , state_status , date_success
                                                ) VALUES (
                                                    ? , ? , ? , 
                                                    ? , ? , ? , 
                                                    ? , ? ,
                                                    ? , ? , ? , ? ,
                                                    ? , ? ,
                                                    ? , ? , ? ,
                                                    ? , 0 , ""
                                                );
                                                ` , 
                                                [
                                                    new Date().getTime() , data.id_farmhouse , data.name_plant , 
                                                    data.generetion , data.dateGlow.indexOf("#") < 0 ? new Date(data.dateGlow) : data.dateGlow , new Date(data.datePlant) , 
                                                    data.posiW , data.posiH ,
                                                    data.qty , data.area , new Date(data.dateOut) , data.system ,
                                                    data.water , data.waterStep , 
                                                    data.history , data.insect , data.qtyInsect ,
                                                    data.seft
                                                ] ,
                                                (err , insert)=>{
                                                    if (err) {
                                                        dbpacket.dbErrorReturn(con, err, res);
                                                        console.log("select listform");
                                                        return 0;
                                                    }
                                                    con.end()
                                                    try {
                                                        sendNotifyToDoctor(auth.data.id_table , auth.data.station , `เกษตรกร ${auth.data.fullname} มีการเพิ่มแบบบันทึก`)
                                                    } catch (e) {}
                                                    res.send("insert")
                                                })
                                }
                                else {
                                    con.end()
                                    res.send("not")
                                }
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/edit' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(` 
                            SELECT formplant.*
                            FROM formplant , 
                                (
                                    SELECT id_farm_house FROM housefarm
                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                        ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant] , 
                        (err , result)=>{
                            if (!err) {
                                if(result[0]) {
                                    let data = req.body
                                    if(result[0].state_status == 0 || result[0].state_status == 1) {
                                        con.query(
                                            `
                                            INSERT INTO editform 
                                                ( id_form , id_doctor , because , note , status , type_form )
                                                VALUES 
                                                ( ? , ? , ? , ? , ? , "plant" )
                                            ` , [ data.id_plant , "" , data.because , "" , 0 ] ,
                                            (err , resultEdit) => {
                                                if (err) {
                                                    dbpacket.dbErrorReturn(con, err, res);
                                                    console.log("insert editform");
                                                    return 0;
                                                }
    
                                                if(resultEdit.insertId > 0) {
                                                    const arrUpdate = new Array
                                                    let checkerr = false
                                                    for(let subject in data.dataChange) {
                                                        con.query(
                                                            `
                                                            INSERT INTO detailedit
                                                                (id_edit , subject_form , old_content , new_content)
                                                                VALUES 
                                                                ( ? , ? , ? , ?)
                                                            ` , [ resultEdit.insertId , subject , result[0][subject] , data.dataChange[subject] ] ,
                                                            (err , Edit) => {
                                                                if (err) {
                                                                    dbpacket.dbErrorReturn(con, err, res);
                                                                    console.log("insert detailedit");
                                                                    return 0;
                                                                }
    
                                                                if( Edit.insertId ) {
                                                                    arrUpdate.push(`${subject}="${data.dataChange[subject]}"`)
                                                                    if(arrUpdate.length == data.num) {
                                                                        let strUpdate = arrUpdate.join(" , ")
                                                                        con.query(
                                                                            `
                                                                            UPDATE formplant 
                                                                            SET ${strUpdate}
                                                                            WHERE id = ?
                                                                            ` , [ data.id_plant ] , 
                                                                            (err , update) => {
                                                                                if (err) {
                                                                                    dbpacket.dbErrorReturn(con, err, res);
                                                                                    console.log("update form");
                                                                                    return 0;
                                                                                }
                                                                                con.end()
                                                                                try {
                                                                                    sendNotifyToDoctor(auth.data.id_table , auth.data.station , `เกษตรกร ${auth.data.fullname} ทำการแก้ไขแบบฟอร์มบันทึกข้อมูล\nรหัสแบบฟอร์ม ${data.id_plant}`)
                                                                                } catch (e) {}
                                                                                res.send("133")
                                                                            }
                                                                        )
                                                                    }
                                                                } else {
                                                                    checkerr = true
                                                                }
                                                            }
                                                        )
                                                        if(checkerr) {
                                                            con.end()
                                                            res.send("edit")
                                                            break
                                                        }
                                                    }
                                                } else {
                                                    con.end()
                                                    res.send("edit")
                                                }
                                            }
                                        )
                                    }
                                    else {
                                        con.end()
                                        res.send("submit")
                                    }
                                }
                                else {
                                    con.end()
                                    res.send("not")
                                }
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
            } catch (err) {
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/edit/select' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const type = req.body.id_edit ? "*" : "id_edit" ;
                const where = req.body.id_edit ? `and editform.id_edit = '${req.body.id_edit}'` : "" ;
                con.query(` 
                            SELECT editform.${type} FROM editform , 
                            (
                                SELECT formplant.id
                                FROM formplant , 
                                    (
                                        SELECT id_farm_house FROM housefarm
                                        WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                    ) as houseFarm
                                WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                            ) as formplant
                            WHERE editform.id_form = formplant.id and type_form = "plant" ${where}
                            ORDER BY date DESC
                        ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant ] , 
                        (err , result)=>{
                            if (!err) {
                                if(req.body.id_edit) {
                                    con.query(
                                        `
                                        SELECT * FROM detailedit
                                        WHERE id_edit = ?
                                        ` , [req.body.id_edit] , 
                                        (err , detail) => {
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
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })
    // end formplant

    // start factor
    app.post('/api/farmer/factor/select' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const where = (req.body.id_factor) ? 
                                `and form${req.body.type}.id = "${req.body.id_factor}"` :
                                ""

                const Type = req.body.type == "fertilizer" ? "fertilizer" : "chemical";       

                con.query(`
                            SELECT form${Type}.* , formPlant.state_status
                            FROM form${Type} , 
                                (
                                    SELECT formplant.id , formplant.state_status
                                    FROM formplant , 
                                        (
                                            SELECT id_farm_house FROM housefarm
                                            WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                        ) as houseFarm
                                    WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                                ) as formPlant
                            WHERE form${Type}.id_plant = formPlant.id ${where}
                            ORDER BY ${req.body.order} DESC
                        ` , 
                        [
                            auth.data.uid_line , auth.data.link_user , 
                            req.body.id_farmhouse , 
                            req.body.id_plant
                        ] , 
                        async (err , result)=>{
                            if (!err) {
                                for(let index in result) {
                                    const ResultEdit = await new Promise((resole , reject)=>{
                                        con.query(
                                            `
                                            SELECT editform.id_edit , editform.status
                                            FROM editform
                                            WHERE editform.id_form = ? and type_form = "${Type}"
                                            ORDER BY date DESC
                                            ` , [ result[index].id ] ,
                                            async (err , resultEditList) => {
                                                const subjectResultPass = new Map()
                                                for(let edit of resultEditList) {
                                                    await new Promise((resole , reject)=>{
                                                        con.query(
                                                            `
                                                            SELECT subject_form
                                                            FROM detailedit
                                                            WHERE id_edit = ?
                                                            ` , [edit.id_edit] ,
                                                            (err , resultDetail) => {
                                                                for(let detail of resultDetail) {
                                                                    if(!subjectResultPass.has(detail.subject_form) && edit.status != 0) {
                                                                        subjectResultPass.set(detail.subject_form , edit.status)
                                                                    }
                                                                }
        
                                                                resole("")
                                                            }
                                                        )
                                                    })
                                                }
                                                resole(subjectResultPass)
                                            }
                                        )
                                    })
                                    
                                    result[index].subjectResult = Object.fromEntries(ResultEdit)
                                }
    
                                con.end()
                                res.send(result)
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/get/auto' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`SELECT * FROM ${req.body.type}_list WHERE is_use = 1` , (err , result)=>{
                    con.end()
                    if (!err) {
                        res.send(result)
                    } else res.send("error auth")
                })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/insert' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT formplant.id , formplant.state_status
                            FROM formplant , 
                                (
                                    SELECT id_farm_house FROM housefarm
                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                        ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant ] , 
                        (err , result)=>{
                            if (!err) {
                                if(result[0]) {
                                    if(result[0].state_status == 0 || result[0].state_status == 1) {
                                        let data = req.body
                                        const sql = data.type_insert === "z" ? 
                                                        `INSERT INTO formfertilizer 
                                                        ( 
                                                            id_plant , name , formula_name , use_is , volume , source , date
                                                        ) VALUES (
                                                            ? , ? , ? , ? , ? , ? , ?
                                                        );
                                                        ` : 
                                                    data.type_insert === "c" ? 
                                                        `INSERT INTO formchemical 
                                                        ( 
                                                            id_plant , name , formula_name , insect , use_is , rate , volume , source , date_safe , date
                                                        ) VALUES (
                                                            ? , ? , ? , ? , ? , ? , ? , ? , ? , ?
                                                        );
                                                        ` : ""
                                        const ArrayData = data.type_insert === "z" ? 
                                                            [ data.id_plant , data.name , data.formula_name , data.use , data.volume , data.source , new Date(data.date) ] :
                                                        data.type_insert === "c" ? 
                                                            [ data.id_plant , data.name , data.formula_name , data.insect , data.use , data.rate , data.volume , data.source , new Date(data.dateSafe) , new Date(data.date) ] : []
                                        
                                        con.query(sql , ArrayData ,
                                                    (err , insert)=>{
                                                        try {
                                                            sendNotifyToDoctor(auth.data.id_table , auth.data.station , `เกษตรกร ${auth.data.fullname}\nมีการเพิ่ม${data.type_insert == "z" ? "ปัจจัยการผลิต" : "สารเคมี"}\nที่ฟอร์มไอดี ${data.id_plant}`)
                                                        } catch (e) {}
                                                        con.end()
                                                        res.send("insert")
                                                        // if(insert.affectedRows >= 1) 
                                                        // else res.send("130")
                                                    })
                                    } else {
                                        // เวลา submit แล้ว
                                        con.end()
                                        res.send("submit")
                                    }
                                }
                                else {
                                    con.end()
                                    res.send("not")
                                }
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
            } catch (err) {
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/edit' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const TypeFrom = req.body.type_form == "fertilizer" ? "fertilizer" : req.body.type_form == "chemical" ? "chemical" : "";
                if(TypeFrom) {
                    con.query(` 
                            SELECT form${TypeFrom}.* , formplant.state_status
                            FROM form${TypeFrom} ,
                            (
                                SELECT formplant.id , formplant.state_status
                                FROM formplant , 
                                    (
                                        SELECT id_farm_house FROM housefarm
                                        WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                    ) as houseFarm
                                WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                            ) as formplant
                            WHERE form${TypeFrom}.id_plant = formplant.id and form${TypeFrom}.id = ?
                        ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant , req.body.id_form] , 
                        (err , result)=>{
                            if (!err) {
                                if(result[0]) {
                                    let data = req.body
                                    if(result[0].state_status == 0 || result[0].state_status == 1) {
                                        con.query(
                                            `
                                            INSERT INTO editform 
                                                ( id_form , id_doctor , because , note , status , type_form )
                                                VALUES 
                                                ( ? , ? , ? , ? , ? , ? )
                                            ` , [ data.id_form , "" , data.because , "" , 0 , data.type_form ] ,
                                            (err , resultEdit) => {
                                                if (err) {
                                                    dbpacket.dbErrorReturn(con, err, res);
                                                    console.log("insert editform");
                                                    return 0;
                                                }
    
                                                if(resultEdit.insertId > 0) {
                                                    const arrUpdate = new Array
                                                    let checkerr = false
                                                    for(let subject in data.dataChange) {
                                                        con.query(
                                                            `
                                                            INSERT INTO detailedit
                                                                (id_edit , subject_form , old_content , new_content)
                                                                VALUES 
                                                                ( ? , ? , ? , ?)
                                                            ` , [ resultEdit.insertId , subject , result[0][subject] , data.dataChange[subject] ] ,
                                                            (err , Edit) => {
                                                                if (err) {
                                                                    dbpacket.dbErrorReturn(con, err, res);
                                                                    console.log("insert detailedit");
                                                                    return 0;
                                                                }
    
                                                                if( Edit.insertId ) {
                                                                    arrUpdate.push(`${subject}="${data.dataChange[subject]}"`)
                                                                    if(arrUpdate.length == data.num) {
                                                                        let strUpdate = arrUpdate.join(" , ")
                                                                        con.query(
                                                                            `
                                                                            UPDATE form${TypeFrom} 
                                                                            SET ${strUpdate}
                                                                            WHERE id = ?
                                                                            ` , [ data.id_form ] , 
                                                                            (err , update) => {
                                                                                if (!err) {
                                                                                    try {
                                                                                        sendNotifyToDoctor(auth.data.id_table , auth.data.station , `เกษตรกร ${auth.data.fullname}\nทำการแก้ไข${TypeFrom == "fertilizer" ? "ปัจจัยการผลิต" : "สารเคมี"}\nที่ฟอร์มไอดี ${req.body.id_plant}`)
                                                                                    } catch (e) {}
                                                                                    con.end()
                                                                                    res.send("133")
                                                                                } else {
                                                                                    res.send("error auth")
                                                                                }
                                                                            }
                                                                        )
                                                                    }
                                                                } else {
                                                                    checkerr = true
                                                                }
                                                            }
                                                        )
                                                        if(checkerr) {
                                                            con.end()
                                                            res.send("edit")
                                                            break
                                                        }
                                                    }
                                                } else {
                                                    con.end()
                                                    res.send("edit")
                                                }
                                            }
                                        )
                                    }
                                    else {
                                        con.end()
                                        res.send("submit")
                                    }
                                }
                                else {
                                    con.end()
                                    res.send("not")
                                }
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
                } else {
                    res.send("error auth")
                }
            } catch (err) {
                console.log(err)
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/edit/select' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const type = req.body.id_edit ? "*" : "id_edit" ;
                const where = req.body.id_edit ? `and editform.id_edit = '${req.body.id_edit}'` : "" ;
                const TypeFrom = req.body.type_form == "fertilizer" ? "fertilizer" : req.body.type_form == "chemical" ? "chemical" : "";
                if(TypeFrom) {
                    con.query(` 
                            SELECT editform.${type} FROM editform , 
                            (
                                SELECT form${TypeFrom}.id
                                FROM form${TypeFrom} ,
                                (
                                    SELECT formplant.id
                                    FROM formplant , 
                                        (
                                            SELECT id_farm_house FROM housefarm
                                            WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                        ) as houseFarm
                                    WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                                ) as formplant
                                WHERE form${TypeFrom}.id_plant = formplant.id and form${TypeFrom}.id = ?
                            ) as factor
                            WHERE editform.id_form = factor.id and type_form = ? ${where}
                        ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant , req.body.id_form_factor , req.body.type_form] , 
                        (err , result)=>{
                            if (!err) {
                                if(req.body.id_edit) {
                                    con.query(
                                        `
                                        SELECT * FROM detailedit
                                        WHERE id_edit = ?
                                        ` , [req.body.id_edit] , 
                                        (err , detail) => {
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
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
                }
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    // success 
    app.post('/api/farmer/success/list' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(
                            `
                            SELECT success_detail.id , formPlant.name_station , type_success , date_of_doctor , date_of_farmer
                            FROM success_detail , 
                            (
                                SELECT formplant.id , houseFarm.name_station
                                FROM formplant , 
                                    (
                                        SELECT id_farm_house , (
                                            SELECT name FROM station_list WHERE station_list.id = ?
                                        ) as name_station
                                        FROM housefarm
                                        WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                    ) as houseFarm
                                WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                            ) as formPlant
                            WHERE success_detail.id_plant = formPlant.id
                            ` , [ auth.data.station , auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant ] ,
                            (err  , result) => {
                                con.end()
                                if (!err) res.send(result)
                                else res.send("error auth")
                            }
                        )
                
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/success/get' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(
                            `
                            SELECT success_detail.id_success
                            FROM success_detail , 
                            (
                                SELECT formplant.id
                                FROM formplant , 
                                    (
                                        SELECT id_farm_house
                                        FROM housefarm
                                        WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                    ) as houseFarm
                                WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                            ) as formPlant
                            WHERE success_detail.id_plant = formPlant.id and date_of_farmer != "" and success_detail.id = ?
                            ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant , req.body.id_table ] ,
                            (err  , result) => {
                                con.end()
                                if(!err) res.send(result)
                                else res.send("error auth")
                            }
                        )
                
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/success/update' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT formplant.id
                            FROM formplant , 
                                (
                                    SELECT id_farm_house FROM housefarm
                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                        ` , [ auth.data.uid_line , auth.data.link_user , req.body.id_farmhouse , req.body.id_plant ] , 
                        (err , result)=>{
                            if (!err) {
                                if(result[0]) {
                                    let data = req.body
                                    con.query(
                                                `
                                                UPDATE success_detail SET date_of_farmer = ? 
                                                WHERE id = ? and id_plant = ? and date_of_farmer = ""
                                                ` , [new Date() , data.id_table_success , data.id_plant ] , 
                                                (err , result) => {
                                                    if (err) {
                                                        dbpacket.dbErrorReturn(con, err, res);
                                                        console.log(`inst success id_table ${data.id_table_success} id_plant ${data.id_plant}`);
                                                        return 0;
                                                    }
    
                                                    con.end()
                                                    res.send("133")
                                                }
                                            )
                                }
                                else {
                                    con.end()
                                    res.send("not")
                                }
                            } else {
                                con.end()
                                res.send("error auth")
                            }
                        })
            } catch (err) {
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    //report 
    app.get('/api/farmer/report/check' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(
                    `
                    SELECT (
                        SELECT EXISTS (
                            SELECT id
                            FROM report_detail
                            WHERE report_detail.id_plant = formplant.id
                        ) 
                    ) as report ,
                    (
                        SELECT EXISTS (
                            SELECT id
                            FROM check_form_detail
                            WHERE check_form_detail.id_plant = formplant.id
                        ) 
                    ) as form , 
                    (
                        SELECT EXISTS (
                            SELECT id
                            FROM check_plant_detail
                            WHERE check_plant_detail.id_plant = formplant.id
                        ) 
                    ) as plant ,
                    (
                        SELECT EXISTS (
                            SELECT id
                            FROM success_detail
                            WHERE id_plant = formplant.id and date_of_farmer = ""
                        )
                    ) as success
                    FROM formplant , 
                        (
                            SELECT id_farm_house , (
                                SELECT name FROM station_list WHERE station_list.id = ?
                            ) as name_station
                            FROM housefarm
                            WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                        ) as houseFarm
                    WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                    ` , [ auth.data.station , auth.data.uid_line , auth.data.link_user , req.query.id_farmhouse , req.query.id_plant ] ,
                    async (err  , check) => {
                        if (!err) {
                            const ResultEdit = await new Promise((resole , reject)=>{
                                con.query(
                                    `
                                    SELECT editform.id_edit , editform.status
                                    FROM editform , 
                                    (
                                        SELECT formplant.id
                                        FROM formplant , 
                                            (
                                                SELECT id_farm_house FROM housefarm
                                                WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                            ) as houseFarm
                                        WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                                    ) as formplant
                                    WHERE editform.id_form = formplant.id and type_form = "plant"
                                    ORDER BY date DESC
                                    ` , [ auth.data.uid_line , auth.data.link_user , req.query.id_farmhouse , req.query.id_plant ] ,
                                    async (err , resultEditList) => {
                                        const subjectResultPass = new Map()
                                        for(let edit of resultEditList) {
                                            await new Promise((resole , reject)=>{
                                                con.query(
                                                    `
                                                    SELECT subject_form
                                                    FROM detailedit
                                                    WHERE id_edit = ?
                                                    ` , [edit.id_edit] ,
                                                    (err , resultDetail) => {
                                                        for(let detail of resultDetail) {
                                                            if(!subjectResultPass.has(detail.subject_form) && edit.status != 0) {
                                                                subjectResultPass.set(detail.subject_form , edit.status)
                                                            }
                                                        }
                                                        resole("")
                                                    }
                                                )
                                            })
                                        }
                                        resole(Array.from(subjectResultPass).filter(val=>val[1] == 2).length)
                                    }
                                )
                            })
    
                            const ResultEditFertilizer = await new Promise((resole , reject)=>{
                                con.query(
                                    `
                                    SELECT editform.id_edit , editform.status
                                    FROM editform , 
                                    (
                                        SELECT formfertilizer.id
                                        FROM formfertilizer ,
                                        (
                                            SELECT formplant.id
                                            FROM formplant , 
                                                (
                                                    SELECT id_farm_house FROM housefarm
                                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                                ) as houseFarm
                                            WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                                        ) as formplant
                                        WHERE formfertilizer.id_plant = formplant.id
                                    ) as fertilizer
                                    WHERE editform.id_form = fertilizer.id and type_form = "fertilizer"
                                    ORDER BY date DESC
                                    ` , [ auth.data.uid_line , auth.data.link_user , req.query.id_farmhouse , req.query.id_plant ] ,
                                    async (err , resultEditList) => {
                                        const subjectResultPass = new Map()
                                        for(let edit of resultEditList) {
                                            await new Promise((resole , reject)=>{
                                                con.query(
                                                    `
                                                    SELECT subject_form
                                                    FROM detailedit
                                                    WHERE id_edit = ?
                                                    ` , [edit.id_edit] ,
                                                    (err , resultDetail) => {
                                                        for(let detail of resultDetail) {
                                                            if(!subjectResultPass.has(detail.subject_form) && edit.status != 0) {
                                                                subjectResultPass.set(detail.subject_form , edit.status)
                                                            }
                                                        }
    
                                                        resole("")
                                                    }
                                                )
                                            })
                                        }
                                        resole(Array.from(subjectResultPass).filter(val=>val[1] == 2).length)
                                    }
                                )
                            })
    
                            const ResultEditChemical = await new Promise((resole , reject)=>{
                                con.query(
                                    `
                                    SELECT editform.id_edit , editform.status
                                    FROM editform , 
                                    (
                                        SELECT formchemical.id
                                        FROM formchemical ,
                                        (
                                            SELECT formplant.id
                                            FROM formplant , 
                                                (
                                                    SELECT id_farm_house FROM housefarm
                                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                                ) as houseFarm
                                            WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                                        ) as formplant
                                        WHERE formchemical.id_plant = formplant.id
                                    ) as chemical
                                    WHERE editform.id_form = chemical.id and type_form = "chemical"
                                    ORDER BY date DESC
                                    ` , [ auth.data.uid_line , auth.data.link_user , req.query.id_farmhouse , req.query.id_plant ] ,
                                    async (err , resultEditList) => {
                                        const subjectResultPass = new Map()
                                        for(let edit of resultEditList) {
                                            await new Promise((resole , reject)=>{
                                                con.query(
                                                    `
                                                    SELECT subject_form
                                                    FROM detailedit
                                                    WHERE id_edit = ?
                                                    ` , [edit.id_edit] ,
                                                    (err , resultDetail) => {
                                                        for(let detail of resultDetail) {
                                                            if(!subjectResultPass.has(detail.subject_form) && edit.status != 0) {
                                                                subjectResultPass.set(detail.subject_form , edit.status)
                                                            }
                                                        }
    
                                                        resole("")
                                                    }
                                                )
                                            })
                                        }
                                        resole(Array.from(subjectResultPass).filter(val=>val[1] == 2).length)
                                    }
                                )
                            })
    
                            con.end()
                            res.send({
                                ...check,
                                checkEditPlant : ResultEdit,
                                checkEditFertilizer : ResultEditFertilizer,
                                checkEditChemical : ResultEditChemical,
                            })
                        } else {
                            con.end()
                            res.send("error auth")
                        }
                    }
                )
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.get('/api/farmer/report/list' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                const Type = req.query.type === "h" ? "success_detail" :
                                req.query.type === "r" ? "report_detail" :
                                req.query.type === "cf" ? "check_form_detail" :
                                req.query.type === "cp" ? "check_plant_detail" : ""
                if(Type) {
                    con.query(
                        req.query.type === "h" ?
                        `
                        SELECT success_detail.id , formPlant.name_station , type_success , date_of_doctor , date_of_farmer
                        FROM success_detail , 
                        (
                            SELECT formplant.id , houseFarm.name_station
                            FROM formplant , 
                                (
                                    SELECT id_farm_house , (
                                        SELECT name FROM station_list WHERE station_list.id = ?
                                    ) as name_station
                                    FROM housefarm
                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                        ) as formPlant
                        WHERE success_detail.id_plant = formPlant.id
                        ` :
                        `
                        SELECT ${Type}.* , 
                        (
                            SELECT fullname_doctor
                            FROM acc_doctor
                            WHERE acc_doctor.id_table_doctor = ${Type}.id_table_doctor
                        ) as name_doctor
                        FROM ${Type} , 
                        (
                            SELECT formplant.id , houseFarm.name_station
                            FROM formplant , 
                                (
                                    SELECT id_farm_house , (
                                        SELECT name FROM station_list WHERE station_list.id = ?
                                    ) as name_station
                                    FROM housefarm
                                    WHERE (housefarm.uid_line = ? || housefarm.link_user = ?) and housefarm.id_farm_house = ?
                                ) as houseFarm
                            WHERE formplant.id_farm_house = houseFarm.id_farm_house && formplant.id = ?
                        ) as formPlant
                        WHERE ${Type}.id_plant = formPlant.id
                        ` , [ auth.data.station , auth.data.uid_line , auth.data.link_user , req.query.id_farmhouse , req.query.id_plant ] ,
                        (err  , list) => {
                            con.end()
                            if(!err) res.send(list)
                            else res.send("error auth")
                        }
                    )
                } else {
                    con.end()
                    res.send("error auth")
                }
                
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })


    //start source 
    app.post('/api/farmer/source/get' , async (req , res)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`SELECT id , name FROM source_list WHERE is_use = 1` , (err , result)=>{
                    con.end()
                    if(!err) res.send(result)
                    else res.send("error auth")
                })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    const sendNotifyToDoctor = async (id_table , stationSend , msg) => {
        let con = Database.createConnection(listDB)
        con.connect( async ( err )=>{
            if(!err) {
                const Uid_line_send = await new Promise( async (resole , reject)=>{
                    const uid_send = new Array
                    await new Promise( async (resole , reject)=>{
                        const ObjectProfile = await new Promise((resole , reject)=>{
                            con.query(
                                `
                                SELECT uid_line_doctor
                                FROM acc_doctor
                                WHERE station_doctor = ? and status_account = 1 and status_delete = 0
                                ` , [stationSend] , 
                                (err , doctor) => {
                                    resole(doctor)
                                }
                            )
                        })
                        if(ObjectProfile.length > 0) {
                            const List_uid = ObjectProfile.map((val)=>val.uid_line_doctor).filter((val)=>val)
                            uid_send.push(...List_uid)
                        }
                        resole("")
                    })
                    resole(new Set(uid_send))
                })
                con.query(
                    `
                    INSERT notify_doctor 
                    (id_table_farmer , id_read , notify , station ) VALUES (? , ? , ? , ? )
                    ` , [id_table , '{}' , msg , stationSend] , 
                    (err , result) => {
                        con.end()
                    }
                )
                
                socket.to(`notify-${stationSend}`).emit("update")
                if(Uid_line_send.size != 0) {
                    line.multicast([...Uid_line_send] , {type : "text" , text : `${msg}`})
                        .catch(e=>{})
                }
            }
        })
    }
    
}

const authCheck = (con , dbpacket , res , req , LINE) => {
    return new Promise( async (resole , reject)=>{
        const userLine = await new Promise( async (resole , reject)=>{
            try {
                await LINE.getLinkToken(req.session.uidFarmer)
                resole(true)
            } catch(e) {
                resole(false)
            }
        })

        if(userLine) {
            con.connect(( err )=>{
                if (!err) {
                    con.query(`
                            SELECT * FROM acc_farmer 
                            WHERE uid_line = ?
                            ORDER BY register_auth DESC , date_register DESC
                                ` , 
                        [req.session.uidFarmer] ,
                        (err , result)=>{
                            if (!err) {
                                if(result.length != 0) {
                                    const ProfilePass = result.filter(profile=>profile.register_auth == 0 || profile.register_auth == 1)
                                    if(ProfilePass.length != 0) {
                                        if(req.body['page'] === "signup") {
                                            try {
                                                LINE.unlinkRichMenuFromUser(req.session.uidFarmer)
                                                LINE.linkRichMenuToUser(req.session.uidFarmer , RichHouse)
                                            } catch (e) {}
                                        }
                                        resole({
                                            result : "search",
                                            data : ProfilePass[0]
                                        })
                                    } else {
                                        try {
                                            LINE.unlinkRichMenuFromUser(req.session.uidFarmer)
                                            LINE.linkRichMenuToUser(req.session.uidFarmer , RichSign)
                                        } catch (e) {}
                                        reject("no")
                                    }
                                }
                                else {
                                    try {
                                        LINE.unlinkRichMenuFromUser(req.session.uidFarmer)
                                        LINE.linkRichMenuToUser(req.session.uidFarmer , RichSign)
                                    } catch (e) {}
                                    reject("no account")
                                }
                            } else reject("no")
                    })
                } else reject("no")
            })
        } else reject("no")
    })
}

// const auth = (uid , con , dbpacket , res) => {
//     return new Promise((resole , reject)=>
//         con.query(`SELECT * FROM acc_farmer WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)` , 
//             [uid] , (err, result )=>{
//                 if (err) {
//                     dbpacket.dbErrorReturn(con, err, res);
//                     console.log("select account");
//                     return 0;
//                 }

//                 if(result[0]) resole(result[0])
//                 else reject("not found")
//             })
//     )
// }