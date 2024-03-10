import React, { useState , useEffect } from "react"
import { clientMo } from "../../../../../assets/js/moduleClient"
import { CloseAccount } from "../../method"
import { DayJSX } from "../../../../../assets/js/module"

const List = ({liff , setPage , DetailFetchList , OpenPopup}) => {
    const [body , setBody] = useState(<></>)
    
    useEffect(()=>{
        StartLoad(DetailFetchList)
    } , [DetailFetchList])

    const StartLoad = async (DetailPage) => {
        await FetchData()
        if(DetailPage.isClick === 1) window.history.pushState({} , null , `/farmer/form/${DetailPage.id_house}/s/${DetailPage.id_plant}/${DetailFetchList.type}`)
    }

    const FetchData = async () => {
        const result = await clientMo.get(`/api/farmer/report/list?id_farmhouse=${DetailFetchList.id_house}&id_plant=${DetailFetchList.id_plant}&type=${DetailFetchList.type}`)
        if(await CloseAccount(result , setPage)) {
            setBody(JSON.parse(result).map((val , key)=>
                <div className={`list-in-${DetailFetchList.type}`} key={val.id}>
                    { DetailFetchList.type === "h" ?
                        <>
                        <div className="row first">
                            <div className="type-head">{val.type_success ? "เก็บผลผลิต" : "เก็บผลตัวอย่าง"}</div>
                            <div className="date">
                                <DayJSX DATE={val.date_of_doctor} TYPE="normal"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="station">
                                {/* <span>ศูนย์</span> */}
                                <div className="name-station">{val.name_station}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="bt">
                                <button onClick={(e)=>OpenPopup(val.id , val.type_success , val.name_station , e)}>{val.date_of_farmer ? "แสดงรหัส" : "ยืนยัน"}</button>
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

export default List