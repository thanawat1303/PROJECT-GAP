module.exports = appConfig = (username , password) => {
    require('dotenv').config().parsed
    const router = require('./routerApi')
    const apiAdmin = require('./apiAdmin')
    const apiDoctor = require('./apiDoctor')
    const apiFarmer = require('./apiFarmer')

    const helmat = require('helmet')
    const express = require('express');

    const http = require('http')
    const ws = require('ws')

    const reactServ = require('./reactServ');

    const db = require('mysql')

    const cookieParser = require('cookie-parser');
    const sessions = require('express-session');
    const app = express();
    const server = http.createServer(app)
    
    const webSc = new ws.Server({server})
    // set Server
    const dbpacket = require('./dbConfig')
    const listDB = dbpacket.listConfig(username , password)
    const apifunc = require('./apifunc')
    const HOST_CHECK = (process.argv[2] == process.env.BUILD) ? process.env.HOST_SERVER : process.env.HOST_NAMEDEV

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
    apiDoctor(app,db,apifunc,HOST_CHECK,dbpacket,listDB,webSc)

    return server
}