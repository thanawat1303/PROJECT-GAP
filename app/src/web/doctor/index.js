import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"

import MainDoctor from "./src/main";

const root = ReactDOM.createRoot(document.getElementById('doctor'))
// const socket = new WebSocket();
const socket = io(window.location.protocol+"//"+window.location.host)

// socket.on('connect' , ()=>{
    
// })
root.render(<MainDoctor socket={socket}/>)
