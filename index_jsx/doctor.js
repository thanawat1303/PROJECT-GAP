import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"

import MainDoctor from "../main/doctor/src/main";

const root = ReactDOM.createRoot(document.getElementById('root'))
// const socket = new WebSocket();
const socket = io(window.location.protocol+"//"+window.location.host)

console.log("doctor")

socket.on('connect' , ()=>{
    root.render(<MainDoctor socket={socket}/>)
})
