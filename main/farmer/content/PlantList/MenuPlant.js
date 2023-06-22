import React, { useEffect, useRef } from "react";

import "./assets/Menu.scss"
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";
import ListFactor from "../Factor/ListFactor";
import Success from "../Success/Success";
import DataForm from "../DataForm/DataForm";

const MenuPlant = ({ setBody , id_house , id_plant , liff , setPage , isClick = 0}) => {
    const NavBody = useRef()

    useEffect(()=>{
        setPage("MENU ON LIST")
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/p/${id_plant}`)

        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    } , [])

    const selectMenu = async (page) => {
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            if(page === "plant") setBody(<DataForm id_house={id_house} id_plant={id_plant} setBody={setBody} setPage={setPage} liff={liff} isClick={1}/>)
            else if (page === "z" || page === "c") {
                setBody(<ListFactor setBody={setBody} setPage={setPage} id_house={id_house} typeHraf={{id_form_plant : id_plant , type : page}} isClick={1}/>)
            }
            else if (page === "s") {
                setBody(<Success setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} isClick={1} liff={liff}/>)
            }
        } 
    }

    return (
        <section ref={NavBody} className="nav-first">
            <div className="all-menu">
                <div className="head">Menu</div>
                <div className="row">
                    <div onClick={()=>selectMenu("plant")} className="frame-menu frame-plant">
                        <div className="img">
                            <img src="/plant_glow.jpg"></img>
                        </div>
                        <span>ข้อมูลการปลูก</span>
                    </div>
                    <div onClick={()=>selectMenu("z")} className="frame-menu frame-ferti">
                        <div className="img">
                            <img src="/fertilizer.jpg"></img>
                        </div>
                        <span>ปัจจัยการผลิต</span>
                    </div>
                </div>
                <div className="row">
                    <div onClick={()=>selectMenu("c")} className="frame-menu frame-chemi">
                        <div className="img">
                            <img src="/chemical.jpg"></img>
                        </div>
                        <span>สารเคมีที่ใช้</span>
                    </div>
                    <div onClick={()=>selectMenu("s")} className="frame-menu frame-success">
                        <div className="img">
                            <img src="/เก็บ.png"></img>
                        </div>
                        <span>การเก็บเกี่ยว</span>
                    </div>
                </div>
                <div className="report-farm" 
                    onClick={()=>selectMenu("report")}
                    >
                    <img src="/report.png"></img>
                </div>
            </div>
        </section>
    )
}

export default MenuPlant