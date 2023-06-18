import React, { useEffect, useRef } from "react";

import "./assets/Menu.scss"
import { clientMo } from "../../../../src/assets/js/moduleClient";

const MenuPlant = ({ setBody , id_house , id_plant , liff , uid , setPage , isClick = 0}) => {
    const NavBody = useRef()

    useEffect(()=>{
        setPage("MENU ON LIST")
        if(isClick === 1) window.history.pushState({} , null , `/farmer?f=${id_house}&p=${id_plant}`)

        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    } , [])

    const openListFerti = (id) => {
        clientMo.post("/api/farmer/sign" , {uid:uid , page : `authFactor`}).then((result)=>{
            if(result === "search") {
                const Hraf = {
                    typePath : "formferti",
                    valuePage : id
                }
                // setBody(<ListPlant path={path} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={1} HrafPath={Hraf}/>)
            }
        })
    }

    const selectMenu = (page) => {
        Page(page , 1)
    }

    const Page = (type = 0) => {
        // clientMo.post("/api/farmer/sign" , {
        //     uid : uid,
        //     page : `authplant`
        // }).then((val)=>{
        //     if(val === "search") {
        //         const Hraf = {
        //             Path : "page",
        //             id_plant : page
        //         }
        //         setBody(<ListPlant path={path} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={type} HrafPath={Hraf}/>)
        //     }
        // })
    }

    return (
        <section ref={NavBody} className="nav-first">
            <div className="all-menu">
                <div className="head">Menu</div>
                <div className="row">
                    <div onClick={()=>selectMenu("plant")} className="frame-menu frame-plant">
                        <div className="img">
                            <img src="/ปลูก.jpg"></img>
                        </div>
                        <span>ข้อมูลการปลูก</span>
                    </div>
                    <div onClick={()=>selectMenu("ferti")} className="frame-menu frame-ferti">
                        <div className="img">
                            <img src="/ปุ๋ยธรรมชาติ.webp"></img>
                        </div>
                        <span>ปัจจัยการผลิต</span>
                    </div>
                </div>
                <div className="row">
                    <div onClick={()=>selectMenu("cremi")} className="frame-menu frame-cremi">
                        <div className="img">
                            <img src="/ใช้สารเคมี.jpg"></img>
                        </div>
                        <span>สารเคมีที่ใช้</span>
                    </div>
                    <div onClick={()=>selectMenu("success")} className="frame-menu frame-success">
                        <div className="img">
                            <img src="/เก็บ.png"></img>
                        </div>
                        <span>การเก็บเกี่ยว</span>
                    </div>
                </div>
                <div className="report-farm" 
                    onClick={()=>selectMenu("report")}
                    >
                    <img src="/คำแนะนำ.png"></img>
                </div>
            </div>
        </section>
    )
}

export default MenuPlant