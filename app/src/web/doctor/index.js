import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"

import MainDoctor from "./src/main";
import { HOST_API } from "../../assets/js/moduleClient";

const root = ReactDOM.createRoot(document.getElementById('doctor'))
// const socket = new WebSocket();
const socket = io(HOST_API)

// socket.on('connect' , ()=>{
    
// })
root.render(<MainDoctor socket={socket}/>)
