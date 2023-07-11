import React, { useEffect } from "react";
import Login from "../Login";
import SessionOut from "../sesionOut";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import "../assets/style/NevTop/Desktop.scss"
import NavFirst from "../navFirst";

const DesktopNev = ({setMain , socket , setSession , setBody , eleImageCover , eleBody , setTextStatus}) => {
    useEffect(()=>{
        
    } , [])

    const Logout = (e) => {
        // e.target.parentElement.classList.toggle('hide')
        clientMo.rmAction('#loading' , 'hide' , 0)
        if(e) e.preventDefault()
        setTimeout(()=>{
            clientMo.get('/api/logout').then(()=>{
                setMain(<Login socket={socket} setMain={setMain} isClick={1}/>)
                clientMo.addAction('#loading' , 'hide' , 1500)
            })
        } , 2000)
    }

    const Home = (e) => {
        e.preventDefault()
        clientMo.post('/api/doctor/check').then((context)=>{
            if(context) 
                setBody(<NavFirst setMain={setMain} socket={socket} setdoctor={setBody} setSession={setSession} type={1} eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus}/>)
            else setSession()
        })
    }

    return(
        <section className="tab-bar-desktop">
            <span className="pg-action">
                <a onClick={Home} className="Logo" href="/doctor" title="หมอพืช">
                    <img src="/logo2.png"></img>
                    <span>หมอพืช</span>
                </a>
            </span>
            <span className="bt-action">
                <a title="หน้าแรก" href="/doctor">หน้าแรก</a>
                <a title="เมนู" href="/doctor">เมนู</a>
                <a title="การแจ้งเตือน" href="/doctor">การแจ้งเตือน</a>
                <a title="โปรไฟล์" href="/doctor">โปรไฟล์</a>
                <a className="logout" onClick={Logout} title="ออกจากระบบ" href="/doctor/logout">ออกจากระบบ</a>
                {/* <a className="alarm">
                    <img src="/alarm-svgrepo-com.svg"></img>
                </a>
                <section className="profile">
                    <a className="profile-icon">
                        <img id="icon" src="/profile-svgrepo-com-white.svg"></img>
                    </a>
                    <div id="profile-otion">
                        <a id="account-profile">
                            ข้อมูลส่วนตัว
                        </a>
                        <a onClick={Logout} id="logout">
                            ออกจากระบบ
                        </a>
                    </div>
                </section> */}
            </span>
        </section>
    )
}

export default DesktopNev