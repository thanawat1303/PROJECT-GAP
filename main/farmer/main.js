import React, { useEffect, useState } from "react";
import {clientMo}  from "../../src/assets/js/moduleClient";
import {useLiff} from "../../src/assets/js/module";

import MenuMain from "./content/mainFarmHouse";

import House from "./houseFile/House";
import Signup from "./singupFile/Signup"
import { CloseAccount } from "./method";

const MainFarmer = ({socket , idLiff , Path}) => {
    const [body , setBody] = useState(<></>)
    const [init , liff] = useLiff(idLiff)

    useEffect(()=>{
        init.then(()=>{
            if(liff.isInClient()) {
                if(liff.isLoggedIn()) {
                    liff.getProfile().then((profile)=>{
                        // สมัครเข้าต้องค้นหาบัญชีโดยไม่ตรง status ยกเลิกบัญชี
                        if(profile.userId) {
                            LoadPage(profile.userId , liff)
                        }
                    })
                } else {
                    liff.login()
                }
            } else {
                // let UID = "Uceb5937bcd2edc0de5341022f8d59e9f"
                // LoadPage(UID , liff)
                CloseAccount("not line" , null , "กรุณาเข้าผ่านไลน์แอปพลิเคชั่น")
            }
        }).catch(err=>{
            CloseAccount("not line" , null , "พบปัญหาจากระบบ")
        })

    } , [])

    const LoadPage = async (uid , liff) => {
        const result = await clientMo.post("/api/farmer/sign" , {uid:uid , page : Path})
        alert(Path)
        if(Path === "signup" && result !== "error auth") {
            if(result === "close" || result === "no account") setBody(<Signup liff={liff} uid={uid}/>)
            else if (result === "search") CloseAccount("not line" , null , "บัญชีลงทะเบียนแล้ว")

        } else if (Path === "house" && result !== "error auth") {
            if(result === "close" || result === "no account") CloseAccount("not line" , null , "ไม่พบบัญชี")
            else if (result === "search") setBody(<House liff={liff} uid={uid}/>)

        } else if (Path === "form" && result !== "error auth") {
            const auth = window.location.pathname.split("/")[3]
            if(auth && result !== "close") {
                setBody(<MenuMain liff={liff} uid={uid}/>)
            } else CloseAccount("not line" , null , "ไม่พบบัญชี")
        }
        // else if (result === "error auth") CloseAccount("not line" , null , "พบปัญหาจากระบบ")
        else 
            CloseAccount("not line" , null , "พบปัญหาจากระบบ")
    }

    return(
        <>
            {body}
            <section style={{
                display : "flex",
                position : "fixed",
                justifyContent : "center",
                alignItems : "center",
                top : "0",
                left : "0",
                width : "100vw",
                height : "100vh",
                backgroundColor : "transparent",
                backdropFilter : "blur(8px)",
                opacity : "0",
                visibility : "hidden",
                transition : "0.5s opacity , 0.5s visibility",
                zIndex : "999",
                padding : "8px"
            }} id="session-farmer">
                <div className="body" style={{
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center",
                    flexDirection : "column",
                    backgroundColor : "white",
                    boxShadow : "0px 4px 4px gray",
                    borderRadius : "18px",
                    padding : "6px 14px"
                }}>
                    <div id="session-text" style={{
                        font : "20px Sans-font",
                        textAlign : "center",
                        // fontFamily : "Sans-font",
                        // fontSize : "20px",
                        marginBottom : "11px"
                    }}></div>
                    <button onClick={()=>liff.closeWindow()} style={{
                        fontFamily : "Sans-font",
                        fontSize : "20px",
                        borderRadius : "18px",
                        border : "0",
                        outline : "0",
                        padding : "0 14px",
                        backgroundColor : "red",
                        fontWeight : "900",
                        color : "white"
                    }}>ตกลง</button>
                </div>
            </section>
        </>
    )
}

export default MainFarmer