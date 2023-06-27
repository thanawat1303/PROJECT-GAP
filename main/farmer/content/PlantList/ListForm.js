import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import { DayJSX } from "../../../../src/assets/js/module";
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
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}`)

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
                                    <input readOnly value={val.type_plant ? val.type_plant : "ไม่ระบุ"}></input>
                                </div>
                                <div className="date">
                                    <span>วันที่ปลูก</span>
                                    <DayJSX DATE={val.date_plant} TYPE="short"/>
                                </div>
                            </div>
                            <div className="body">
                                <div className="content">
                                    <span>ชนิดพืช :</span>
                                    <div>{val.name_plant}</div>
                                </div>
                                <div className="content">
                                    <span>จำนวน :</span>
                                    <div>{`${val.qty} ต้น`}</div>
                                    {/* <input readOnly value=></input> */}
                                </div>
                                
                            </div>
                            <div className="bottom">
                                <div className="content">
                                    <span>รุ่นที่ :</span>
                                    <div>{val.generation}</div>
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

    // insert Popup
    const popupPlant = async () => {
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setPopupAdd(<PopupInsertPlant setLoading={setLoading} setPopup={setPopupAdd}
                RefPop={PopupRef} id_house={id_house} ReloadData={ListPlantForm} setPage={setPage}/>)
        }
    }

    // open menu
    const OpenMenuPlant = async (id_table_list) => {
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setBody(<MenuPlant setBody={setBody} id_house={id_house} id_plant={id_table_list} setPage={setPage} liff={liff} isClick={1}/>)
        } 
    }

    return (
        <Template PopUp={{PopupRef : PopupRef , PopupBody : PopupAdd}}
            List={BodyList} Loading={Loading} action={popupPlant} Option={{TextHead : "แบบบันทึกเกษตรกร" , img : "/plant_glow.jpg"}}/>
    )
}

export default ListForm