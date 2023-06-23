require('dotenv').config().parsed
import line from "./configLine";
import * as fs from "fs"
const RichSign = "richmenu-e6dd99ccb1aebb953c976a8188b20cd7"
const RichHouse = "richmenu-93377925aa45b5dc5585f85749f8af8b"
export default function apiFarmer (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any , LINE = line) {

    app.post('/api/farmer/sign' , async (req:any , res:any)=>{
        if(req.session.user_doctor != undefined || req.session.pass_doctor != undefined) {
            delete req.session.pass_doctor
            delete req.session.user_doctor
        }

        if(req.body['uid'] && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            req.session.uidFarmer = req.body['uid']
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.end()
                res.send(auth.result)
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/account/check' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {

            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
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

    app.post('/api/farmer/station/search' , (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT * FROM station_list WHERE is_use = 1` , (err:any , result:any)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                        return 0
                    }
                    con.end()
                    res.send(result)
                    
                })
            })
        } else res.send("error auth")
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

                con.query(`SELECT name FROM station_list WHERE id=? and is_use = 1`, [req.body.id_station] , (err:any , result:any)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                        return 0
                    }
                    con.end()
                    res.send(result)
                    
                })
            })
        } else res.send("error auth")
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

                con.query(`SELECT id_table FROM acc_farmer WHERE uid_line = ? and (register_auth = 0 || register_auth = 1)` , 
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
                                try {LINE.linkRichMenuToUser(req.session.uidFarmer , RichHouse)} 
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
        } else res.send("error auth")
    })
    
    app.post('/api/farmer/farmhouse/add' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                if(auth) {
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
                            auth.data.uid_line , req.body['name'] , req.body['img'] , auth.data.id_farmer
                        ] , (err : any , insert : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log(`insert farmhouse ${auth.data.uid_line}`);
                                return 0
                            }

                            con.end()
                            if(insert.affectedRows > 0) {
                                if(insert.affectedRows > 1) console.log(insert)
                                res.send("133")
                            } else {
                                res.send("130")
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

    app.post('/api/farmer/farmhouse/select' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT id_farmHouse FROM housefarm
                            WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                        ` , [
                                auth.data.uid_line , req.body.id_farmhouse
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
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })
    // end farmhouse

    app.post('/api/farmer/formplant/select' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK) ) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                const where = (req.body.id_formplant) ? 
                                `and formplant.id = "${req.body.id_formplant}"` :
                                ""

                const select = (req.body.id_formplant) ? 
                                    `formplant.*` :
                                    `formplant.id , formplant.name_plant , formplant.submit , 
                                        formplant.date_plant , formplant.generation , formplant.qty`
                con.query(`
                            SELECT ${select} ,
                            (
                                SELECT type_plant 
                                FROM plant_list 
                                WHERE plant_list.name = formplant.name_plant and plant_list.is_use = 1
                            ) as type_plant
                            FROM formplant , 
                                (
                                    SELECT id_farmHouse FROM housefarm
                                    WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                ) as houseFarm
                            WHERE formplant.id_farmHouse = houseFarm.id_farmHouse ${where}
                            ORDER BY date_plant DESC
                        ` , 
                        [
                            auth.data.uid_line , req.body.id_farmhouse
                        ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select listform");
                                return 0;
                            }
                            con.end()
                            if(result[0]) res.send(result)
                            else {
                                if(req.body.id_formplant) res.send("not found")
                                else res.send(result)
                            }
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/check' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK) ) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT formplant.id
                            FROM formplant , 
                                (
                                    SELECT id_farmHouse FROM housefarm
                                    WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                ) as houseFarm
                            WHERE formplant.id = ?
                        ` , 
                        [
                            auth.data.uid_line , req.body.id_farmhouse , req.body.id_form_plant
                        ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select listform");
                                return 0;
                            }
                            con.end()
                            if(result[0]) res.send("found")
                            else res.send("not found")
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/plant/list' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`SELECT name , id FROM plant_list WHERE is_use = 1` , (err:any , result:any)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                        return 0
                    }
                    con.end()
                    res.send(result)
                    
                })
            } catch(err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/history' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK) ) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT formplant.*
                            FROM formplant , 
                                (
                                    SELECT id_farmHouse FROM housefarm
                                    WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                ) as houseFarm
                            WHERE formplant.name_plant = ?
                            ORDER BY date_plant DESC
                            LIMIT 1
                        ` , 
                        [
                            auth.data.uid_line , req.body.id_farmhouse , req.body.name_plant_list
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
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/formplant/insert' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT id_farmHouse FROM housefarm
                            WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                        ` , [
                                auth.data.uid_line , req.body.id_farmhouse
                            ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select house");
                                return 0;
                            }

                            if(result[0]) {
                                const data = req.body
                                con.query(`INSERT INTO formplant 
                                            ( 
                                                id, id_farmHouse , name_plant ,
                                                generation , date_glow , date_plant,
                                                posi_w , posi_h,
                                                qty , area , date_harvest, system_glow ,
                                                water , water_flow ,
                                                history , insect, qtyInsect,
                                                seft , submit , date_success
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
                                                data.generetion , new Date(data.dateGlow) , new Date(data.datePlant) , 
                                                data.posiW , data.posiH ,
                                                data.qty , data.area , new Date(data.dateOut) , data.system ,
                                                data.water , data.waterStep , 
                                                data.history , data.insect , data.qtyInsect ,
                                                data.seft
                                            ] ,
                                            (err : any , insert : any)=>{
                                                if (err) {
                                                    dbpacket.dbErrorReturn(con, err, res);
                                                    console.log("select listform");
                                                    return 0;
                                                }
                                                con.end()
                                                res.send("insert")
                                            })
                            }
                            else {
                                con.end()
                                res.send("not")
                            }
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
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
                            req.body['uid'] , req.body.id_farmhouse , req.body.id_formplant
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
                                            req.body.id_formplant , 
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
                                                        req.body.id_formplant
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
    // end formplant

    // start factor
    app.post('/api/farmer/factor/select' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                const where = (req.body.id_factor) ? 
                                `and form${req.body.type}.id = "${req.body.id_factor}"` :
                                ""

                con.query(`
                            SELECT form${req.body.type}.* 
                            FROM form${req.body.type} , 
                                (
                                    SELECT formplant.id
                                    FROM formplant , 
                                        (
                                            SELECT id_farmHouse FROM housefarm
                                            WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                        ) as houseFarm
                                    WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                                ) as formPlant
                            WHERE form${req.body.type}.id_plant = formPlant.id ${where}
                            ORDER BY ${req.body.order} DESC
                        ` , 
                        [
                            auth.data.uid_line , 
                            req.body.id_farmhouse , 
                            req.body.id_plant
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
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/get/auto' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`SELECT * FROM ${req.body.type}_list WHERE is_use = 1` , (err : any , result : any)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("select list factor");
                        return 0;
                    }

                    con.end()
                    res.send(result)
                })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/insert' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT formplant.id , formplant.submit
                            FROM formplant , 
                                (
                                    SELECT id_farmHouse FROM housefarm
                                    WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                ) as houseFarm
                            WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                        ` , [ auth.data.uid_line , req.body.id_farmhouse , req.body.id_plant ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select house");
                                return 0;
                            }

                            if(result[0]) {
                                if(!result[0].submit) {
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
                                                (err : any , insert : any)=>{
                                                    con.end()
                                                    res.send("insert")
                                                    // if(insert.affectedRows >= 1) 
                                                    // else res.send("130")
                                                })
                                } else {
                                    con.end()
                                    res.send("submit")
                                }
                            }
                            else {
                                con.end()
                                res.send("not")
                            }
                        })
            } catch (err) {
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/edit' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(` 
                            SELECT form${req.body.type_form}.* , formplant.submit
                            FROM form${req.body.type_form} ,
                            (
                                SELECT formplant.id , formplant.submit
                                FROM formplant , 
                                    (
                                        SELECT id_farmHouse FROM housefarm
                                        WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                    ) as houseFarm
                                WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                            ) as formplant
                            WHERE form${req.body.type_form}.id_plant = formplant.id and form${req.body.type_form}.id = ?
                        ` , [ auth.data.uid_line , req.body.id_farmhouse , req.body.id_plant , req.body.id_form] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select house");
                                return 0;
                            }

                            if(result[0]) {
                                let data = req.body
                                if(!result[0].submit) {
                                    con.query(
                                        `
                                        INSERT INTO editform 
                                            ( id_form , id_doctor , because , note , status , type_form )
                                            VALUES 
                                            ( ? , ? , ? , ? , ? , ? )
                                        ` , [ data.id_form , "" , data.because , "" , 0 , data.type_form ] ,
                                        (err : any , resultEdit : any) => {
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
                                                            (id_edit , subject_form , old_content)
                                                            VALUES 
                                                            ( ? , ? , ?)
                                                        ` , [ resultEdit.insertId , subject , result[0][subject] ] ,
                                                        (err : any , Edit : any) => {
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
                                                                        UPDATE form${data.type_form} 
                                                                        SET ${strUpdate}
                                                                        WHERE id = ?
                                                                        ` , [ data.id_form ] , 
                                                                        (err : any , update : any) => {
                                                                            if (err) {
                                                                                dbpacket.dbErrorReturn(con, err, res);
                                                                                console.log("update form");
                                                                                return 0;
                                                                            }
                                                                            con.end()
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
                        })
            } catch (err) {
                console.log(err)
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })

    app.post('/api/farmer/factor/edit/list' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(` 
                            SELECT * FROM editform , 
                            (
                                SELECT form${req.body.type_form}.id
                                FROM form${req.body.type_form} ,
                                (
                                    SELECT formplant.id
                                    FROM formplant , 
                                        (
                                            SELECT id_farmHouse FROM housefarm
                                            WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                        ) as houseFarm
                                    WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                                ) as formplant
                                WHERE form${req.body.type_form}.id_plant = formplant.id and form${req.body.type_form}.id = ?
                            ) as factor
                            WHERE editform.id_form = factor.id and type_form = ?
                        ` , [ auth.data.uid_line , req.body.id_farmhouse , req.body.id_plant , req.body.id_form_factor , req.body.type_form] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select editform");
                                return 0;
                            }
                            con.end()
                            res.send(result)
                        })
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    // success 
    app.post('/api/farmer/success/list' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(
                            `
                            SELECT success_detail.id , formPlant.name_station , type_success , date_of_doctor , date_of_farmer
                            FROM success_detail , 
                            (
                                SELECT formplant.id , houseFarm.name_station
                                FROM formplant , 
                                    (
                                        SELECT id_farmHouse , (
                                            SELECT name FROM station_list WHERE station_list.id = ?
                                        ) as name_station
                                        FROM housefarm
                                        WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                    ) as houseFarm
                                WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                            ) as formPlant
                            WHERE success_detail.id_plant = formPlant.id
                            ` , [ auth.data.station , auth.data.uid_line , req.body.id_farmhouse , req.body.id_plant ] ,
                            (err :any , result : any) => {
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log(`select success ${req.body.id_plant}`);
                                    return 0;
                                }

                                con.end()
                                res.send(result)
                            }
                        )
                
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/success/get' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)

            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(
                            `
                            SELECT success_detail.id_success
                            FROM success_detail , 
                            (
                                SELECT formplant.id
                                FROM formplant , 
                                    (
                                        SELECT id_farmHouse
                                        FROM housefarm
                                        WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                    ) as houseFarm
                                WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                            ) as formPlant
                            WHERE success_detail.id_plant = formPlant.id and date_of_farmer != ""
                            ` , [ auth.data.uid_line , req.body.id_farmhouse , req.body.id_plant ] ,
                            (err :any , result : any) => {
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log(`select success ${req.body.id_plant}`);
                                    return 0;
                                }

                                con.end()
                                res.send(result)
                            }
                        )
                
            } catch (err) {
                con.end()
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }

        } else res.send("error auth")
    })

    app.post('/api/farmer/success/update' , async (req:any , res:any)=>{
        if(req.session.uidFarmer && (req.hostname == HOST_CHECK || !HOST_CHECK)) {
            let con = Database.createConnection(listDB)
            try {
                const auth : any = await authCheck(con , dbpacket , res , req , LINE)
                con.query(`
                            SELECT formplant.id
                            FROM formplant , 
                                (
                                    SELECT id_farmHouse FROM housefarm
                                    WHERE housefarm.uid_line = ? and housefarm.id_farmHouse = ?
                                ) as houseFarm
                            WHERE formplant.id_farmHouse = houseFarm.id_farmHouse && formplant.id = ?
                        ` , [ auth.data.uid_line , req.body.id_farmhouse , req.body.id_plant ] , 
                        (err : any , result : any)=>{
                            if (err) {
                                dbpacket.dbErrorReturn(con, err, res);
                                console.log("select house");
                                return 0;
                            }

                            if(result[0]) {
                                let data = req.body
                                con.query(
                                            `
                                            UPDATE success_detail SET date_of_farmer = ? 
                                            WHERE id = ? and id_plant = ? and date_of_farmer = ""
                                            ` , [new Date() , data.id_table_success , data.id_plant ] , 
                                            (err : any , result : any) => {
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
                        })
            } catch (err) {
                if(err === "no" || err === "no account") res.send("close")
                else res.send("error auth")
            }
        } else res.send("error auth")
    })
    
}

const authCheck = (con : any , dbpacket : any , res : any , req : any , LINE : any) => {
    return new Promise((resole : any , reject : any)=>{
        con.connect(( err:any )=>{
            if (err) {
                dbpacket.dbErrorReturn(con, err, res);
                console.log("connect");
                return 0;
            }

            con.query(`
                        SELECT * FROM acc_farmer 
                        WHERE uid_line = ?
                        ORDER BY date_register DESC
                        LIMIT 1
                        ` , 
                [req.session.uidFarmer] ,
                (err:any , result:any)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                        return 0
                    }
                    if(result[0]) {
                        if(result[0].register_auth == 0 || result[0].register_auth == 1) {
                            if(req.body['page'] === "signup") {
                                try {
                                    LINE.unlinkRichMenuFromUser(req.session.uidFarmer)
                                    LINE.linkRichMenuToUser(req.session.uidFarmer , RichHouse)
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                            resole({
                                result : "search",
                                data : result[0]
                            })
                        } else {
                            try {
                                LINE.unlinkRichMenuFromUser(req.session.uidFarmer)
                                LINE.linkRichMenuToUser(req.session.uidFarmer , RichSign)
                            } catch (e) {
                                console.log(e)
                            }
                            reject("no")
                        }
                    }
                    else {
                        reject("no account")
                    }
            })
        })
    })
}

// const auth = (uid : any , con : any , dbpacket : any , res : any) => {
//     return new Promise((resole : any , reject : any)=>
//         con.query(`SELECT * FROM acc_farmer WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)` , 
//             [uid] , (err : any, result : any )=>{
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