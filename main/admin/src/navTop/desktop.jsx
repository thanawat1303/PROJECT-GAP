import React, { useEffect } from "react";
import Login from "../Login";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import "../assets/style/NevTop/Desktop.scss"
import NavFirst from "../navFirst";

const DesktopNev = ({setBodyFileMain , socket , setSession , setBodyFileAdmin , modify}) => {
    useEffect(()=>{
        
    } , [])

    const Logout = (e) => {
        clientMo.LoadingPage()
        if(e) e.preventDefault()
        setTimeout(()=>{
            clientMo.get('/api/logout').then(()=>{
                setBodyFileMain(<Login socket={socket} setBodyFileMain={setBodyFileMain} state={true}/>)
                clientMo.unLoadingPage()
            })
        } , 2000)
    }

    const Home = (e) => {
        e.preventDefault()
        clientMo.post('/api/admin/check').then((context)=>{
            if(context) 
                setBodyFileAdmin(<NavFirst setBodyFileAdmin={setBodyFileAdmin} setSession={setSession} socket={socket} modify={modify} type={1}/>)
            else setSession()
        })
    }

    return(
        <section className="tab-bar-desktop">
            <span className="pg-action">
                <a onClick={Home} className="Logo" href="/admin" title="หมอพืช">
                    <img src="/logo2.png"></img>
                    <span>Admin</span>
                </a>
            </span>
            <span className="bt-action">
                <a onClick={Home} title="หน้าแรก" href="/admin">หน้าแรก</a>
                <a title="เมนู" href="/admin">เมนู</a>
                <a title="การแจ้งเตือน" href="/admin">การแจ้งเตือน</a>
                <a title="โปรไฟล์" href="/admin">โปรไฟล์</a>
                <a className="logout" onClick={Logout} title="ออกจากระบบ" href="/admin/logout">ออกจากระบบ</a>
            </span>
        </section>
    )
}

export default DesktopNev