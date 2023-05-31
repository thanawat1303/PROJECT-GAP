require('dotenv').config().parsed
import line from "./configLine";
import * as fs from "fs"
export default function Messaging (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any , LINE = line) {

    app.post('/messageAPI' , (req : any , res : any)=>{
        if(req.body.events.length > 0) {
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
                            WHERE housefarm.uid_line = farmer.uid_line
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
                            let query = ""
                            for (let key in result) {
                                query += `
                                {
                                    type : "bubble" ,
                                    size : "nano" ,
                                    direction : "ltr" ,
                                    header : {
                                        type : "box" ,
                                        layout : "vertical",
                                        action : {
                                            type : "uri",
                                            label : "${result[key]["id_farmHouse"]}" ,
                                            uri : "https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farmHouse"]}"
                                        },
                                        backgroundColor : "#FFFFFFFF",
                                        contents : [
                                            {
                                                type : "text",
                                                text : "${result[key]["name_house"]}",
                                                size : "md",
                                                align : "center",
                                                gravity : "center",
                                                margin : "none"
                                            }
                                        ]
                                    },
                                    hero : {
                                        type : "image" ,
                                        url : "${result[key]["img_house"]}",
                                        align : "center" ,
                                        gravity : "center" ,
                                        size : "full",
                                        aspectRatio : "1.51:1",
                                        aspectMode : "fit",
                                        backgroundColor : "#FFFFFFFF",
                                        action : {
                                            type : "uri",
                                            label : "${result[key]["id_farmHouse"]}" ,
                                            uri : "https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farmHouse"]}"
                                        },
                                    },
                                    body : {
                                        type : "box" ,
                                        layout : "vertical",
                                        action : {
                                            type : "uri",
                                            label : "${result[key]["id_farmHouse"]}" ,
                                            uri : "https://liff.line.me/1661049098-A9PON7LB?farm=${result[key]["id_farmHouse"]}"
                                        },
                                        contents : [
                                            {
                                                type : "text" ,
                                                text : "รายละเอียด",
                                                align : "center",
                                                size : "sm"
                                            }
                                        ]
                                    },
                                },
                                `
                            } 
                            msg = 
                                    {
                                        type : "flex" , 
                                        altText : "โรงเรือน" ,
                                        contents : {
                                            type : "carousel" ,
                                            contents : [
                                                ,
                                            ]
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
                })
            })
            
        } else {
            res.status(200).send('OK')
        }
        
    })

    app.get("/imageHouse" , (req : any , res : any)=>{

        let con = Database.createConnection(listDB)
        con.connect(( err:any )=>{
            if (err) {
                dbpacket.dbErrorReturn(con, err, res);
                console.log("connect");
                return 0;
            }

            con.query(`SELECT * FROM acc_farmer` ,
                (err:any , result:any)=>{
                    if (err) {
                        dbpacket.dbErrorReturn(con, err, res);
                        console.log("query");
                        return 0
                    }
                    con.end()
                    const base64Image = result[0]["img"].toString();
                    // fs.writeFileSync(__dirname + "/img.png" , )
                    // Buffer.from()
                    // res.send("OK")

                    const base64Data = base64Image.replace(`data:image/jpeg;base64,`, '');

                    // // แปลง Base64 เป็น Buffer
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    // fs.writeFileSync(__dirname + "/image.jpg" , imageBuffer)
              
                    // // // ตั้งค่า Header 'Content-Type'
                    res.setHeader('Content-Type', 'image/png');
                    res.setHeader('Transfer-Encoding' , 'chunked')
              
                    // ส่งกลับรูปภาพให้กับผู้ใช้
                    res.end(imageBuffer);
            })
        })
        
    })

}