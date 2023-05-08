import React from "react";
import ReactDOM  from "react-dom/client";
import MainAdmin from "./main/admin/src/mainAdmin";

let auth = window.location.pathname
console.log(auth)
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<MainAdmin/>)
