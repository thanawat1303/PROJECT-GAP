import React, { useEffect, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";

import "../../assets/style/page/doctor/Manage.scss"
const ManagePage = ({RefOnPage , id_table , type , setBecause}) => {
    const [LoadingStatus , setLoading] = useState(true)
    const [Profile , setProfile] = useState({})

    useEffect(()=>{
        RefOnPage.current.style.opacity = "1"
        RefOnPage.current.style.visibility = "visible"

        FecthProfile()
    })

    const FecthProfile = async () => {
        let profile = await clientMo.post("/api/admin/doctor/get" , {id_table : id_table})
        profile = JSON.parse(profile).map((val)=>val)[0]
        setProfile(profile)
    }

    const close = () => {
        RefOnPage.current.removeAttribute("style")
        setTimeout(()=>{
            setBecause(<></>)
        } , 500)
    }

    const OnLoad = () => {
        setLoading(false)
    }

    return (
        <div className="manage-page">
            <div className="detail-content">
                {LoadingStatus ? 
                    <div className="Loading">
                    
                    </div>
                    : <></>
                }
                <div onLoad={OnLoad} className="detail-doctor">

                </div>
            </div>
            <div className="bt-manage">
                <button onClick={close}>ยกเลิก</button>
                <button>ยืนยัน</button>
            </div>
        </div>
    )
}

export default ManagePage