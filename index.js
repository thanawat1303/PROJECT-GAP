import React from "react";
import ReactDOM  from "react-dom/client";

import MainAdmin from "./main/admin/src/main";

let auth = window.location.pathname.split('/')[1]
const root = ReactDOM.createRoot(document.getElementById('root'))

if(auth == "admin") root.render(<MainAdmin/>)
