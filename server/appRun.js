const appConfig = require("./configExpress")
const fs = require('fs')
module.exports = function appRun(username , password){
    console.log("Load Server ...")
    const UrlApi = fs.readFileSync(__dirname.replace('\server' , "/UrlServer.json"))
    const app = appConfig(username , password , JSON.parse(UrlApi.toString()).url) 
    app.listen(parseInt(process.env.PORT ?? "80") , "0.0.0.0" , function () {
        console.log('Start on port '+process.env.PORT+'!\n');
    });
}