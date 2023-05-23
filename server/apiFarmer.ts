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
}