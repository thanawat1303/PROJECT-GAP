import React, { useEffect, useState } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";
import Login from "./Login";
import Admin from "./Admin";

import './assets/style/main.scss'

const MainAdmin = ({socket}) => {
    const [body , setBody] = useState(<></>)
    const [Reponsive , setRepon] = useState("")

    useEffect(()=>{
        CheckSize()
        window.addEventListener("resize" , CheckSize)
        clientMo.post('/api/admin/check').then((context)=>{
            if(context) setBody(<Admin setBodyFileMain={setBody} socket={socket}/>)
            else setBody(<Login setBodyFileMain={setBody} socket={socket}/>)
        })

        return()=>{
            window.removeEventListener("resize" , CheckSize)
        }
    },[])

    const CheckSize = () => {
        let ScreenH = window.innerHeight
        let ScreenY = window.innerHeight
        if(ScreenH < ScreenY) setRepon("horizontal")
        else setRepon("vertical")
    }

    return (
        <div axial={Reponsive} style={{
            height : "100%",
            width : "100%"
        }}>
            {body}
        </div>
    )
}

export default MainAdmin