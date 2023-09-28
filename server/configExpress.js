const router = require('./routerApi');
const reactServ = require('./reactServ');
const apiAdmin = require('./apiAdmin');
const apiDoctor = require('./apiDoctor');
const apiFarmer = require('./apiFarmer');
const message = require('./apiMessaging');
const dbpacket = require('./dbConfig');
const apifunc = require('./apifunc');
const LINE = require("./configLine");
const WebSocket = require('./webSocket');

const express = require('express');
const helmat = require('helmet');
const multer = require('multer');
const http = require('http');
const https = require('https');
const db = require('mysql2');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const fs = require('fs');
module.exports = function appConfig(username , password , UrlNgrok ) {
    require('dotenv').config().parsed

    const app = express();
    const upload = multer()
    const server = 
                (process.argv[2] == process.env.BUILD) ? https.createServer({
                    key: fs.readFileSync(process.env.pathCertFile),
                    cert: fs.readFileSync(process.env.pathKeyFile)
                } , app) 
                : 
                http.createServer(app)
    // set Server

    const listDB = dbpacket.listConfig(username , password)
    // const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_NAMEDEV;
    const HOST_SSL = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : JSON.parse(fs.readFileSync(__dirname.replace("server" , "UrlServer.json")));

    // secure server
    // app.use(helmat(
    //     {
    //     contentSecurityPolicy: process.env.NODE_ENV == 'development' ? false : true,
    //     }
    // ))

    // config server and Hot Refresh
    if(process.argv[2] != process.env.BUILD) reactServ(app)

    // set session
    const sessionMiddleware = sessions({
        name : process.cookieName,
        secret : process.env.KEY_SESSION ?? "",
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure : process.argv[2] == process.env.BUILD,
            maxAge: null,
            sameSite: 'strict'
            // secure: process.argv[2] != process.env.BUILD ? false : true
        },
        resave : false
    })

    // protocal websocket
    const io = WebSocket(server)

    app.use(sessionMiddleware)

    // config environment
    app.use(express.json())
    app.use(cookieParser())
    app.use(upload.any())
    app.use(express.static('src/assets/style'))
    app.use(express.static('src/assets/font'))
    app.use(express.static('src/assets/img'))
    app.use(express.static('src/assets/js'))
    app.use(express.static('src/assets/icon'))
    app.use(express.static('public'))

    // router api url
    router(app)

    apiAdmin(app , db , apifunc , HOST_SSL , dbpacket , listDB , io , LINE)
    apiDoctor(app , db , apifunc , HOST_SSL , dbpacket , listDB , UrlNgrok , io , LINE)
    apiFarmer(app , db , apifunc , HOST_SSL , dbpacket , listDB , io , LINE)
    message(app , db , apifunc , HOST_SSL , dbpacket , listDB , UrlNgrok , io)

    // page error 404
    app.get("*" , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/public/index404.html'));
    });

    return server
}