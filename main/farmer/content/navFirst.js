import React, { useEffect, useRef } from "react";

import "../assets/NavFirst.scss"
import { clientMo } from "../../../src/assets/js/moduleClient";
import ListPlant from "./page/ListPlant";


const NavFirst = ({ setBody , path , liff , uid , setPage , isClick = 0}) => {
    const NavBody = useRef()

    useEffect(()=>{
        setPage("HOME")
        if(isClick === 1) window.history.pushState({} , null , `/farmer?farm=${path.get("farm")}`)

        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.addAction('#loading' , 'hide' , 1000)
        
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

    const Page = (page , type = 0) => {
        clientMo.post("/api/farmer/sign" , {
            uid : uid,
            page : `authplant`
        }).then((val)=>{
            if(val === "search") {
                setBody(<ListPlant path={path} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={type} valuePage={page} typePath={"page"}/>)
            }
        })
    }

    // const Factor = (page , typePath , type = 0) => {
    //     clientMo.post("/api/farmer/sign" , {
    //         uid : uid,
    //         page : `authFactor`
    //     }).then((val)=>{
    //         if(val === "search") {
    //             setBody(<ListPlant path={path} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={type} valuePage={page} typePath={typePath}/>)
    //         }
    //     })
    // }

    return (
        <section ref={NavBody} className="nav-first">
            <div className="all-menu">
                <div className="head">Menu</div>
                <div className="row">
                    <div onClick={()=>selectMenu("plant")} className="frame-menu frame-plant">
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
                <div className="report-farm" onClick={()=>selectMenu("report")}>
                    <img src="/คำแนะนำ.png"></img>
                </div>
            </div>
        </section>
    )
}

export default NavFirst