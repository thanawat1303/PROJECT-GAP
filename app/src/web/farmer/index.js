import React from "react";
import ReactDOM  from "react-dom/client";
import io from "socket.io-client"
import MainFarmer from "./src/main";
import { HOST_API } from "../../assets/js/moduleClient";


// const socket = new WebSocket();
const socket = io(HOST_API)

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
    "signup" : process.env.REACT_APP_LINE_SIGNUP ,
    "house" : process.env.REACT_APP_LINE_HOUSE ,
    "form" : process.env.REACT_APP_LINE_FORM
}
ReactDOM.createRoot(document.getElementById('farmer')).render(<MainFarmer socket={socket} Path={Path} idLiff={id[Path]}/>)
