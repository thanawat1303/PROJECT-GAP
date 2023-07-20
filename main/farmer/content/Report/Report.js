import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";

import "./assets/Report.scss"
import { DayJSX, Loading } from "../../../../src/assets/js/module";
import MenuPlant from "../PlantList/MenuPlant";

const Report = ({ setBody , id_house , id_plant , liff , setPage , type , isClick = 0}) => {
    //type of menu => menu:[] , load => load:[] , popstate : pop:[]
    const [LoadingList , setLoadingList] = useState(false)
    const [DotSome , setDotSome] = useState([])
    const [DataPage , setDataPage] = useState({
        id_house : id_house,
        id_plant : id_plant,
        type : type.split(":")[1],
        isClick : isClick
    })

    useEffect(()=>{
        setPage("Report")

        setDataPage({
            id_house : id_house,
            id_plant : id_plant,
            type : type.split(":")[1],
            isClick : isClick
        })

        FetchCheck()
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    } , [type])

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

    const ReturnPage = async () =>{
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setBody(<MenuPlant setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} isClick={1} liff={liff} />)
        }
    }

    return (<>
            <div className="body-report">
                <div className="head">
                    <div className="return" onClick={ReturnPage}>
                        <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                            <g fillRule="evenodd">
                                <path d="M1052 92.168 959.701 0-.234 959.935 959.701 1920l92.299-92.43-867.636-867.635L1052 92.168Z"/>
                                <path d="M1920 92.168 1827.7 0 867.766 959.935 1827.7 1920l92.3-92.43-867.64-867.635L1920 92.168Z"/>
                            </g>
                        </svg>
                    </div>
                    <span>{DataPage.type === "g" ? "ข้อแนะนำ" : DataPage.type === "cf" ? "ตรวจสอบแบบฟอร์ม" : DataPage.type === "cp" ? "ตรวจสอบผลผลิต" : ""}</span>
                </div>
                <div className="menu-report">
                    {!(DataPage.type === "g") ? 
                        <span onClick={()=>ChangeMenu("g")}>
                            ข้อแนะนำ
                            {DotSome[0] ? DotSome[0].report ? <div className="dot-someting"></div> : <></> : <></>}
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
                <div className="content-report">
                    <div className="list-report">
                        <List liff={liff} setPage={setPage} DetailFetchList={DataPage}/>
                    </div>
                </div>
            </div>
            </>
            )
}

const List = ({liff , setPage , DetailFetchList}) => {
    const [body , setBody] = useState(<></>)
    useEffect(()=>{
        if(DetailFetchList.isClick === 1) window.history.pushState({} , null , `/farmer/form/${DetailFetchList.id_house}/r/${DetailFetchList.id_plant}/${DetailFetchList.type}`)
        FetchData()
    } , [DetailFetchList])

    const FetchData = async () => {
        const result = await clientMo.get(`/api/farmer/report/list?id_farmhouse=${DetailFetchList.id_house}&id_plant=${DetailFetchList.id_plant}&type=${DetailFetchList.type}`)
        if(await CloseAccount(result , setPage)) {
            setBody(JSON.parse(result).map((val , key)=>
                <div className="list-in-report" key={key}>
                    { DetailFetchList.type === "g" ?
                        <>
                        <div className="row">
                            <div className="in-row">
                                <span>ครั้งที่</span>
                                <div>{key + 1}</div>
                            </div>
                            <div className="in-row column end frame">
                                <span>วันที่</span>
                                <DayJSX DATE={val.date_report} TYPE="small"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="in-row column">
                                <span>ข้อแนะนำ</span>
                                <div>{val.report_text}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="in-row">
                                <span>ผู้ส่งเสริม</span>
                                <div>{val.name_doctor}</div>
                            </div>
                        </div>
                        </> : 
                        DetailFetchList.type === "cf" ? 
                        <>
                        <div className="row">
                            <div className="in-row column">
                                <span>ผลตรวจสอบ</span>
                                <div>{val.status_check ? "ผ่าน" : "ไม่ผ่าน"}</div>
                            </div>
                            <div className="in-row column end frame">
                                <span>วันที่</span>
                                <DayJSX DATE={val.date_check} TYPE="small"/>
                            </div>
                        </div>
                        { !val.status_check ? 
                            <div className="row">
                                <div className="in-row column">
                                    <span>การแก้ไข</span>
                                    <div>{val.note_text ? val.note_text : "ไม่ระบุ"}</div>
                                </div>
                            </div> : <></>
                        }
                        <div className="row">
                            <div className="in-row">
                                <span>ผู้ตรวจสอบ</span>
                                <div>{val.name_doctor}</div>
                            </div>
                        </div>
                        </> :
                        DetailFetchList.type === "cp" ? 
                        <>
                        <div className="row">
                            <div className="in-row column">
                                <span>ผลวิเคราะห์</span>
                                <div>
                                    <status_check>{val.state_check ? "หลัง : " : "ก่อน : "}</status_check>
                                    {val.status_check}
                                </div>
                            </div>
                            <div className="in-row column end frame">
                                <span>วันที่</span>
                                <DayJSX DATE={val.date_check} TYPE="small"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="in-row column">
                                <span>หมายเหตุ</span>
                                <div>{val.note_text ? val.note_text : "ไม่ระบุ"}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="in-row">
                                <span>ผู้ตรวจสอบ</span>
                                <div>{val.name_doctor}</div>
                            </div>
                        </div>
                        </> : <></>
                    }
                </div>
            ))
        }
        
    }

    return(body)
}


export default Report