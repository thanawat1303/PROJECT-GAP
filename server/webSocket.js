module.exports = WebSocketServ = (server) => {
    const WebSoc = require('ws')
    const Socket = new WebSoc.Server({server})

    let Push = new Map()

    Socket.on('connection' , (ws , req)=>{
        ws.on('message' , (message)=>{
            message = JSON.parse(message)
            if(message['type'] == "connect") {
                if(message['value'] == "push"){
                    ws.send(JSON.stringify(Array.from(Push)))
                    ws.connect = "push"
                }

            } else if(message['type'] == "unconnect") {
                delete ws.connect
            }
            
            else {
                if(message['type'] == "push"){
                    if(message['command'] == "off") Push.set(message['id'],"on")
                    else if(message['command'] == "on") {
                        if(Push.has(message['id'])) Push.delete(message['id'])
                    }
                }

                Socket.clients.forEach((client)=>{
                    if(client.connect == "push") {
                        client.send(JSON.stringify(Array.from(Push)))
                    }
                })

            }
            // console.log(Array.from(Push))
            // console.log(ws.connect)
        })
    })
}