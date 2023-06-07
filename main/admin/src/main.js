import React, { useEffect, useState } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";
import Login from "./Login";
import Admin from "./Admin";

import './assets/style/main.scss'

const MainAdmin = ({socket}) => {
    const [body , setBody] = useState(<></>)

    useEffect(()=>{
        clientMo.post('/api/admin/check').then((context)=>{
            if(context) setBody(<Admin setBodyFileMain={setBody} socket={socket}/>)
            else setBody(<Login setBodyFileMain={setBody} socket={socket}/>)
        })
    },[])

    return (body)
}

export default MainAdmin