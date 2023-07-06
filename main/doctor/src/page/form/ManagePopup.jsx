import React, { useEffect, useState } from "react"
import { clientMo } from "../../../../../src/assets/js/moduleClient"
import "../../assets/style/page/form/ManagePopup.scss"

const ManagePopup = ({setPopup , RefPop , id_form , status , session , countLoad , Fecth , RefData}) => {
    const [Content , setContent] = useState(<></>)
    
    useEffect(()=>{
        RefPop.current.style.opacity = "1"
        RefPop.current.style.visibility = "visible"
        FetchContent(0)
    })

    const FetchContent = async (type_form) => {
        const Data = await clientMo.get(`/api/doctor/form/get/detail?id_form=${id_form}&type=${type_form}`)
        console.log(Data)
    }

    const close = () => {
        RefPop.current.style.opacity = "0"
        RefPop.current.style.visibility = "hidden"
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    return (
        <div className="content-detail-form">
            <div className="close" onClick={close}>
                <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                </svg>
            </div>
            <div className="menu-content">
                <div>ข้อมูลพื้นฐาน</div>
                <div>ปัจจัยการผลิต</div>
                <div>สารเคมี</div>
                <div>ส่วนเจ้าหน้าที่</div>
            </div>
            <div className="content-detail">
                {Content}
            </div>
        </div>
    )
}

export default ManagePopup