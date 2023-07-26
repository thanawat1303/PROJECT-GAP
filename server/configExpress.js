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
                    key: fs.readFileSync("/etc/letsencrypt/live/lesyslab.com/privkey.pem"),
                    cert: fs.readFileSync(`/etc/letsencrypt/live/lesyslab.com/fullchain.pem`)
                } , app) 
                : 
                http.createServer(app)
    // set Server

    const listDB = dbpacket.listConfig(username , password)
    const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_NAMEDEV;
    const HOST_FARMER = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_FARMER;
    // protocal websocket
    WebSocket(server)

    // secure server
    // app.use(helmat(
    //     {
    //     contentSecurityPolicy: process.env.NODE_ENV == 'development' ? false : true,
    //     }
    // ))

    // config server and Hot Refresh
    if(process.argv[2] != process.env.BUILD) reactServ(app)

    app.use(sessions({
        secret : process.env.KEY_SESSION ?? "",
        saveUninitialized: true,
        cookie: {
            // maxAge: parseInt(process.env.TIME_COKKIE),
            // secure: process.argv[2] != process.env.BUILD ? false : true
        },
        resave : false
    }))

    // config environment
    app.use(express.json())
    app.use(cookieParser())
    app.use(upload.any())
    app.use(express.static('src/assets/style'))
    app.use(express.static('src/assets/font'))
    app.use(express.static('src/assets/img'))
    app.use(express.static('src/assets/icon'))
    app.use(express.static('public'))

    // router api url
    const TestNgrok = HOST_FARMER

    router(app)
    apiAdmin(app , db , apifunc , TestNgrok , dbpacket , listDB)
    apiDoctor(app , db , apifunc , TestNgrok , dbpacket , listDB)
    apiFarmer(app , db , apifunc , HOST_FARMER , dbpacket , listDB , LINE)
    message(app , db , apifunc , TestNgrok , dbpacket , listDB , LINE , UrlNgrok)

    return server
}