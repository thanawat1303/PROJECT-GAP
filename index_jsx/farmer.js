import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"

import MainSign from "../main/farmer/singupFile/mainSign";
import MainHouse from "../main/farmer/houseFile/mainHouse";

// const socket = new WebSocket();
const socket = io(window.location.protocol+"//"+window.location.host)

console.log("farmer")

socket.on('connect' , ()=>{
    if (document.getElementById('signup')) {
        ReactDOM.createRoot(document.getElementById('signup')).render(<MainSign socket={socket}/>)
    }
    else if (document.getElementById('house')) {
        ReactDOM.createRoot(document.getElementById('house')).render(<MainHouse socket={socket}/>)
    }
})
