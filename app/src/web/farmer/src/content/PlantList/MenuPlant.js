import React, { useContext, useEffect, useRef, useState } from "react";

import "./Menu.scss"
import { clientMo } from "../../../../../assets/js/moduleClient";
import { CloseAccount } from "../../method";
import ListFactor from "../Factor/ListFactor";
import Success from "../Success/Success";
import DataForm from "../DataForm/DataForm";
import Report from "../Report/Report";

import Locals from "../../../../../locals";
import {FarmerProvider} from "../../main"

const MenuPlant = ({ setBody , id_house , id_plant , liff , setPage , isClick = 0}) => {
    const { lg } = useContext(FarmerProvider)
    
    const NavBody = useRef()
    const [DotReport , setDotReport] = useState([])
    const [getDotEditPlant , setDotEditPlant] = useState(false)

    useEffect(()=>{
        setPage("MENU ON LIST")
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/p/${id_plant}`)

        // FetchFormPlant()
        FetchCheck()

        // if(document.getElementById("loading").classList[0] !== "hide") 
        clientMo.unLoadingPage()
    } , [])

    // const FetchFormPlant = async () => {
    //     const result = await clientMo.post("/api/farmer/formplant/select" , {id_formplant : id_plant , id_farmhouse : id_house})
    //     if(await CloseAccount(result , setPage)) {
    //         const DataIn = JSON.parse(result)
    //         setDotEditPlant(DataIn[0].filter(val.subjectResult))
    //     }
    // }

    const FetchCheck = async () => {
        const result = await clientMo.get(`/api/farmer/report/check?id_farmhouse=${id_house}&id_plant=${id_plant}`)
        if(await CloseAccount(result , setPage)) {
            setDotReport(JSON.parse(result))
        }
    }

    const selectMenu = async (page) => {
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            if(page === "plant") setBody(<DataForm id_house={id_house} id_plant={id_plant} setBody={setBody} setPage={setPage} liff={liff} isClick={1}/>)
            else if (page === "z" || page === "c") {
                setBody(<ListFactor setBody={setBody} setPage={setPage} id_house={id_house} typeHraf={{id_form_plant : id_plant , type : page}} isClick={1}/>)
            }
            else if (page === "h") {
                setBody(<Success setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} type={"menu:h"} isClick={1} liff={liff}/>)
            }
            else if (page === "r") {
                setBody(<Report setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} isClick={1} liff={liff}/>)
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
                        <span>{Locals[lg]["cul_info"]}</span>
                        {DotReport.checkEditPlant ? <div className="dot-someting"></div> : <></>}
                    </div>
                    <div onClick={()=>selectMenu("z")} className="frame-menu frame-ferti">
                        <div className="img">
                            <img src="/fertilizer.jpg"></img>
                        </div>
                        <span>{Locals[lg]["fertilizer_farmer"]}</span>
                        {DotReport.checkEditFertilizer ? <div className="dot-someting"></div> : <></>}
                    </div>
                </div>
                <div className="row">
                    <div onClick={()=>selectMenu("c")} className="frame-menu frame-chemi">
                        <div className="img">
                            <img src="/chemical.jpg"></img>
                        </div>
                        <span>{Locals[lg]["chemical_farmer"]}</span>
                        {DotReport.checkEditChemical ? <div className="dot-someting"></div> : <></>}
                    </div>
                    <div onClick={()=>selectMenu("h")} className="frame-menu frame-success">
                        <div className="img">
                            <img src="/เก็บ.png"></img>
                        </div>
                        <span>{Locals[lg]["harvesting"]}</span>
                        {DotReport[0] ? DotReport[0].success || DotReport[0].form || DotReport[0].plant ? <div className="dot-someting"></div> : <></> : <></>}
                    </div>
                </div>
                <div className="report-farm" 
                    onClick={()=>selectMenu("r")}
                    >
                    <img src="/report.png"></img>
                    {DotReport[0] ? DotReport[0].report ? <div className="dot-someting"></div> : <></> : <></>}
                </div>
            </div>
        </section>
    )
}

export default MenuPlant