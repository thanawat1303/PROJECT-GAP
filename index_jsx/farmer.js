import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"

import { MainFarmer } from "../main/farmer/main";

const root = ReactDOM.createRoot(document.getElementById('root'))
// const socket = new WebSocket();
const socket = io(window.location.protocol+"//"+window.location.host)

console.log("farmer")

socket.on('connect' , ()=>{
    root.render(<MainFarmer socket={socket}/>)
})
