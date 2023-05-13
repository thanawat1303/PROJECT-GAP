import React from "react";
import ReactDOM  from "react-dom/client";

import MainAdmin from "./main/admin/src/main";
import MainDoctor from "./main/doctor/src/main";

let auth = window.location.pathname.split('/')[1]
const root = ReactDOM.createRoot(document.getElementById('root'))

if(auth == "admin") root.render(<MainAdmin/>)
else if(auth == "doctor") root.render(<MainDoctor/>)
