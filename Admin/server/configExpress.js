const express = require('express');
const reactServ = require('./reactServ');

const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const app = express();

// config server and Hot Refresh
reactServ(app)

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret : process.env.KEY_SESSION,
    saveUninitialized: true,
    cookie: {
        maxAge: oneDay
    },
    resave : false
}))

// config environment
app.use(express.json())
app.use(cookieParser())
app.use(express.static('src/assets/style'))



module.exports = app