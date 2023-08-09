import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";
import MenuPlant from "../PlantList/MenuPlant";

import "./assets/Success.scss"
import { DayJSX, Loading } from "../../../../src/assets/js/module";
import List from "./ListSuccess";

const Success = ({ setBody , id_house , id_plant , liff , setPage , type , isClick = 0}) => {
    const Popup = useRef()
    // const [List , setList] = useState(<></>)
    const [PopupState , setPopup] = useState(<></>)

    const [DotSome , setDotSome] = useState([])
    const [DataPage , setDataPage] = useState({
        id_house : id_house,
        id_plant : id_plant,
        type : type.split(":")[1],
        isClick : isClick
    })

    useEffect(()=>{
        setPage("Success")
        setDataPage({
            id_house : id_house,
            id_plant : id_plant,
            type : type.split(":")[1],
            isClick : isClick
        })

        FetchCheck()
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    } , [])

    const ChangeMenu = (type) => {
        setDataPage({
            id_house : id_house,
            id_plant : id_plant,
            type : type,
            isClick : 1
        })
    }

    const FetchCheck = async () => {
        const result = await clientMo.get(`/api/farmer/report/check?id_farmhouse=${id_house}&id_plant=${id_plant}`)
        if(await CloseAccount(result , setPage)) {
            setDotSome(JSON.parse(result))
            console.log(JSON.parse(result))
        }
    }

    const OpenPopup = async (id_table_success , type , name_station , Dom) => {
        const result = await clientMo.post("/api/farmer/success/get" , {
            id_farmhouse : id_house , id_plant : id_plant , id_table : id_table_success
        })
        if(await CloseAccount(result , setPage)) {
            const ob = JSON.parse(result)
            if(ob[0]) setPopup(<PopupSuccess Ref={Popup} setPopup={setPopup}
                                    Data={{
                                        id_success : ob[0].id_success,
                                        name_station : name_station
                                    }} />)
            else setPopup(<PopupSuccess Ref={Popup} setPopup={setPopup} setPage={setPage} Dom={Dom}
                            Data={{
                                id_table : id_table_success,
                                type : type,
                                name_station : name_station
                            }} 
                            MainData={{
                                id_house : id_house,
                                id_plant : id_plant
                            }}/>)
        }
    }

    const ReturnPage = async () =>{
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setBody(<MenuPlant setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} isClick={1} liff={liff} />)
        }
    }

    return (
        <>
        <div className="body-success">
            <div className="head">
                <div className="return" onClick={ReturnPage}>
                    <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                        <g fillRule="evenodd">
                            <path d="M1052 92.168 959.701 0-.234 959.935 959.701 1920l92.299-92.43-867.636-867.635L1052 92.168Z"/>
                            <path d="M1920 92.168 1827.7 0 867.766 959.935 1827.7 1920l92.3-92.43-867.64-867.635L1920 92.168Z"/>
                        </g>
                    </svg>
                </div>
                <span>{DataPage.type === "h" ? "การเก็บเกี่ยว" : DataPage.type === "cf" ? "ตรวจสอบแบบฟอร์ม" : DataPage.type === "cp" ? "ตรวจสอบผลผลิต" : ""}</span>
            </div>
            <div className="menu-success">
                {!(DataPage.type === "h") ? 
                    <span onClick={()=>ChangeMenu("h")}>
                        การเก็บเกี่ยว
                        {DotSome[0] ? DotSome[0].success ? <div className="dot-someting"></div> : <></> : <></>}
                    </span> : <></>}
                {!(DataPage.type === "cf") ? 
                    <span onClick={()=>ChangeMenu("cf")}>
                        ผลตรวจแบบฟอร์ม
                        { DotSome[0] ? DotSome[0].form ? <div className="dot-someting"></div> : <></> : <></>}
                    </span> : <></>}
                {!(DataPage.type === "cp") ? 
                    <span onClick={()=>ChangeMenu("cp")}>
                        ผลตรวจผลผลิต
                        { DotSome[0] ? DotSome[0].plant ? <div className="dot-someting"></div> : <></> : <></>}
                    </span> : <></>}
            </div>
            <div className="content-success">
                <div className="list-success">
                    <List liff={liff} setPage={setPage} DetailFetchList={DataPage} OpenPopup={OpenPopup}/>
                </div>
            </div>
            <div ref={Popup} className="popup">
                {PopupState}
            </div>
        </div>
        </>
    )
}

const PopupSuccess = ({Ref , setPopup , setPage , Dom ,
    Data = {type : "" , id_table : "" , id_success : "" , name_station : ""} , 
    MainData = {id_plant : "" , id_house : ""}}) => {
        
    const [Load , setLoad] = useState(false)
    
    useEffect(()=>{
        Ref.current.setAttribute("show" , "")
    } , [])

    const cancel = () => {
        Ref.current.removeAttribute("show")
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const Confirm = async () => {
        const data = {
            id_farmhouse : MainData.id_house,
            id_plant : MainData.id_plant,
            id_table_success : Data.id_table,
        }

        setLoad(true)
        const result = await clientMo.post("/api/farmer/success/update" , data)
        if(await CloseAccount(result , setPage)){
            Dom.target.innerHTML = "แสดงรหัส"
            cancel()
        }
    }

    return(
        <section className="detail-popup">
            <div className="head-content">
                <div className="head-popup">{Data.id_success ? Data.id_success : Data.type ? "เก็บผลผลิต" : "เก็บผลตัวอย่าง"}</div>
                { Data.id_success ? <></> :
                    <div className="content-load">
                        {Load ? <Loading size={"1.5em"} border={"2vw"} color="green" animetion={true}/> : <></>}
                    </div>
                }
            </div>
            <div className="report-alert">
                {Data.id_success ? `* รหัสนี้สำหรับแนบกับผลผลิตเพื่อนำส่งศูนย์${Data.name_station}` : `* เมื่อกดยืนยัน จะแสดงปุ่มเพื่อแสดงรหัสสำหรับแนบกับผลผลิตส่งให้ทางศูนย์${Data.name_station}`}
            </div>
            <div className="bt">
                <button style={{backgroundColor : Data.id_success ? "green" : "red" , color : "white"}} onClick={cancel}>{Data.id_success ? "ตกลง" : "ยกเลิก"}</button>
                { Data.id_success ? <></>
                    : <button style={{backgroundColor : "green" , color : "white"}} onClick={Confirm}>ยืนยัน</button>
                }
            </div>
        </section>
    )
}

export default Success