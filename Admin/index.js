import React from "react";
import ReactDOM  from "react-dom/client";
import Main from "./src/mainApp";
import MainApp from "./src/mainApp";

if(document.getElementById('root')) {
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(<MainApp />)
} else {
    const root = ReactDOM.createRoot(document.getElementById('rootMobile'))
    root.render(<MainApp />)
}