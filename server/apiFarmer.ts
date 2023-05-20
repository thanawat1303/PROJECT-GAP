require('dotenv').config().parsed
export default function apiFarmer (app:any , Database:any , apifunc:any , HOST_CHECK:any , dbpacket:any , listDB:any) {
    app.post('/api/farmer/check' , (req:any , res:any)=>{
        console.log(req.body['profile'])
    })
}