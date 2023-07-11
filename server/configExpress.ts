import router from './routerApi'
import reactServ from './reactServ';
import apiAdmin from './apiAdmin';
import apiDoctor from './apiDoctor';
import apiFarmer from './apiFarmer';
import message from './apiMessaging';
import dbpacket from './dbConfig';
import apifunc from './apifunc';
import LINE from "./configLine";
import WebSocket from './webSocket';

import express from 'express';
import helmat from 'helmet';
import multer from 'multer';
import * as http from 'http';
import * as https from 'https'
import db from 'mysql';
import cookieParser from 'cookie-parser';
import sessions from 'express-session';
export default function appConfig(username: any , password: any , UrlNgrok : any) {
    require('dotenv').config().parsed

    const app = express();
    const upload = multer()
    const server = 
                // (process.argv[2] == process.env.BUILD) ? https.createServer(app) : 
                    http.createServer(app)
    // set Server

    const listDB = dbpacket.listConfig(username , password)
    const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : ""
    
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
    router(app)
    apiAdmin(app,db,apifunc,HOST_CHECK,dbpacket,listDB)
    apiDoctor(app,db,apifunc,HOST_CHECK,dbpacket,listDB)
    apiFarmer(app,db,apifunc,HOST_CHECK,dbpacket,listDB  , LINE)
    message(app,db,apifunc,HOST_CHECK,dbpacket,listDB  , LINE , UrlNgrok)

    return server
}