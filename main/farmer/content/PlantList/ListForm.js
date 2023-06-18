import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import { DAYUTC } from "../../../../src/assets/js/module";
import PopupInsertPlant from "./InsertPlant";
import Template from "../TemplateList";
import MenuPlant from "./MenuPlant";
import { CloseAccount } from "../../method";

const ListForm = ({setBody , setPage , id_house , liff , isClick = 0}) => {
    const [BodyList , setBodyList] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    const [PopupAdd , setPopupAdd] = useState(<></>)

    const PopupRef = useRef()
    
    useEffect(()=>{
        setPage("HOME")
        setBodyList(<></>)
        if(isClick === 1) window.history.pushState({} , null , `/farmer?f=${id_house}`)

        ListPlantForm()
    } , [])

    // Load Data List
    const ListPlantForm = async () => {
        setLoading(false)
        const auth = await clientMo.post('/api/farmer/formplant/select' , {id_farmhouse : id_house})
        if(await CloseAccount(auth)) {
            setBodyList(JSON.parse(auth).map((val , key)=>
                        <div key={key} className="plant-content">
                            <div className="top">
                                <div className="type-main">
                                    <input readOnly value={val.type_plant}></input>
                                </div>
                                <div className="date">
                                    <span>วันที่ปลูก <DAYUTC DATE={val.date_plant} TYPE="short"/></span>
                                </div>
                            </div>
                            <div className="body">
                                <div className="content">
                                    <span>{val.name_plant}</span>
                                </div>
                                <div className="content">
                                    <input readOnly value={`จำนวน ${val.qty} ต้น`}></input>
                                </div>
                                
                            </div>
                            <div className="bottom">
                                <div className="content">
                                    <span>{`รุ่นที่ ${val.generation}`}</span>
                                </div>
                                <div className="bt">
                                    <button onClick={()=>OpenMenuPlant(val.id)}>บันทึกข้อมูล</button>
                                </div>
                            </div>
                        </div>
                    ))
        }

        setLoading(true)
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    }

    const OpenMenuPlant = async (id_table_list) => {
        const result = await clientMo.post("/api/farmer/formplant/select" , {id_formplant : id_table_list})
        if(await CloseAccount(result)) {
            const auth = window.location.href.split("?")[1]
            const path = new Map([...auth.split("&").map((val)=>val.split("="))])
            setBody(<MenuPlant id_house={path.get("f")} id_plant={id_table_list} setBody={setBody} setPage={setPage} liff={liff} isClick={1}/>)
        }
    }

    // insert Popup
    const popupPlant = () => {
        setPopupAdd(<PopupInsertPlant setLoading={setLoading} setPopup={setPopupAdd}
            RefPop={PopupRef} id_house={id_house} ReloadData={ListPlantForm}/>)
    }

    return (
        <Template PopUp={{PopupRef : PopupRef , PopupBody : PopupAdd}}
            List={BodyList} Loading={Loading} action={popupPlant} Option={{TextHead : "แบบบันทึกเกษตรกร" , img : "/ปลูก.jpg"}}/>
    )
}

export default ListForm