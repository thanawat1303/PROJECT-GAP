const Line = require("@line/bot-sdk") 
require('dotenv').config().parsed

const config = {
  channelAccessToken: (process.env.channelAccessToken) ? process.env.channelAccessToken : "",
  channelSecret: process.env.channelSecret
}

const LINE = new Line.Client(config)

module.exports = LINE