const ngrok = require('ngrok')
require('dotenv').config().parsed
const fs = require('fs')

ngrok.connect(process.env.REACT_APP_API_PORT).then((val)=>{
    const data = {
        url : val
    }
    fs.writeFileSync(__dirname.replace('\server' , "/UrlServer.json") , JSON.stringify(data))
    console.log(`URL : ${val}`)
})
