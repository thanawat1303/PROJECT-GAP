import * as Line from "@line/bot-sdk" 
require('dotenv').config().parsed

const config = {
  channelAccessToken: (process.env.channelAccessToken) ? process.env.channelAccessToken : "",
  channelSecret: process.env.channelSecret
}

export default new Line.Client(config)