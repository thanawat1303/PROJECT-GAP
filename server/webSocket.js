module.exports = function WebSocketServ (server , sessionMiddleware) {
    // const WebSoc = require('ws')
    // const Socket = new WebSoc.Server({server})

    // let Push = new Map()
    
    const {Server} = require('socket.io')
    const io = new Server(server)
    io.engine.use(sessionMiddleware);

    io.on("connection" , (socket_client)=>{
        // socket_client.on("connect-account" , ()=>{
        //     try {
        //         const session = Object.entries(socket_client.request.sessionStore.sessions)
        //         const JsonOB = JSON.parse(session[0][1])
        //         socket_client.data.username = JsonOB.user_doctor
        //         socket_client.data.password = JsonOB.pass_doctor     
        //     } catch(e) {}
        // })

        // socket_client.on("disconnect-account" , () => {
        //     console.log(socket_client.data , new Date())
        // })

        socket_client.on("connect msg" , (uid_line)=>{
            socket_client.join(uid_line)
        })

        socket_client.on("disconnect msg" , (uid_line)=>{
            socket_client.leave(uid_line)
        })

        socket_client.on("connect_notify_doctor" , (station)=>{
            socket_client.join(`notify-${station}`)
        })

        socket_client.on("disconnect_notify_doctor" , (station)=>{
            socket_client.leave(`notify-${station}`)
        })


        // socket_client.on("disconnect" , () => {
        //     console.log(socket_client.data , new Date())
        // })
    })

    return io
    // io.on("connect" , (socket)=>{
    //     socket.on("open PagePush" , ()=>{
    //         socket.emit('push list' , JSON.stringify(Array.from(Push)))
    //         socket.join('page push')
    //     })
    //     socket.on("close PagePush" , ()=>{
    //         socket.leave("page push")
    //     })
        
    //     // open detail
    //     socket.on("open detail on pagePush" , (msg)=>{
    //         Push.set(socket.id,JSON.parse(msg)['id'])
    //         socket.to("page push").emit('push list' , JSON.stringify(Array.from(Push)))
    //     })
    //     socket.on("close detail on pagePush" , (msg)=>{
    //         Push.delete(socket.id)
    //         socket.to("page push").emit('push list' , JSON.stringify(Array.from(Push)))
    //         socket.emit('push list' , JSON.stringify(Array.from(Push)))
    //     })

    //     socket.on("disconnect" , ()=>{
    //         if(Push.has(socket.id)) { //update push page
    //             Push.delete(socket.id)
    //             socket.to("page push").emit('push list' , JSON.stringify(Array.from(Push)))
    //         }
    //     })
    // })

    // Socket.on('connection' , (ws , req)=>{
    //     ws.on('message' , (message)=>{
    //         message = JSON.parse(message)
    //         if(message['type'] == "connect") {
    //             if(message['value'] == "push"){
    //                 ws.send(JSON.stringify(Array.from(Push)))
    //                 ws.connect = "push"
    //             }

    //         } else if(message['type'] == "unconnect") {
    //             delete ws.connect
    //         }
            
    //         else {
    //             if(message['type'] == "push"){
    //                 if(message['command'] == "off") Push.set(message['id'],"on")
    //                 else if(message['command'] == "on") {
    //                     if(Push.has(message['id'])) Push.delete(message['id'])
    //                 }
    //             }

    //             Socket.clients.forEach((client)=>{
    //                 if(client.connect == "push") {
    //                     client.send(JSON.stringify(Array.from(Push)))
    //                 }
    //             })

    //         }
    //         // console.log(Array.from(Push))
    //         // console.log(ws.connect)
    //     })
    // })
}