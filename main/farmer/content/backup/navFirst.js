import React, { useEffect, useRef } from "react";

import "../assets/NavFirst.scss"
import { clientMo } from "../../../src/assets/js/moduleClient";
import ListPlant from "./Factor/ListPlant";


const NavFirst = ({ setBody , id_house , liff , uid , setPage , isClick = 0}) => {
    const NavBody = useRef()

    useEffect(()=>{
        setPage("HOME")
        if(isClick === 1) window.history.pushState({} , null , `/farmer?farm=${id_house}`)

        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
        
        // if(path.size == 2){
        //     if(path.has("page")) Page(path.get("page"))
        //     else if(path.has("formferti")) Factor(path.get("formferti") , "formferti")  
        //     else if(path.has("formcremi")) Factor(path.get("formcremi") , "formcremi")
        // }       
        // else {
            
        // }
    } , [])

    const selectMenu = (page) => {
        Page(page , 1)
    }

    const Page = (type = 0) => {
        clientMo.post("/api/farmer/sign" , {
            uid : uid,
            page : `authplant`
        }).then((val)=>{
            if(val === "search") {
                const Hraf = {
                    Path : "page",
                    id_plant : page
                }
                setBody(<ListPlant path={path} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={type} HrafPath={Hraf}/>)
            }
        })
    }
    // แก้เมนูให้มีปค่2เมนู พืช กับ ดูคำแนะนำ ไล่ทำการลิ้งค์หน้าใหม่ ทำการสร้าง funtion การจัดการ path
    return (
        <section ref={NavBody} className="nav-first">
            <div className="all-menu">
                <div className="head">Menu</div>
                <div className="row">
                    <div onClick={()=>selectMenu("ferti")} className="frame-menu frame-ferti">
                        <div className="img">
                            <img src="/ปลูก.jpg"></img>
                        </div>
                        <span>การปลูกของฉัน</span>
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

export default NavFirst