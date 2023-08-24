require('dotenv').config().parsed
const line = require('./configLine')
const fs = require('fs')

const {Server} = require('socket.io')
const io = new Server()
const Report = require("./reportToAdmin")

module.exports = function Messaging (app , Database , apifunc , HOST_CHECK , dbpacket , listDB , UrlApi , socket = io) {

    app.post('/messageAPI' , async (req , res)=>{
        if(req.body.events.length > 0) {
            if(req.body.events[0].type === "postback") {
                if(req.body.events[0].postback.data == "house_add") {
                    const con = await ConnectDB()

                    try {
                        con.query(`
                            SELECT id_farm_house , name_house FROM housefarm , 
                                (
                                    SELECT uid_line , link_user FROM acc_farmer 
                                    WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)
                                    ORDER BY date_register DESC
                                    LIMIT 1
                                ) as farmer 
                            WHERE housefarm.uid_line = farmer.uid_line || housefarm.link_user = farmer.link_user
                            ORDER BY id_farm_house DESC
                        ` , 
                        [req["body"]['events'][0]["source"]["userId"]] ,
                        (err , result)=>{
                            con.end()
                            if (!err) {
                                let msg
                                if(result[0]) {
                                    let query = new Array
                                    for (let key in result) {
                                        const name_house = result[key]["name_house"].toString()
                                        query.push(
                                                {
                                                    imageUrl : `${UrlApi}/image/house?imagefarm=${result[key]["id_farm_house"]}&date=${new Date().getTime()}`,
                                                    action : {
                                                        type : "uri",
                                                        label : `${name_house.length > 12 ? `${name_house.slice(0 , 9)}..` : name_house}`,
                                                        uri : `https://liff.line.me/1661049098-GVZzbm5q/${result[key]["id_farm_house"]}`
                                                    }
                                                }
                                        )
                                    } 
                                    msg =   {
                                                type : "template",
                                                altText : "โรงเรือน",
                                                template : {
                                                    type : "image_carousel" ,
                                                    columns : query
                                                }
                                            }
                                }
                                else {
                                    msg = {
                                        type : "text",
                                        text : "โปรดเพิ่มโรงเรือนก่อนนะครับ"
                                    }
                                }

                                line.replyMessage(req["body"]['events'][0]["replyToken"] , msg)
                                res.status(200).send('OK')
                            }
                        })
                    } catch (e) {
                        Report(e.toString())
                    }
                } else {
                    await line.replyMessage(req["body"]['events'][0]["replyToken"] , {
                        type : "text",
                        text : "พบปัญหาในการค้นหาข้อมูล\nรอสักครู่นะคะ \u2764"
                    })
                    res.status(200).send('OK')
                }
            } else if (req.body.events[0].type === "message") {
                // console.log(req.body.events[0])
                const ObjectMsg = req.body.events[0]
                const Uid_line = ObjectMsg.source.userId

                if(ObjectMsg.message.type == "text" || ObjectMsg.message.type == "image") {
                    const con = await ConnectDB()
                    const SelectProfile = await new Promise((resole , reject)=>{
                        con.query(
                            `
                            SELECT station , register_auth
                            FROM acc_farmer
                            WHERE uid_line = ?
                            ` , [ Uid_line ] , (err , resultCheck)=>{
                                resole(resultCheck)
                            }
                        )
                    })

                    let msg = {}
                    if(SelectProfile.length != 0) {
                        const stationAll = new Set(SelectProfile.map((val)=>val.station))
                        const message = ObjectMsg.message

                        try {

                            //check time msg
                            const TimeMessage = await new Promise((resole , reject)=>{
                                con.query(
                                    `
                                    SELECT (
                                        SELECT EXISTS (
                                            SELECT date
                                            FROM message_user
                                            WHERE uid_line_farmer = ? 
                                                    and TIMESTAMPDIFF(MINUTE, date, NOW()) < 5
                                        )
                                    ) as is_msg
                                    ` , [ Uid_line ] , (err , is_msg)=>{
                                        resole(parseInt(is_msg[0].is_msg))
                                    }
                                )
                            })

                            // insert msg
                            await new Promise((resole , reject)=>{
                                const messagePut = (
                                    message.type == "text" ? message.text :
                                    message.type == "location" ? `{ lat : ${message.latitude} , lng : ${message.longitude}}` :
                                    message.id
                                )

                                con.query(
                                    `
                                    INSERT INTO message_user
                                    ( message , uid_line_farmer , id_read , type , type_message ) VALUES ( ? , ? , '{}' , "" , ?)
                                    ` , [ messagePut , Uid_line , message.type] , (err , result) => {
                                        if(err) reject("err insert send")
                                        resole()
                                    }
                                )
                            })

                            try {
                                socket.to(Uid_line).emit("new_msg")
                                if(!TimeMessage) {
                                    const checkAuth = SelectProfile.map(val=>val.register_auth.toString())
                                    const typeMessange = checkAuth.indexOf("1") >= 0 ? "บัญชีเกษตรกรที่ผ่านการตรวจสอบ" : 
                                                    checkAuth.indexOf("0") >= 0 ? "บัญชีเกษตรกรที่รอการตรวจสอบ" :
                                                    checkAuth.indexOf("2") >= 0 ? "บัญชีเกษตรกรที่ถูกปิด" : "";
                                    
                                    //send to doctor
                                    const Uid_line_send = await new Promise( async (resole , reject)=>{
                                        const uid_send = new Array
                                        await new Promise( async (resole , reject)=>{
                                            let index = 1;
                                            for (let val of stationAll) {
                                                const ObjectProfile = await new Promise((resole , reject)=>{
                                                    con.query(
                                                        `
                                                        SELECT uid_line_doctor
                                                        FROM acc_doctor
                                                        WHERE station_doctor = ? and status_account = 1 and status_delete = 0
                                                        ` , [val] , 
                                                        (err , doctor) => {
                                                            resole(doctor)
                                                        }
                                                    )
                                                })
                                                if(ObjectProfile.length > 0) {
                                                    const List_uid = ObjectProfile.map((val)=>val.uid_line_doctor).filter((val)=>val)
                                                    uid_send.push(...List_uid)
                                                }

                                                if(stationAll.size == index) resole()
                                                index++
                                            }
                                        })
                                        resole(new Set(uid_send))
                                    })

                                    con.end()
                                    line.multicast([...Uid_line_send] , {type : "text" , text : "มีข้อความจาก"+typeMessange})
                                        .catch(e=>{})
                                } else con.end()
                            } catch(e) {}

                            // msg = {
                            //     type : "text",
                            //     text : "รับเรื่องแล้ว กรุณารอการตอบกลับจากเจ้าหน้าที่นะคะ \u2764"
                            // }
                        } catch(e) {
                            console.log(e)
                            msg = {
                                type : "text",
                                text : "พบปัญหาในการส่งข้อความ กรุณารอสักครู่และส่งข้อความใหม่อีกครั้ง \u2764"
                            }
                        }
                        
                    } else {
                        msg = {
                            type : "text",
                            text : "กรุณาสมัครบัญชีก่อนนะคะ \u2764"
                        }
                        con.end()
                    }

                    if(msg.type) line.replyMessage(req["body"]['events'][0]["replyToken"] , msg)
                } else {
                    line.replyMessage(req["body"]['events'][0]["replyToken"] , {text : "กรุณาส่งเป็นข้อความหรือรูปภาพนะคะ" , type : "text"})
                }
            } 
        } else {
            res.status(200).send('OK')
        }
        
    })

    app.get("/image/house" , (req , res)=>{
        if(req.query.imagefarm) {
            let con = Database.createConnection(listDB)
            con.connect(( err )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT img_house FROM housefarm WHERE id_farm_house = ?` , 
                    [req.query.imagefarm] ,
                    (err , result)=>{
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("query");
                            return 0
                        }
                        con.end()
                        if(result[0]) {
                            const base64Image = result[0]["img_house"].toString(); //Buffer to string
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
                })
            })
        } else {
            res.send("not found")
        }
        
    })

    const ConnectDB = async () => {
        return await new Promise((resole , reject)=>{
            const connect = Database.createConnection(listDB)
            connect.connect(( err )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }
                resole(connect)
            })
        })
    } 
}

// {
//     type : "bubble" ,
//     size : "nano" ,
//     direction : "ltr" ,
//     header : {
//         type : "box" ,
//         layout : "vertical",
//         action : {
//             type : "uri",
//             label : `${result[key]["id_farm_house"]}` ,
//             uri : `https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farm_house"]}`
//         },
//         backgroundColor : "#FFFFFFFF",
//         contents : [
//             {
//                 type : "text",
//                 text : `${result[key]["name_house"]}`,
//                 size : "md",
//                 align : "center",
//                 gravity : "center",
//                 margin : "none"
//             }
//         ]
//     },
//     hero : {
//         type : "image" ,
//         url : `https://ffb4-49-237-13-45.ngrok-free.app/imageHouse?imagefarm=${result[key]["id_farm_house"]}`,
//         align : "center" ,
//         gravity : "center" ,
//         size : "full",
//         aspectRatio : "1.51:1",
//         aspectMode : "fit",
//         backgroundColor : "#FFFFFFFF",
//         action : {
//             type : "uri",
//             label : `${result[key]["id_farm_house"]}` ,
//             uri : `https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farm_house"]}`
//         },
//     },
//     body : {
//         type : "box" ,
//         layout : "vertical",
//         action : {
//             type : "uri",
//             label : `${result[key]["id_farm_house"]}` ,
//             uri : `https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farm_house"]}`
//         },
//         contents : [
//             {
//                 type : "text" ,
//                 text : "รายละเอียด",
//                 align : "center",
//                 size : "sm"
//             }
//         ]
//     },
// }