require('dotenv').config().parsed
export default function apiFarmer (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any) {
    app.post('/api/farmer/sign' , (req:any , res:any)=>{
        req.session.uid = req.body['uid']
        res.send("")
    })

    app.post('/api/farmer/listStation' , (req:any , res:any)=>{
        if(req.session.uid && req.hostname == HOST_CHECK) {
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
        if(req.session.uid && req.hostname == HOST_CHECK) {
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
                            console.log(result)
                            res.send("insert complete")
                            con.end()
                        })
                    } else {
                        res.send("search")
                    }
                })
            })
        } else res.send("")
    })
}