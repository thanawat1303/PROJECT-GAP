import React, { useEffect, useState } from "react";
import {useLiff} from "../../../src/assets/js/module";

import {SignUp} from "./Signup";
import { clientMo } from "../../../src/assets/js/moduleClient";
import ErrorPage from "../ErrorPage";

const MainSign = ({socket}) => {
    const [body , setBody] = useState(<></>)
    const [init , liff] = useLiff("1661049098-A9PON7LB")

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
        clientMo.post("/api/farmer/sign" , {uid:uid , page : "signup"}).then((result)=>{
            if(result === "no" || result === "no account") setBody(<SignUp liff={liff}/>)
            else if (result === "search") setBody(<ErrorPage text={"บัญชีลงทะเบียนแล้ว"}/>)
            else if (result === "error auth") setBody(<>auth error</>)
        })
    }

    return(body)
}

export default MainSign