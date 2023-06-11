import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import '../../assets/style/page/doctor/PageManageDoctor.scss'
import ListDoctor from "./ListDoctor";
const PageManageDoctor = ({socket , addHref = false , statusStart = "default" , modify , setSession , TabOn}) => {
    const [StatusPage , setStatus] = useState({
        status : statusStart,
        changePath : addHref
    }) 

    const PageAddRef = useRef()

    useEffect(()=>{
        modify(70 , 30 , ["หน้าแรก" , "บัญชีเจ้าหน้าที่ส่งเสริม"])

        TabOn.addTimeOut(TabOn.end())

        window.addEventListener("popstate" , popstate)
        return() => {
            window.removeEventListener("popstate" , popstate)
        }
     } , [])

    const popstate = () => {
        if(window.history.state != null) {
            setStatus({
                status : window.history.state.status, //ใช้ภายในหน้าได้
                changePath : false
            })
        }
    }

    const ChangeStatus = (statusClick) => {
        if(statusClick != StatusPage.status) {
            setStatus({
                status : statusClick,
                changePath : true
            })
        }
    }

    return (
        <section className="page-manage-doctor-account">
            <div className="menu-page">
                {StatusPage.status === "default" ?
                <div className="bt-add-doctor">
                    <svg onClick={()=>PageAddRef.current.toggleAttribute("show")} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2A14.172 14.172 0 0 0 2 16a14.172 14.172 0 0 0 14 14a14.172 14.172 0 0 0 14-14A14.172 14.172 0 0 0 16 2Zm8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z"/><path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7v2z"/></svg>
                </div>
                : <></>
                }
                {StatusPage.status === "default" ? 
                    <button className="use" onClick={()=>ChangeStatus("delete")}>แสดงบัญชีที่ถูกลบ</button> : 
                    <button className="delete" onClick={()=>ChangeStatus("default")}>แสดงบัญชีที่ยังไม่ถูกลบ</button>
                }
                <div className="search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                            <path d="m11.25 11.25l3 3"/><circle cx="7.5" cy="7.5" r="4.75"/>
                        </g>
                    </svg>
                    <input type="text" placeholder="Search"></input>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
                        <path fill="currentColor" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4l-1.6 1.6z"/>
                    </svg>
                </div>
            </div>
            <div className="list-doctor">
                <ListDoctor status={StatusPage} PageAddRef={PageAddRef}/>
            </div>
        </section>
    )
}

export default PageManageDoctor