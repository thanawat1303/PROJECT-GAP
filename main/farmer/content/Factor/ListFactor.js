import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import { DAYUTC } from "../../../../src/assets/js/module";
import PopupInsertFertilizer from "./InsertFertilizer";
import Template from "../TemplateList";
import { CloseAccount } from "../../method";
import MenuPlant from "../PlantList/MenuPlant";

const ListFactor = ({setBody , setPage , id_house , CheckForm , typeHraf = {id_form_plant : "" , type : ""} , isClick = 0 , liff}) => {
    const [BodyList , setBodyList] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    const [PopupAdd , setPopupAdd] = useState(<></>)

    const PopupRef = useRef()
    
    useEffect(()=>{
        setPage(typeHraf.type)
        setBodyList(<></>)
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/${typeHraf.type}/${typeHraf.id_form_plant}`)

        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()

        (typeHraf.type === "z") ? ListFerti() : (typeHraf.type === "c") ? ListChemi() : null
    } , [typeHraf])

    // Load Data List

    const ListFerti = () => {
        clientMo.post('/api/farmer/factor/select' , {
            id_farmhouse : id_house,
            type : "formfertilizer",
            id : typeHraf.id_plant,
            order : "date"
        }).then((list)=>{
            setLoading(true)
            console.log(list)
            if(list !== 'error auth'){
            } else {
                setBodyList(<div></div>)
            }
        })
    }

    const ListChemi = async () => {
        const result = await clientMo.post('/api/farmer/factor/select' , {
            id_farmhouse : id_house,
            type : "formfertilizer",
            id : typeHraf.id_form_plant,
            order : "date"
        })

        
        console.log(result)
        if(await CloseAccount(result , setPage)) {
            
        }
        setLoading(true)
    }

    // insert Popup
    const popupFertilizer = async () => {
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setPopupAdd(<PopupInsertFertilizer setPage={setPage} id_house={id_house} id_form_plant={typeHraf.id_form_plant} setPopup={setPopupAdd} RefPop={PopupRef} ReloadData={ListFerti}/>)
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
            List={BodyList} Loading={Loading} action={popupFertilizer} Option={
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