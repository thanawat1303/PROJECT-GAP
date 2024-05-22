const ngrok = require('ngrok')
require('dotenv').config().parsed
const fs = require('fs')

const OnNgrok = async ()=>{
    // const url_admin = await ngrok.connect(process.env.ADMIN_PORT);
    const url_doctor = await ngrok.connect(process.env.DOCTOR_PORT);
    const url_farmer = await ngrok.connect(process.env.FARMER_PORT);
    const API = await ngrok.connect(process.env.REACT_APP_API_PORT);

    fs.writeFileSync(__dirname.replace('\server' , "/UrlServer.json") , JSON.stringify({
        url : API,
        // url_admin,
        url_doctor,
        url_farmer
    }))

    // console.log('url admin : ' , url_admin)
    console.log('url doctor : ' , url_doctor)
    console.log('url farmer : ' , url_farmer)
    console.log('url api : ' , API)
}

OnNgrok()
