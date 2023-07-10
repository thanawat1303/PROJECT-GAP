require('dotenv').config().parsed
import line from "./configLine";
import * as fs from "fs"
export default function Messaging (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any , LINE = line , UrlApi : any) {

    app.post('/messageAPI' , (req : any , res : any)=>{
        
        if(req.body.events.length > 0) {
            if(req.body.events[0].postback) {
                if(req.body.events[0].postback.data == "house_add") {
                    let con = Database.createConnection(listDB)
                    con.connect(( err:any )=>{
                        if (err) {
                            dbpacket.dbErrorReturn(con, err, res);
                            console.log("connect");
                            return 0;
                        }
                        
                        con.query(`
                                    SELECT id_farmHouse , name_house FROM housefarm , 
                                        (
                                            SELECT uid_line , link_user FROM acc_farmer 
                                            WHERE uid_line = ? and (register_auth = 0 or register_auth = 1)
                                            ORDER BY date_register DESC
                                            LIMIT 1
                                        ) as farmer 
                                    WHERE housefarm.uid_line = farmer.uid_line || housefarm.link_user = farmer.link_user
                                    ` , 
                            [req["body"]['events'][0]["source"]["userId"]] ,
                            (err:any , result:any)=>{
                                if (err) {
                                    dbpacket.dbErrorReturn(con, err, res);
                                    console.log("query");
                                    return 0
                                }
                                con.end()
                                let msg : any
                                if(result[0]) {
                                    let query = new Array
                                    for (let key in result) {
                                        query.push(
                                                {
                                                    imageUrl : `${UrlApi}/image/house?imagefarm=${result[key]["id_farmHouse"]}`,
                                                    action : {
                                                        type : "uri",
                                                        label : `${result[key]["name_house"]}`,
                                                        uri : `https://liff.line.me/1661049098-GVZzbm5q/${result[key]["id_farmHouse"]}`
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
                                            // {
                                            //     type : "flex" , 
                                            //     altText : "โรงเรือน" ,
                                            //     contents : {
                                            //         type : "carousel" ,
                                            //         contents : [
                                            //             JSON.parse(newData)
                                            //         ]
                                            //     }
                                            // }
                                }
                                else {
                                    msg = {
                                        type : "text",
                                        text : "โปรดเพิ่มโรงเรือนก่อนนะครับ"
                                    }
                                }

                                line.replyMessage(req["body"]['events'][0]["replyToken"] , msg)
                                res.status(200).send('OK')
                        })
                    })
                }
            }
            
        } else {
            res.status(200).send('OK')
        }
        
    })

    app.get("/image/house" , (req : any , res : any)=>{
        if(req.query.imagefarm) {
            let con = Database.createConnection(listDB)
            con.connect(( err:any )=>{
                if (err) {
                    dbpacket.dbErrorReturn(con, err, res);
                    console.log("connect");
                    return 0;
                }

                con.query(`SELECT img_house FROM housefarm WHERE id_farmHouse = ?` , 
                    [req.query.imagefarm] ,
                    (err:any , result:any)=>{
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
//             label : `${result[key]["id_farmHouse"]}` ,
//             uri : `https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farmHouse"]}`
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
//         url : `https://ffb4-49-237-13-45.ngrok-free.app/imageHouse?imagefarm=${result[key]["id_farmHouse"]}`,
//         align : "center" ,
//         gravity : "center" ,
//         size : "full",
//         aspectRatio : "1.51:1",
//         aspectMode : "fit",
//         backgroundColor : "#FFFFFFFF",
//         action : {
//             type : "uri",
//             label : `${result[key]["id_farmHouse"]}` ,
//             uri : `https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farmHouse"]}`
//         },
//     },
//     body : {
//         type : "box" ,
//         layout : "vertical",
//         action : {
//             type : "uri",
//             label : `${result[key]["id_farmHouse"]}` ,
//             uri : `https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farmHouse"]}`
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