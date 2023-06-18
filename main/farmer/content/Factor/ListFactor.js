import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import { DAYUTC } from "../../../../src/assets/js/module";
import PopupInsertFertilizer from "./InsertFertilizer";
import Template from "../TemplateList";

const ListFactor = ({setBody , setPage , id_house , liff , uid , isClick = 0, HrafPath}) => {
    const [BodyList , setBodyList] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    const [PopupAdd , setPopupAdd] = useState(<></>)

    const PopupRef = useRef()

    let Factor = ["ferti" , "cremi" , "success" , "report"]
    let FormNamePage = ["formferti" , "formcremi"]
    
    useEffect(()=>{
        setPage(HrafPath.typePath)
        setBodyList(<></>)
        if(isClick === 1) window.history.pushState({} , null , `/farmer?farm=${id_house}&${HrafPath.typePath}=${HrafPath.id_plant}`)

        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()

        ListFerti()
    } , [HrafPath])

    // Load Data List

    const ListFerti = () => {
        clientMo.post('/api/farmer/factor/select' , {
            uid : uid,
            id_farmhouse : id_house,
            type : "formfertilizer",
            id : HrafPath.id_plant,
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

    // insert Popup
    const popupFertilizer = () => {
        const id = {
            id_house : id_house,
            id_form : HrafPath.id_plant
        }
        setPopupAdd(<PopupInsertFertilizer setLoading={setLoading} setPopup={setPopupAdd} 
                        RefPop={PopupRef} uid={uid} id={id} ReloadData={ListFerti}/>)
    }

    return (
        <Template PopUp={{PopupRef : PopupRef , PopupBody : PopupAdd}} 
            List={BodyList} Loading={Loading} action={popupFertilizer} Option={{TextHead : "เพิ่มปัจจัยการผลิต" , img : "/ปุ๋ยธรรมชาติ.webp"}}/>
    )
}

export default ListFactor