import React, { createContext, useEffect, useState } from "react";
import {clientMo}  from "../../../assets/js/moduleClient";
import Login from "./Login";
import Admin from "./Admin";

import './assets/style/main.scss'
import { ButtonChangeLang } from "../../../assets/js/module";

export const AdminProvider = createContext(null)
const MainAdmin = ({socket}) => {
    const [body , setBody] = useState(<></>)
    const [ getLang , setLang ] = useState("th")
    // const [Responsive , setRespon] = useState("")

    useEffect(()=>{
        // CheckSize()
        // window.addEventListener("resize" , CheckSize)
        clientMo.post('/api/admin/check').then((context)=>{
            if(context) setBody(<Admin setBodyFileMain={setBody} socket={socket}/>)
            else setBody(<Login setBodyFileMain={setBody} socket={socket}/>)
        })

        // return()=>{
        //     window.removeEventListener("resize" , CheckSize)
        // }
    },[])

    // const CheckSize = () => {
    //     let ScreenH = window.innerHeight
    //     let ScreenY = window.innerHeight
    //     if(ScreenH < ScreenY) setRespon("horizontal")
    //     else setRespon("vertical")
    // }

    return (
        <AdminProvider.Provider value={{
            lg : getLang ,
            setLang
        }}>
            <div 
            // axial={Responsive} 
                id="role-admin" 
                style={{
                    height : "100%",
                    width : "100%"
                }}
            >
                {body}
                <ButtonChangeLang 
                    getLang={getLang} 
                    setLang={setLang}
                    style={{
                        bottom : "0.5%",
                        right : "0.5%",
                    }}  
                />
            </div>
        </AdminProvider.Provider>
    )
}

export default MainAdmin