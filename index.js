import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"

import MainAdmin from "./main/admin/src/main";
import MainDoctor from "./main/doctor/src/main";

let auth = window.location.pathname.split('/')[1]
const root = ReactDOM.createRoot(document.getElementById('root'))
// const socket = new WebSocket();
const socket = io(window.location.protocol+"//"+window.location.host)

socket.on('connect' , ()=>{
    if(auth == "admin") root.render(<MainAdmin socket={socket}/>)
    else if(auth == "doctor") root.render(<MainDoctor socket={socket}/>)
})
