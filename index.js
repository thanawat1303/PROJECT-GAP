import React from "react";
import ReactDOM  from "react-dom/client";

import MainAdmin from "./main/admin/src/main";
import MainDoctor from "./main/doctor/src/main";

let auth = window.location.pathname.split('/')[1]
const root = ReactDOM.createRoot(document.getElementById('root'))
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open' , ()=>{
    if(auth == "admin") root.render(<MainAdmin socket={socket}/>)
    else if(auth == "doctor") root.render(<MainDoctor socket={socket}/>)
})
