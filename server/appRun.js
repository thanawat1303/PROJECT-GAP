const appConfig = require("./configExpress")
const fs = require('fs')
module.exports = function appRun(username , password){
    console.log("Load Server...")
    const UrlApi = fs.readFileSync(__dirname.replace('\server' , "/UrlServer.json"))
    const UrlServer = "https://" + process.env.HOST_SERVER +":"+process.env.PORT
    const app = appConfig(username , password , (process.argv[2] == process.env.BUILD) ? UrlServer : JSON.parse(UrlApi.toString()).url) 
    const Port = parseInt(process.env.PORT ?? "80")
    app.listen( Port , "0.0.0.0" , function () {
        console.log('Start on port '+Port+'!\n');
    });
}