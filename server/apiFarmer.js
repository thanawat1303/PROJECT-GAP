require('dotenv').config().parsed
// import module express config
const app = require('./configExpress')

// module DB and connect DB
const db = require('mysql')
const dbpacket = require('./dbConfig')
const apifunc = require('./apifunc')

module.exports = app