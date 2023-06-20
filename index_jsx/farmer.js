import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"
import MainFarmer from "../main/farmer/main";


// const socket = new WebSocket();
const socket = io(window.location.protocol+"//"+window.location.host)

console.log("farmer")

// socket.on('connect' , ()=>{
//     let Path = window.location.pathname.split("/").reverse()[0]
//     const id = {
//         "signup" : "1661049098-A9PON7LB" ,
//         "house" : "1661049098-Lm7mZW32" ,
//         "form" : "1661049098-GVZzbm5q"
//     }
//     ReactDOM.createRoot(document.getElementById('farmer')).render(<MainFarmer socket={socket} Path={Path} idLiff={id[Path]}/>)
// })

let Path = window.location.pathname.split("/")[2]
const id = {
    "signup" : "1661049098-A9PON7LB" ,
    "house" : "1661049098-Lm7mZW32" ,
    "form" : "1661049098-GVZzbm5q"
}
ReactDOM.createRoot(document.getElementById('farmer')).render(<MainFarmer socket={socket} Path={Path} idLiff={id[Path]}/>)
