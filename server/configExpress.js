const router = require('./routerApi');
const apiAdmin = require('./apiAdmin');
const apiDoctor = require('./apiDoctor');
const apiFarmer = require('./apiFarmer');
const message = require('./apiMessaging');
const dbpackage = require('./dbConfig');
const apifunc = require('./apifunc');
const LINE = require("./configLine");
const WebSocket = require('./webSocket');

const express = require('express');
const cors = require('cors')
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

    const listDB = dbpackage.listConfig(username , password)
    // const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.REACT_APP_API_PUBLIC : process.env.REACT_APP_API_LOCAL;

    // config server and Hot Refresh
    // if(process.argv[2] != process.env.BUILD) reactServ(app)

    // set session
    const sessionMiddleware = sessions({
        name : process.env.cookieName,
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

    const jsonDataNgrok = JSON.parse(fs.readFileSync(__dirname.replace('\server' , "/UrlServer.json")).toString())
    const origins = [
        `http://${process.env.REACT_APP_API_LOCAL}:3001`, 
        `http://${process.env.REACT_APP_API_LOCAL}:3002`, 
        `http://${process.env.REACT_APP_API_LOCAL}:3003`, 
        `http://${process.env.REACT_APP_API_LOCAL}:3004`, 
        ...Object.entries(jsonDataNgrok).map((Data)=>Data[1]), 
        `https://${process.env.REACT_APP_API_PUBLIC}:${process.env.REACT_APP_API_PORT}`
    ]

    // protocal websocket
    const io = WebSocket(server , sessionMiddleware , db , listDB , apifunc , origins)

    app.use(cors({
        origin : origins,
        credentials: true,
    }))
    app.use(sessionMiddleware)

    // config environment
    app.use(express.json())
    app.use(cookieParser())
    app.use(upload.any())
    app.use(express.static('app/src/assets/style'))
    app.use(express.static('app/src/assets/font'))
    app.use(express.static('app/src/assets/img'))
    app.use(express.static('app/src/assets/js'))
    app.use(express.static('app/src/assets/icon'))

    app.use(express.static('build/admin'))
    app.use(express.static('build/doctor'))
    app.use(express.static('build/farmer'))

    // router api url
    if(process.argv[2] === process.env.BUILD || process.argv[2] === "router") router(app)

    apiAdmin(app , db , apifunc , dbpackage , listDB , io , LINE)
    apiDoctor(app , db , apifunc , dbpackage , listDB , UrlNgrok , io , LINE)
    apiFarmer(app , db , apifunc , dbpackage , listDB , io , LINE)
    message(app , db , apifunc , dbpackage , listDB , UrlNgrok , io)

    // page error 404
    app.get("*" , (req, res) => {
        res.sendFile(__dirname.replace('\server' , '/index404.html'));
    });

    return server
}