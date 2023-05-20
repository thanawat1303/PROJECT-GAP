import line from '@line/bot-sdk'
require('dotenv').config().parsed

const config = {
  channelAccessToken: (process.env.channelAccessToken) ? process.env.channelAccessToken : "",
  channelSecret: (process.env.channelSecret) ? process.env.channelSecret : ""
}

export default new line.Client(config)