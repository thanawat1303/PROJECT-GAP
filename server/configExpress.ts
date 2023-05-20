import router from './routerApi'
import reactServ from './reactServ';
import apiAdmin from './apiAdmin';
import apiDoctor from './apiDoctor';
import apiFarmer from './apiFarmer';
import dbpacket from './dbConfig';
import apifunc from './apifunc';
import LINE from "./configLine";
import WebSocket from './webSocket';

export function appConfig(username: any , password: any) {
    require('dotenv').config().parsed

    const helmat = require('helmet')
    const express = require('express');

    const http = require('http')

    const db = require('mysql')

    const cookieParser = require('cookie-parser');
    const sessions = require('express-session');
    const app = express();
    const server = http.createServer(app)
    // set Server
    

    const listDB = dbpacket.listConfig(username , password)
    const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_NAMEDEV
    
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
        secret : process.env.KEY_SESSION,
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
    app.use(express.static('src/assets/style'))
    app.use(express.static('src/assets/font'))
    app.use(express.static('src/assets/img'))
    app.use(express.static('src/assets/icon'))
    app.use(express.static('public'))

    // router api url
    router(app)
    apiAdmin(app,db,apifunc,HOST_CHECK,dbpacket,listDB)
    apiDoctor(app,db,apifunc,HOST_CHECK,dbpacket,listDB)
    apiFarmer(app,db,apifunc,HOST_CHECK,dbpacket,listDB)

    return server
}