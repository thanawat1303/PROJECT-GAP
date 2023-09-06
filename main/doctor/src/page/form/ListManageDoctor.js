import React, { useRef, useState } from "react";
import { DayJSX, OpenImageMax, PopupDom } from "../../../../../src/assets/js/module";

const ListReport = ({data , index}) => {
    const RefOpenImage = useRef()
    const [getOpenImg , setOpenImg] = useState()

    const OpenImg = () => {
        setOpenImg(<OpenImageMax img={`/doctor/report/${data.image_path}`} Ref={RefOpenImage} setPopup={setOpenImg}/>)
    }

    return(
        <>
            <PopupDom Ref={RefOpenImage} Body={getOpenImg} zIndex={999} Background="#000000b3"/>
            <div className="row">
                <div className="field">
                    <span>ครั้งที่</span>
                    <div>{index + 1}</div>
                </div>
                <div className="field date">
                    <span>วันที่</span>
                    <DayJSX DATE={data.date_report} TYPE="small"/>
                </div>
            </div>
            <div className="row">
                <div className="field column">
                    <span>ข้อแนะนำ</span>
                    <div>{data.report_text}</div>
                </div>
            </div>
            {/* <div className="row">
                <div className="field">
                    <span>เจ้าหน้าที่</span>
                    <div>{data.name_doctor}</div>
                </div>
                <div className="field">
                    <span>ไอดีเจ้าหน้าที่</span>
                    <div>{data.id_doctor}</div>
                </div>
            </div> */}
            <div className="row end">
                { data.image_path ?
                    <div className="field menu-detail" onClick={OpenImg}>
                        <svg className="icon-menu" viewBox="0 0 16 16" >
                            <path id="rect4082" d="M1 1v14h14V1zm1 1h12v12H2z"/>
                            <path id="path847" d="M5 3a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2zm0 1a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1z" /><path id="path869" d="m3 12 1 1 3-3 1 1 2-2 2 2 1-1-3-3-2 2-1-1z" />
                        </svg>
                    </div> : <></>
                }
                <div className="field menu-detail">
                    <svg className="icon-menu" viewBox="0 0 1024 1024">
                        <path d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H608zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H608z"/>
                    </svg>
                    {/* <button className="edit-report" onClick={()=>PopupEditReport(data , "report")}>แก้ไข</button> */}
                </div>
            </div>
            {/* {
                data.check_doctor ?
                 : <></>
            } */}
        </>
    )
}

const ListCheckForm = ({data , index}) => {
    return(
        <>
            <div className="row">
                <div className="field">
                    <span>ผลตรวจสอบ</span>
                    <div>{data.status_check ? "ผ่าน" : "ไม่ผ่าน"}</div>
                </div>
                <div className="field date">
                    <span>วันที่</span>
                    <DayJSX DATE={data.date_check} TYPE="small"/>
                </div>
            </div>
            { data.status_check ? <></> :
                <div className="row">
                    <div className="field column">
                        <span>การแก้ไข</span>
                        <div>{data.note_text ? data.note_text : "ไม่ระบุ"}</div>
                    </div>
                </div>
            }
            <div className="row">
                <div className="field">
                    <span>เจ้าหน้าที่</span>
                    <div>{data.name_doctor}</div>
                </div>
                <div className="field">
                    <span>ไอดีเจ้าหน้าที่</span>
                    <div>{data.id_doctor}</div>
                </div>
            </div>
        </>
    )
}

export {ListReport , ListCheckForm}