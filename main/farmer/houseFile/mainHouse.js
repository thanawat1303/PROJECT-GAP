import React, { useEffect, useState } from "react";
import {useLiff} from "../../../src/assets/js/module";
import House from "./House";

import { clientMo } from "../../../src/assets/js/moduleClient";

// import Login from "./Login";
// import Doctor from "./Doctor";

// import './assets/style/main.scss'

const MainHouse = ({socket}) => {
    const [body , setBody] = useState(<></>)
    const [init , liff] = useLiff("1661049098-Zwq0pgJP")

    useEffect(()=>{
        init.then(()=>{
            if(liff.isInClient()) {
                if(liff.isLoggedIn()) {
                    liff.getProfile().then((profile)=>{
                        if(profile.userId) {
                            LoadPage(profile.userId)
                        }
                    })
                } else {
                    liff.login()
                }
            } else {
                let UID = "Uceb5937bcd2edc0de5341022f8d59e9f"
                LoadPage(UID)
            }
        }).catch(err=>{
            console.log(err)
        })

    } , [])

    const LoadPage = (uid) => {
        clientMo.post("/api/farmer/sign" , {uid:uid}).then((result)=>{
            if(result === "no" || result === "no account") setBody(<>ไม่พบบัญชี</>)
            else if (result === "search") setBody(<House liff={liff}/>)
            else if (result === "error auth") setBody(<>auth error</>)
        })
    }

    return(body)
}

export default MainHouse