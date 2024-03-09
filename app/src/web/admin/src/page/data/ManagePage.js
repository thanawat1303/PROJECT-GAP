import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../assets/js/moduleClient";

import "../../assets/style/page/PopupManage.scss"
import { Loading, MapsJSX, ReportAction } from "../../../../../assets/js/module";
const ManageDataPage = ({RefOnPage , id_table , type , status , setBecause , TabOn , session , ReloadData}) => {
    const [LoadingStatus , setLoading] = useState(true)

    const [ScreenW , setScreenW] = useState(window.innerWidth)
    const [ScreenH , setScreenH] = useState(window.innerHeight)

    const [Open , setOpen] = useState(0)
    const [Text , setText] = useState("")
    const [Status , setStatus] = useState(0)

    const PasswordRef = useRef()

    const [Data , setData] = useState({
        id : "", 
        name : "",
        dataOther : null
    })

    useEffect(()=>{
        RefOnPage.current.style.opacity = "1"
        RefOnPage.current.style.visibility = "visible"

        TabOn.addTimeOut(TabOn.end())

        FecthData()

        window.removeEventListener("resize" , setSizeScreen)
        window.addEventListener("resize" , setSizeScreen)
        return()=>{
            window.removeEventListener("resize" , setSizeScreen)
        }
    } , [])

    const FecthData = async () => {
        let data = await clientMo.post("/api/admin/data/get" , {id : id_table , type : type})
        data = JSON.parse(data).map((val)=>val)[0]
        setData({
            id : data.id,
            name : data.name,
            dataOther : type === "plant" ? data.type_plant : type === "station" ? data.location : ""
        })
        setLoading(false)
    }

    const close = () => {
        RefOnPage.current.removeAttribute("style")
        window.removeEventListener("resize" , setSizeScreen)
        setTimeout(()=>{
            setBecause(<></>)
        } , 500)
    }

    const setSizeScreen = (e) => {
        setScreenW(window.innerWidth)
        setScreenH(window.innerHeight)
    }

    const Submit = async () => {
        if(PasswordRef.current.value) {
            const data = {
                id_table : Data.id,
                state_use : status == 1 ? 0 : 1,
                password : PasswordRef.current.value,
                type : type
            }

            setOpen(1)
            const result = await clientMo.post("/api/admin/data/change" , data)
            if(result === "133") {
                setText(`${status == 1 ? "ปิด" : "เปิด"}${type === "plant" ? "ชนิดพืช" : type === "station" ? "ศูนย์ส่งเสริม" : ""}สำเร็จ`)
                setStatus(1)
            } else if(result === "over") {
                setText(`มี${type === "plant" ? "ชนิดพืช" : type === "station" ? "ศูนย์ส่งเสริม" : ""}ใช้งานอยู่`)
                setStatus(3)
            } else if(result === "because") {
                setText("เกิดปัญหาทางเซิร์ฟเวอร์")
                setStatus(3)
            } else if(result === "password") {
                setText("รหัสผ่านไม่ถูกต้อง")
                setStatus(3)
                PasswordRef.current.value = ""
            } else {
                setOpen(0)
                session()
            }
        }
    }

    let Time = 0
    const AfterConfirm = () => {
        if(Status === 1) {
            // document.querySelector(`#data-list-content-${id_table} Action-bt content-status Bt-status .frame`)
            //         .setAttribute("status" , status ? 0 : 1)
            close()
            ReloadData()
        }
        else {
            if(Status != 0) {
                setOpen(0)
                Time = setTimeout(()=>{
                    setText("")
                    setStatus(0)
                } , 500)
            }
        }
    }

    return (
        <>
        <ReportAction Open={Open} Text={Text} Status={Status} 
                        setOpen={setOpen} setText={setText} setStatus={setStatus}
                        sizeLoad={90}
                        BorderLoad={10}
                        color="#1CFFF1" action={AfterConfirm}/>
        <div className="manage-page">
            <div className="head-page">
                {`ยืนยันการ${status == 1 ? "ปิด" : "เปิด"}${type === "plant" ? "ชนิดพืช" : type === "station" ? "ศูนย์ส่งเสริม" : ""}`}
            </div>
            <div className="detail-content">
                {LoadingStatus ? 
                    <div className="Loading">
                        <Loading size={4/100 * ScreenW >= 41 ? 4/100 * ScreenW : 41} border={0.5/100 * ScreenW >= 5 ? 0.5/100 * ScreenW : 5} color="#1CFFF1" animetion={LoadingStatus}/>
                        <span>กำลังโหลดข้อมูล{type === "plant" ? "ชนิดพืช" : type === "station" ? "ศูนย์ส่งเสริม" : ""}</span>
                    </div>
                    : <></>
                }
                <div className="detail-data-report">
                    <div className="data-popup" maxsize="" flex={type}>
                        <div className="name" w={type}>
                            {type === "plant" ? <span className={type}>ชื่อพืช</span> : <></>}
                            <div>{Data.name}</div>
                        </div>
                        <div className={type === "plant" ? "type_plant" : "location"}>
                            {
                                type === "plant" ? <span>ชนิดพืช</span> : <></>
                            }
                            {
                                type === "plant" ? <div>{Data.dataOther}</div> :
                                Data.dataOther ? 
                                    <MapsJSX lat={Data.dataOther.x} lng={Data.dataOther.y} w={"300vw"} h={"80vw"}/> : 
                                    ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-manage">
                <label className="column">
                    <span>รหัสผ่านผู้ดูแล</span>
                    <input placeholder="กรอกรหัสผ่าน" ref={PasswordRef} type="password" className="input-text input-pw"></input>
                </label>
                <div className="bt-manage">
                    <button onClick={close} className="close">ยกเลิก</button>
                    <button onClick={Submit} className="submit">ยืนยัน</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default ManageDataPage