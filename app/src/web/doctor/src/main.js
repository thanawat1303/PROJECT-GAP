import React, { createContext, useEffect, useState } from "react";
import {clientMo}  from "../../../assets/js/moduleClient";

import Login from "./Login";
import Doctor from "./Doctor";

import './assets/style/main.scss'
import { ButtonChangeLang } from "../../../assets/js/module";

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
            <ButtonChangeLang 
                getLang={getLang} 
                setLang={setLang}
                style={{
                    bottom : "0.5%",
                    right : "0.5%",
                }}  
            />
        </DoctorProvider.Provider>
    )
}

export default MainDoctor