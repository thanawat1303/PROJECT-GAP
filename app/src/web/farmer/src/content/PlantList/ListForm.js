import React, { useContext, useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../assets/js/moduleClient";

import { DayJSX } from "../../../../../assets/js/module";
import PopupInsertPlant from "./InsertPlant";
import Template from "../TemplateList";
import MenuPlant from "./MenuPlant";
import { CloseAccount } from "../../method";
import { FarmerProvider } from "../../main";
import Locals from "../../../../../locals";

const ListForm = ({setBody , setPage , id_house , liff , isClick = 0}) => {
    const { lg } = useContext(FarmerProvider)
    
    const [BodyList , setBodyList] = useState([])
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
            setBodyList(JSON.parse(auth))
        }

        setLoading(true)
        // if(document.getElementById("loading").classList[0] !== "hide")
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
            List={
                BodyList.map((val , key)=>
                    <div key={val.id} className={`plant-content ${val.state_status == 2 ? "submit" : ""}`} style={
                        (val.report || val.form || val.plant || val.success) && val.state_status < 2 ? {
                        marginTop : "25px",
                        position : "relative"
                        } : {}}>
                        { (val.report || val.form || val.plant || val.success) && val.state_status < 2 ?
                            <div className="report-of-doctor" style={{
                                position : "absolute",
                                bottom : "100%",
                                right : "0.5em"
                            }}>
                                <span style={{
                                    backgroundColor : "red",
                                    padding : "1px 4px",
                                    borderRadius : "5px",
                                    fontWeight : "900",
                                    color : "white"
                                }}>{Locals[lg]["have_msg_doctor"]}</span>
                            </div> : <></>
                        }
                        <div className="top">
                            <div className="type-main">
                                <input readOnly value={val.type_plant ? val.type_plant : "ไม่ระบุ"}></input>
                            </div>
                            <div className="date">
                                <span>{Locals[lg]["date_plant"]}</span>
                                <DayJSX DATE={val.date_plant} TYPE="short"/>
                            </div>
                        </div>
                        <div className="body">
                            <div className="content">
                                <span>{Locals[lg]["plant_type"]} :</span>
                                <div>{val.name_plant}</div>
                            </div>
                            <div className="content">
                                <span>{Locals[lg]["quantity"]} :</span>
                                <div>{`${val.qty} ${Locals[lg]["tree"]}`}</div>
                                {/* <input readOnly value=></input> */}
                            </div>
                            
                        </div>
                        <div className="bottom">
                            <div className="content">
                                <span>{Locals[lg]["__generation_this"]} :</span>
                                <div>{val.generation}</div>
                            </div>
                            <div className="bt">
                                <button onClick={()=>OpenMenuPlant(val.id)}>{val.state_status < 2 ? Locals[lg]["save_data"] : Locals[lg]["view"]}</button>
                            </div>
                        </div>
                    </div>
                )
            } 
            Loading={Loading} action={popupPlant} Option={{TextHead : Locals[lg]["form_farmer"] , img : "/plant_glow.jpg"}}
        />
    )
}

export default ListForm