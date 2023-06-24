import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import { DayJSX } from "../../../../src/assets/js/module";
import PopupInsertFactor from "./InsertFactor";
import Template from "../TemplateList";
import { CloseAccount } from "../../method";
import MenuPlant from "../PlantList/MenuPlant";
import EditFactorPopup from "./EditFactor";

const ListFactor = ({setBody , setPage , id_house , typeHraf = {id_form_plant : "" , type : ""} , isClick = 0 , liff}) => {
    const [BodyList , setBodyList] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    const [PopupAdd , setPopupAdd] = useState(<></>)

    const PopupRef = useRef()
    
    useEffect(()=>{
        setPage(typeHraf.type)
        setBodyList(<></>)
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/${typeHraf.type}/${typeHraf.id_form_plant}`)

        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage();

        (typeHraf.type === "z") ? ListFerti() : (typeHraf.type === "c") ? ListChemi() : null;

        window.addEventListener("touchstart" , CloseManage)

        return () => {
            window.removeEventListener("touchstart" , CloseManage)
        }
    } , [typeHraf])

    // Load Data List

    const ListFerti = async () => {
        const result = await clientMo.post('/api/farmer/factor/select' , {
            id_farmhouse : id_house,
            type : "fertilizer",
            id_plant : typeHraf.id_form_plant,
            order : "date"
        })
        if(await CloseAccount(result , setPage)) {
            const Ob = JSON.parse(result)
            setBodyList(Ob.map((val , key)=>
                <section key={key} className={`list-factor-content content-${val.id}`}>
                    <div className="row">
                        <div className="name">{val.name}</div>
                        <div className="date">
                            <DayJSX DATE={val.date} TYPE="normal"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="nameMain">
                            สูตร {val.formula_name}
                        </div>
                        <div className="volume">
                            {val.volume} ก.ก.
                        </div>
                    </div>
                    <div className="row">
                        <div className="source">{val.source}</div>
                        <button onClick={(e)=>OpenManage(val.id , e)}>จัดการ</button>
                        <div className={`manage-form content-${val.id}`}>
                            <div>รายละเอียด</div>
                            <div onClick={()=>PopupEditForm(val.id , val)}>แก้ไขข้อมูล</div>
                            <div onClick={()=>HistoryEdit(val.id)}>ประวัติแก้ไข</div>
                        </div>
                    </div>
                </section>
            ))
            setLoading(true)
        }
    }

    const ListChemi = async () => {
        const result = await clientMo.post('/api/farmer/factor/select' , {
            id_farmhouse : id_house,
            type : "chemical",
            id_plant : typeHraf.id_form_plant,
            order : "date"
        })
        if(await CloseAccount(result , setPage)) {
            const Ob = JSON.parse(result)
            console.log(Ob)
            setBodyList(Ob.map((val , key)=>
                <section key={key} className={`list-factor-content content-${val.id}`}>
                    <div className="row">
                        <div className="name">{val.name}</div>
                        <div className="nameMain">
                            สูตร {val.formula_name}
                        </div>
                    </div>
                    <div className="row">
                        <div className="insect">
                            ศัตรูพืช {val.insect}
                        </div>
                        <div className="rate">
                            {val.rate}
                        </div>
                        <div className="volume">
                            {val.volume} ก.ก.
                        </div>
                    </div>
                    <div className="row">
                        <div className="date-safe">
                            <DayJSX DATE={val.date_safe} TEXT="วันที่ปลอดภัย" TYPE="small"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="source">{val.source}</div>
                        <button onClick={(e)=>OpenManage(val.id , e)}>จัดการ</button>
                        <div className={`manage-form content-${val.id}`}>
                            <div>รายละเอียด</div>
                            <div onClick={()=>PopupEditForm(val.id , val)}>แก้ไขข้อมูล</div>
                            <div onClick={()=>HistoryEdit(val.id)}>ประวัติแก้ไข</div>
                        </div>
                    </div>
                </section>
            ))
            setLoading(true)
        }
    }

    // insert Popup
    const popupInsertFactor = async () => {
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            const Reload = typeHraf.type === "z" ? ListFerti : ListChemi
            setPopupAdd(<PopupInsertFactor setPage={setPage} 
                            id_house={id_house} id_form_plant={typeHraf.id_form_plant} type_path={typeHraf.type} 
                            setPopup={setPopupAdd} RefPop={PopupRef} ReloadData={Reload}/>)
        } 
    }

    // edit start
    const PopupEditForm = async (id_table , DataObject) => {
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            const Reload = typeHraf.type === "z" ? ListFerti : ListChemi;
            setPopupAdd(<EditFactorPopup setPage={setPage} 
                            id_house={id_house} id_form_plant={typeHraf.id_form_plant} type_path={typeHraf.type} 
                            setPopup={setPopupAdd} RefPop={PopupRef} ReloadData={Reload} ObjectData={DataObject}/>)
        }
    }

    const HistoryEdit = async (id_table) => {
        const result = await clientMo.post("/api/farmer/factor/edit/select" , {
            id_farmhouse : id_house , 
            id_plant : typeHraf.id_form_plant ,
            id_form_factor : id_table ,
            type_form : (typeHraf.type === "z") ? "fertilizer" : (typeHraf.type === "c") ? "chemical" : ""
        })
        if(await CloseAccount(result , setPage)) {
            // popup show edit
        }
    }
    // edit end

    const OpenManage = (id_table , e) => {
        const managePop = document.querySelector(`.list-factor-content.content-${id_table} .manage-form.content-${id_table}`)
        managePop.toggleAttribute("show")
        e.target.toggleAttribute("show")
    }

    const CloseManage = (e) => {
        if(e.target.getAttribute("show") === null) {
            const managePop = document.querySelector(`.list-factor-content .manage-form[show=""]`)
            const Bt = document.querySelector(`.list-factor-content button[show=""]`)
            if(Bt && managePop) {
                managePop.removeAttribute("show")
                Bt.removeAttribute("show")
            }
        }
        
    }

    const ReturnPage = async () =>{
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setBody(<MenuPlant setBody={setBody} id_house={id_house} id_plant={typeHraf.id_form_plant} setPage={setPage} liff={liff} isClick={1} />)
        }
    }
 
    return (
        <>
        <Template PopUp={{PopupRef : PopupRef , PopupBody : PopupAdd}} 
            List={BodyList} Loading={Loading} action={popupInsertFactor} Option={
                {
                    TextHead : typeHraf.type === "z" ? "บันทึกปัจจัยการผลิต" : typeHraf.type === "c" ? "บันทึกสารเคมี" : "", 
                    img : typeHraf.type === "z" ? "/fertilizer.jpg" : typeHraf.type === "c" ? "/chemical.jpg" : ""
                }} actionReturn={ReturnPage}/>
        </>
    )
}

export default ListFactor