import React, { createContext, useEffect, useState } from "react";
import {clientMo}  from "../../../assets/js/moduleClient";

import Login from "./Login";
import Doctor from "./Doctor";

import './assets/style/main.scss'

export const DoctorProvider = createContext(null)
const MainDoctor = ({socket}) => {
    const [Body , setBody] = useState()
    const [ getLang , setLang ] = useState("th")

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

    return (
        <DoctorProvider.Provider value={{
            lg : getLang ,
            setLang
        }}>
            {Body}
        </DoctorProvider.Provider>
    )
}

export default MainDoctor