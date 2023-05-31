import React, { useEffect, useState } from "react";
import {clientMo}  from "../../src/assets/js/moduleClient";
import {useLiff} from "../../src/assets/js/module";

import {NonLine} from "./nonLine";
import {SignUp} from "./Signup";

import MenuMain from "./menuMain";
import House from "./House";

// import Login from "./Login";
// import Doctor from "./Doctor";

// import './assets/style/main.scss'

const MainFarmer = (props) => {
    const [body , setBody] = useState(<></>)
    const [init , liff] = useLiff("1661049098-A9PON7LB")

    useEffect(()=>{
        init.then(()=>{
            if(liff.isInClient()) {
                if(liff.isLoggedIn()) {
                    liff.getProfile().then((profile)=>{
                        // สมัครเข้าต้องค้นหาบัญชีโดยไม่ตรง status ยกเลิกบัญชี
                        if(profile.userId) {
                            clientMo.post("/api/farmer/sign" , {uid:profile.userId}).then((result)=>{
                                if(result === "no") setBody(<SignUp profile={profile} liff={liff}/>)
                                else if (result === "search") {
                                    const auth = window.location.href.split("?")[1]
                                    const house = window.location.href.split("/")[window.location.href.split("/").length - 1]
                                    if(auth) {
                                        const path = new Map([...auth.split("&").map((val)=>val.split("="))])
                                        setBody(<MenuMain path={path} liff={liff}/>)
                                    }
                                    else if (house == "house") {
                                        setBody(<House/>)
                                    }
                                    else {
                                        clientMo.addAction('#loading' , 'hide' , 1000)
                                        setBody(<>บัญชีลงทะเบียนแล้ว {house}</>)
                                    }
                                }
                                else if (result === "error auth") setBody(<>auth error</>)
                            })
                        }
                    })
                } else {
                    liff.login()
                }
            } else {
                clientMo.post("/api/farmer/sign" , {uid:"1111"}).then((result)=>{
                    if(result === "no") setBody(<SignUp />)
                    else if (result === "search") {
                        const auth = window.location.href.split("?")[1]
                        console.log(auth)
                        if(auth) {
                            const path = new Map([...auth.split("&").map((val)=>val.split("="))])
                            setBody(<MenuMain path={path}/>)
                        }
                        else setBody(<>บัญชีลงทะเบียนแล้ว</>)
                    }
                    else if (result === "error auth") setBody(<>auth error</>)
                })
                // setBody(<NonLine />)
            }
        }).catch(err=>{
            console.log(err)
        })
    } , [])

    return(
        body
    )
}

export {MainFarmer}