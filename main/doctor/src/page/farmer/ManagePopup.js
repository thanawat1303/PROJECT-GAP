import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import { DayJSX, Loading, MapsJSX, PopupDom, TimeJSX } from "../../../../../src/assets/js/module";
import "../../assets/style/page/farmer/ManagePopup.scss"

import SelectConvert from "./SelectConvert";

const ManagePopup = ({setPopup , RefPop , result , status , session , countLoad , Fecth}) => {
    const [DetailFarmer , setDetailFarmer] = useState(<></>)
    const [Load , setLoad] = useState(true)

    const PopRefConvert = useRef()
    const [PopupConvert , setPopConvert] = useState(<></>)
    const [LoadConvert , setLoadConvert] = useState(false)

    const [ProfileConvert , setConvert] = useState({
        id_table_convert : "" ,
        fullname : "" ,
        img : ""
    })

    const RefOnType = status === "ap" ? 
    {

    } 
    : 
    {
        FarmerID : useRef(),
        DoctorPw : useRef(),
        ButtonRef : useRef()
    }

    useEffect(()=>{
        RefPop.current.style.opacity = "1"
        RefPop.current.style.visibility = "visible"

        FetchData(result[0])
    } , [])

    const close = () => {
        RefPop.current.style.opacity = "0"
        RefPop.current.style.visibility = "hidden"

        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const FetchData = async (result) => {
        setLoad(true)
        const resultData = await clientMo.post("/api/doctor/farmer/get/detail" , {id_table : result.id_table , link_user : result.link_user})
        try {
            const data = JSON.parse(resultData)
            if(data.length === 1) {
                const Detail = data[0]
                setDetailFarmer(Detail)
            } else {
                setDetailFarmer(
                    <div className="detail">
                        {status === "ap" ? "บัญชีผ่านการตรวจสอบแล้ว" : "ไม่พบบัญชี"}
                    </div>
                )
            }
        } catch(e) {
            session()
        }
        setLoad(false)
    }

    const OpenListConvert = async (id_table) => {
        try {
            setLoadConvert(true)
            const context = await clientMo.post('/api/doctor/check')
            if(context) {
                setLoadConvert(false)
                setPopConvert(<SelectConvert RefPop={PopRefConvert} setPopup={setPopConvert} 
                        setProfile={setConvert} id_table={id_table} session={session}/>)
            } else session()
        } catch(e) {
            session()
        }
    }

    const CheckEmply = () => {
        const farmerID = RefOnType.FarmerID.current
        const pw = RefOnType.DoctorPw.current

        if(farmerID.value && pw.value) {
            RefOnType.ButtonRef.current.removeAttribute("not")
            return true
        }
        else {
            RefOnType.ButtonRef.current.setAttribute("not" , "")
            return false
        }
    }

    const ConfirmAppove = async () => {
        const check = CheckEmply()
        if(check) {
            const id_table_convert = ProfileConvert.id_table_convert
            const uid_line = DetailFarmer.uid_line

            const result = await clientMo.post("/api/doctor/farmer/appove/comfirm" , {
                id_table_convert : id_table_convert,
                id_table : DetailFarmer.id_table,
                uid_line : uid_line,
                password : RefOnType.DoctorPw.current.value,
                id_farmer : RefOnType.FarmerID.current.value
            })

            if(result === "113") {
                close()
                document.querySelector(`.list-some-farmer[item='${DetailFarmer.id_table}']`).style.opacity = "0"
                document.querySelector(`.list-some-farmer[item='${DetailFarmer.id_table}']`).style.visibility = "hidden"
                setTimeout(()=>{
                    Fecth(countLoad)
                } , 500)
            } else if (result === "password") {
                RefOnType.DoctorPw.current.setAttribute("placeholder" , "รหัสผ่านไม่ถูกต้อง")
                RefOnType.DoctorPw.current.value = ""
            } else session()

            CheckEmply()
        }
    }

    return(
        <div className="popup-manage">
            <div className="head-popup">ข้อมูลเกษตรกร</div>
            {
                status === "ap" ? 
                        result.length !== 1 ?
                        <div className="tab-content">
                        {
                            result.map((val , key)=>
                                <div className="tab-select-detail">{(key === 0) ? "ล่าสุด" : key + 1}</div>
                            )
                        }
                        </div> : <></>
                    :
                    <></>
            }
            <div className="detail-content" type={status} style={{
                padding : Load ? "0px" : ""
            }}>
                {
                    Load ? 
                        <div style={{
                            display : "flex",
                            justifyContent : "center",
                            alignItems : "center",
                            width : "100%",
                            height : "100%"
                        }}>
                            <Loading size={"10vw"} border={"1vw"} color="white" animetion={true}/>
                        </div>
                        : 
                    status === "ap" ? 
                    <>
                    </>
                    :
                    // detail farmer
                    <div className="detail-farmer">
                        <div className="img">
                            <img src={String.fromCharCode(...DetailFarmer.img.data)}></img>
                        </div>
                        <div className="text-detail">
                            <span>{"รหัสประจำตัวเกษตรกร : "}</span>
                            <div className="frame-text">
                                <input  onChange={CheckEmply} defaultValue={DetailFarmer.id_farmer} ref={RefOnType.FarmerID} placeholder="กรอกรหัสประจำตัว"></input>
                            </div>
                        </div>
                        <div className="text-detail">
                            <span>วันที่สมัคร :</span>
                            <div className="frame-text">
                                <DayJSX DATE={DetailFarmer.date_register} TYPE="small"/>
                                <TimeJSX DATE={DetailFarmer.date_register} MAX={false}/>
                            </div>
                        </div>
                        <div className="text-detail">
                            <span>{"ชื่อ - นามสกุล : "}</span>
                            <div className="frame-text">
                                {DetailFarmer.fullname}
                            </div>
                        </div>
                        <div className="text-detail">
                            <span>{"ที่อยู่ :"}</span>
                            <div>
                                <MapsJSX lat={DetailFarmer.location.x} lng={DetailFarmer.location.y} w={"100%"} h={"10%"}/>
                            </div>
                        </div>
                        <div className="convert-user">
                            <div>
                                <span>เชื่อมบัญชี</span>
                                <div className="bt-convert">
                                    { LoadConvert ? 
                                        <Loading size={25} border={4} color="#068863" animetion={true}/>
                                        : <></>
                                    }
                                    <button onClick={()=>OpenListConvert(DetailFarmer.id_table)}>ค้นหาบัญชี</button>
                                </div>
                            </div>
                            <div className="profile-preview">
                                {
                                    ProfileConvert.id_table_convert ?
                                        <div>
                                            <img src={ProfileConvert.img}></img>
                                        </div> : <></>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
            {
                status === "wt" ? 
                    <div className="action-account">
                        <div className="password">
                            <input  onChange={CheckEmply} type="password" ref={RefOnType.DoctorPw} placeholder="รหัสผ่านเจ้าหน้าที่"></input>
                        </div>
                        <div className="bt">
                            <button className="cancel" onClick={close}>ยกเลิก</button>
                            <button className="submit" onClick={ConfirmAppove} ref={RefOnType.ButtonRef} not="">ยืนยัน</button>
                        </div>
                    </div> : <></>
            }
            <PopupDom Ref={PopRefConvert} Body={PopupConvert}/>
        </div>
    )
}

export default ManagePopup