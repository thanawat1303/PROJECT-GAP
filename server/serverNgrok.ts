import ngrok from 'ngrok'
import fs from 'fs'

ngrok.connect(3001).then((val)=>{
    const data : any = {
        url : val
    }
    fs.writeFileSync(__dirname.replace('\server' , "/NgrokURL.json") , JSON.stringify(data))
    console.log(`URL : ${val}`)
})