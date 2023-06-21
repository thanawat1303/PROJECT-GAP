import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import { DAYUTC } from "../../../../src/assets/js/module";
import PopupInsertFactor from "./InsertFactor";
import Template from "../TemplateList";
import { CloseAccount } from "../../method";
import MenuPlant from "../PlantList/MenuPlant";

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

        (typeHraf.type === "z") ? ListFerti() : (typeHraf.type === "c") ? ListChemi() : null
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
            // console.log(result)
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
            // console.log(result)
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

    const ReturnPage = async () =>{
        const result = await clientMo.post("/api/farmer/formplant/check" , {id_farmhouse : id_house , id_form_plant : typeHraf.id_form_plant})
        if(await CloseAccount(result , setPage)) {
            setBody(<MenuPlant setBody={setBody} id_house={id_house} id_plant={typeHraf.id_form_plant} setPage={setPage} liff={liff} isClick={1} />)
        }
    }
 
    return (
        <>
        <Template PopUp={{PopupRef : PopupRef , PopupBody : PopupAdd}} 
            List={BodyList} Loading={Loading} action={popupInsertFactor} Option={
                {
                    TextHead : typeHraf.type === "z" ? "แบบบันทึกปัจจัยการผลิต" : typeHraf.type === "c" ? "แบบบันทึกสารเคมี" : "", 
                    img : typeHraf.type === "z" ? "/fertilizer.jpg" : typeHraf.type === "c" ? "/chemical.jpg" : ""
                }}/>
        <div className="" style={{
            display : "flex",
            position : "fixed",
            bottom : "0" ,
            left : "0",
            margin : "0px 0px 15px 15px"
        }} onClick={ReturnPage}>เมนู</div>
        </>
    )
}

export default ListFactor