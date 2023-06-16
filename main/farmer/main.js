import React, { useEffect, useState } from "react";
import {clientMo}  from "../../src/assets/js/moduleClient";
import {useLiff} from "../../src/assets/js/module";

import {NonLine} from "./nonLine";

import MenuMain from "./content/mainFarmHouse";
import House from "./houseFile/House";

// import Login from "./Login";
// import Doctor from "./Doctor";

// import './assets/style/main.scss'

const MainFarmer = ({socket}) => {
    const [body , setBody] = useState(<></>)
    const [init , liff] = useLiff("1661049098-A9PON7LB")

    useEffect(()=>{
        init.then(()=>{
            if(liff.isInClient()) {
                if(liff.isLoggedIn()) {
                    liff.getProfile().then((profile)=>{
                        // สมัครเข้าต้องค้นหาบัญชีโดยไม่ตรง status ยกเลิกบัญชี
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
            let Path = window.location.pathname.split("/").reverse()[0]
            if(Path === "signup")
            if(result === "no" || result === "no account") setBody(<>ไม่พบบัญชี</>)
            else if (result === "search") {
                const auth = window.location.href.split("?")[1]
                const house = window.location.href.split("/")[window.location.href.split("/").length - 1]
                if(auth) {
                    const path = new Map([...auth.split("&").map((val)=>val.split("="))])
                    if(path.get("farm")) setBody(<MenuMain path={path} liff={liff} uid={uid}/>)
                }
                else if (house == "house") {
                    setBody(<House liff={liff}/>)
                }
            }
            else if (result === "error auth") setBody(<>auth error</>)
        })
    }

    return(
        body
    )
}

export default MainFarmer