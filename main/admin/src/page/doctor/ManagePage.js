import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";

import "../../assets/style/page/doctor/Manage.scss"
import { Loading } from "../../../../../src/assets/js/module";
const ManagePage = ({RefOnPage , id_table , type , status , setBecause}) => {
    const [LoadingStatus , setLoading] = useState(true)

    const [ScreenW , setScreenW] = useState(window.innerWidth)
    const [ScreenH , setScreenH] = useState(window.innerHeight)

    const BecauseRef = useRef()
    const PasswordRef = useRef()

    const [Profile , setProfile] = useState({
        id_table : "", 
        id : "" ,
        fullname : "",
        img : "",
        station : "",
        isdelete : false
    })

    useEffect(()=>{
        RefOnPage.current.style.opacity = "1"
        RefOnPage.current.style.visibility = "visible"

        window.addEventListener("resize" , setSizeScreen)

        FecthProfile()

        return()=>{
            window.removeEventListener("resize" , setSizeScreen)
        }
    } , [])

    const FecthProfile = async () => {
        let profile = await clientMo.post("/api/admin/doctor/get" , {id_table : id_table})
        profile = JSON.parse(profile).map((val)=>val)[0]
        const img = Uint32Array.from(profile.img_doctor.data).toString()
        setProfile({
            id_table : profile.id_table_doctor,
            id : profile.id_doctor,
            fullname : profile.fullname_doctor,
            img :  img !== "" ? img : "/doctor-svgrepo-com.svg",
            station : profile.station,
            isdelete : profile.status_delete
        })
    }

    const close = () => {
        RefOnPage.current.removeAttribute("style")
        window.removeEventListener("resize" , setSizeScreen)
        setTimeout(()=>{
            setBecause(<></>)
        } , 500)
    }

    const OnLoad = () => {
        setLoading(false)
    }

    const setSizeScreen = (e) => {
        console.log(e)
        setScreenW(window.innerWidth)
        setScreenH(window.innerHeight)
    }

    const Submit = () => {
        if(BecauseRef.current.value && PasswordRef.current.value) {
            console.log(type)
        }
    }

    return (
        <div className="manage-page">
            <div className="head-page">
                {type === "status_account" ? status ? "เหตุผลการปิดบัญชี" : "เหตุผลการเปิดบัญชี" : "เหตุผลการลบบัญชี"}
            </div>
            <div className="detail-content">
                {LoadingStatus ? 
                    <div className="Loading">
                        <Loading size={4/100 * ScreenW >= 41 ? 4/100 * ScreenW : 41} border={0.5/100 * ScreenW >= 5 ? 0.5/100 * ScreenW : 5} color="#1CFFF1" animetion={LoadingStatus}/>
                        <span>กำลังโหลดข้อมูลผู้ส่งเสริม</span>
                    </div>
                    : <></>
                }
                <div onLoad={OnLoad} className="detail-doctor">
                    <div className="img">
                        <img src={Profile.img}></img>
                    </div>
                    <div className="detail-text">
                        <div className="text-preview fullname">
                            <input value={Profile.fullname ? Profile.fullname : "เจ้าหน้าที่ส่งเสริมยังไม่ทำการระบุชื่อ"} readOnly></input>
                        </div>
                        <div className="text-preview">
                            <span className="head-data id">รหัสประจำตัว</span>
                            <span className="dot">:</span>
                            <input value={Profile.id} readOnly></input>
                        </div>
                        <div className="text-preview">
                            <span className="head-data">ศูนย์</span> 
                            <span className="dot">:</span>
                            <input value={Profile.station ? Profile.station : "เจ้าหน้าที่ส่งเสริมยังไม่ระบุ"} readOnly></input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-manage">
                <label className="column">
                    <span>เหตุผล</span>
                    <textarea ref={BecauseRef} className="input-text" style={{
                        width : `${22.786/100 * ScreenW >= 175 ? 22.786/100 * ScreenW : 175}px`,
                        height : `${8.463/100 * ScreenW >= 60 ? 8.463/100 * ScreenW : 60}px`
                    }}></textarea>
                </label>
                <label>
                    <span>รหัสผ่านผู้ดูแล</span>
                    <input ref={PasswordRef} type="password" className="input-text"></input>
                </label>
                <div className="bt-manage">
                    <button onClick={close} className="close">ยกเลิก</button>
                    <button onClick={Submit} className="submit">ยืนยัน</button>
                </div>
            </div>
        </div>
    )
}

export default ManagePage