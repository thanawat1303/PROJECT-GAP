import React, { useEffect, useState } from "react";
import {clientMo}  from "../../src/assets/js/moduleClient";
import {useLiff} from "../../src/assets/js/module";

import {NonLine} from "./nonLine";

import MenuMain from "./content/mainFarmHouse";

import House from "./houseFile/House";
import Signup from "./singupFile/Signup"
import ErrorPage from "./ErrorPage"
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
                let UID = "Uceb5937bcd2edc0de5341022f8d59e9f"
                LoadPage(UID , liff)
                // CloseAccount("not line")
                // setBody(<ErrorPage text={""}/>)
            }
        }).catch(err=>{
            console.log(err)
        })

    } , [])

    const LoadPage = (uid , liff) => {
        clientMo.post("/api/farmer/sign" , {uid:uid , page : Path}).then((result)=>{

            if(Path === "signup" && result !== "error auth") {
                if(result === "close" || result === "no account") setBody(<Signup liff={liff}/>)
                else if (result === "search") setBody(<ErrorPage text={"บัญชีลงทะเบียนแล้ว"}/>)

            } else if (Path === "house" && result !== "error auth") {
                if(result === "close" || result === "no account") setBody(<ErrorPage text={"ไม่พบบัญชี"}/>)
                else if (result === "search") setBody(<House liff={liff}/>)

            } else if (Path === "form" && result !== "error auth") {
                const auth = window.location.pathname.split("/")[3]
                if(auth && result !== "close") {
                    setBody(<MenuMain liff={liff} uid={uid}/>)
                } else {
                    setBody(<ErrorPage text={"ไม่พบฟาร์ม"}/>)
                }
            }
            else if (result === "error auth") setBody(<ErrorPage text={"ERR"}/>)
            else {
                setBody(<ErrorPage text={"ERR"}/>)
            }
        })
    }

    const Close = () => {
        if(document.querySelector("#session-farmer .body #session-text").innerHTML !== "ไม่พบฟอร์ม") {
            liff.closeWindow()
        } else {
            document.querySelector("#session-farmer").style.opacity = "0"
            document.querySelector("#session-farmer").style.visibility = "hidden"
        }
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
                zIndex : "999"
            }} id="session-farmer">
                <div className="body" style={{
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center",
                    flexDirection : "column",
                    backgroundColor : "white",
                    boxShadow : "0px 4px 4px gray",
                    borderRadius : "18px",
                    padding : "2vw 5vw"
                }}>
                    <div id="session-text" style={{
                        fontFamily : "Sans-font",
                        fontSize : "7vw",
                        marginBottom : "4vw"
                    }}>เซสซั่นหมดอายุ</div>
                    <button onClick={Close} style={{
                        fontFamily : "Sans-font",
                        fontSize : "7vw",
                        borderRadius : "18px",
                        border : "0",
                        outline : "0",
                        padding : "0 5vw",
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