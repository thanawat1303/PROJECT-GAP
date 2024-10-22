import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";

import "../../assets/style/page/PopupManage.scss"
import { GetLinkUrlOfSearch, Loading, MapsJSX, ReportAction } from "../../../../../src/assets/js/module";
const EditPage = ({RefOnPage , id_table , type , setBecause , TabOn , session , ReloadData}) => {
    const [LoadingStatus , setLoading] = useState(true)

    const [ScreenW , setScreenW] = useState(window.innerWidth)
    const [ScreenH , setScreenH] = useState(window.innerHeight)

    const [getHide , setHide] = useState(true)
    const [getTime , setTime] = useState(0)

    const [getTimeOut , setTimeOut] = useState(0)
    const [getTimeOutChange , setTimeOutChange] = useState(0)
    const [getLag , setLag] = useState(0)
    const [getLng , setLng] = useState(0)

    const [Open , setOpen] = useState(0)
    const [Text , setText] = useState("")
    const [Status , setStatus] = useState(0)

    const NameRef = useRef()
    const OtherRef = useRef()
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
            clearTimeout(getTimeOut)
            clearTimeout(getTime)
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

        if(type === "station") {
            setLag(data.location.x)
            setLng(data.location.y)
        }

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
        const Validate = validateValue()
        if(Validate) {
            setOpen(1)
            const result = await clientMo.post("/api/admin/data/edit" , Validate)
            if(result === "133") {
                setText(`แก้ไข${type === "plant" ? "ชนิดพืช" : type === "station" ? "ศูนย์ส่งเสริม" : ""}สำเร็จ`)
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

    const validateValue = () => {
        const name = NameRef.current
        const Location = OtherRef.current.value.split(":")
        const password = PasswordRef.current

        if(( ( name.value != Data.name ) || (Location[0] != Data.dataOther.x || Location[1] != Data.dataOther.y) ) && password.value) {
            setHide(false)
            const DataReturn = {
                id_table : Data.id,
                update : {
                    name : `"${name.value.trim()}"`,
                    location : `POINT(${getLag} , ${getLng})` ,
                },
                password : password.value,
                type : type
            }

            if(name.value == Data.name) delete DataReturn.update.name;
            if(Location[0] == Data.dataOther.x && Location[1] == Data.dataOther.y) {
                delete DataReturn.update.location;
            }
            return DataReturn
        } else {
            setHide(true)
            return false
        }
    }

    const GenerateMap = async (e) => {
        return await new Promise((resole , reject)=>{
            clearTimeout(getTimeOut)
            if(e.target.value) {
                setTimeOut(setTimeout( async ()=>{
                    let valueLocation = await GetLinkUrlOfSearch(e.target.value , "admin")
                    if(!isNaN(valueLocation[0]) && !isNaN(valueLocation[1])) {
                        setLag(valueLocation[0])
                        setLng(valueLocation[1])
                    }
                    resole()
                } , 2000))
            } else {
                setLag(Data.dataOther.x)
                setLng(Data.dataOther.y)
                resole()
            }
        })
    }

    const AfterConfirm = () => {
        if(Status === 1) {
            close()
            ReloadData()
        }
        else {
            if(Status != 0) {
                setOpen(0)
                setTime(setTimeout(()=>{
                    setText("")
                    setStatus(0)
                } , 500))
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
                {`แก้ไข${type === "plant" ? "ชนิดพืช" : type === "station" ? "ศูนย์ส่งเสริม" : ""}`}
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
                        <div className="name column">
                            {type === "plant" ? <span className={type}>ชื่อพืช</span> : <span className={type}>ชื่อศูนย์</span>}
                            <input onChange={()=>validateValue()} className="input-value" ref={NameRef} placeholder="ชื่อศูนย์ในโครงการ" defaultValue={Data.name}></input>
                        </div>
                        <div className={type === "plant" ? "type_plant" : "location column"}>
                            {
                                type === "plant" ? <span>ชนิดพืช</span> : <></>
                            }
                            {
                                type === "plant" ? <div>{Data.dataOther}</div> :
                                Data.dataOther ? 
                                    <>
                                    <div className="flied-location-edit" w={type}>
                                        <span className="head-flied">ตำแหน่งที่ตั้ง</span>
                                        <input onChange={ async (e)=>{
                                            clearTimeout(getTimeOutChange)
                                            await GenerateMap(e)
                                            setTimeOutChange(setTimeout(()=>{
                                                validateValue()
                                            } , 1))
                                        }} className="input-value" placeholder="ลิ้งค์ใน Google map"></input>
                                        <input ref={OtherRef} hidden value={`${getLag}:${getLng}`} readOnly></input>
                                    </div>
                                    <MapsJSX lat={getLag} lng={getLng} w={"300vw"} h={"80vw"}/>
                                    </>
                                    : 
                                    <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-manage">
                <label className="column">
                    <span>รหัสผ่านผู้ดูแล</span>
                    <input onChange={()=>validateValue()} placeholder="กรอกรหัสผ่าน" ref={PasswordRef} type="password" className="input-text input-pw"></input>
                </label>
                <div className="bt-manage">
                    <button onClick={close} className="close">ยกเลิก</button>
                    { Data.id ?
                        <button onClick={Submit} h={getHide ? "" : null} className="submit">ยืนยัน</button> : <></>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default EditPage