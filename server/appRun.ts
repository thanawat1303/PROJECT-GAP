import appConfig from './configExpress'
import fs from 'fs'
export default function appRun(username : any , password : any){
    const UrlNgrok = fs.readFileSync(__dirname.replace('\server' , "/NgrokURL.json"))
    const app = appConfig(username , password , JSON.parse(UrlNgrok.toString()).url) 
    app.listen(parseInt(process.env.PORT ?? "80") , "0.0.0.0" , undefined , function () {
        console.log('Start on port '+process.env.PORT+'!\n');
    });
}