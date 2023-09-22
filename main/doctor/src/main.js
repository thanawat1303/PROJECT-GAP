import React, { useEffect, useState } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";

import Login from "./Login";
import Doctor from "./Doctor";

import './assets/style/main.scss'

const MainDoctor = ({socket}) => {
    const [Body , setBody] = useState()

    useEffect(()=>{
        FetchCheck()
    } , [])

    const FetchCheck = async () => {
        if(window.location.href.indexOf("/doctor/logout") >= 0) {
            window.history.replaceState({} , "" , "/doctor")
            await clientMo.get('/api/logout')
            setBody(<Login socket={socket} setMain={setBody}/>)
        } else {
            const context = await clientMo.post('/api/doctor/check')
            if(context) {
                setBody(<Doctor setMain={setBody} socket={socket}/>)
            }
            else setBody(<Login socket={socket} setMain={setBody}/>)
        }
    }

    return (Body)
}

export default MainDoctor