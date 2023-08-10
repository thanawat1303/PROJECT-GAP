import React, { useEffect, useRef, useState } from "react";
import Login from "../Login";
import SessionOut from "../sesionOut";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import "../assets/style/NevTop/Desktop.scss"
import NavFirst from "../navFirst";
import { PopupDom } from "../../../../src/assets/js/module";
import ProfilePage from "../page/profile/Profile";

const DesktopNev = ({setMain , socket , setSession , setBody , eleImageCover , eleBody , setTextStatus}) => {
    const RefPopup = useRef()
    const RefMenu = useRef()
    const [BodyPopup , setBodyPopup] = useState(<></>)
    const [BodyMenu , setBodyMenu] = useState(<></>)
    const [Responsive , setResponsive] = useState(window.innerWidth)
    
    useEffect(()=>{
        window.addEventListener("resize" , Resize)
        
        return(()=>{
            window.removeEventListener("resize" , Resize)
        })
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
        if(e) e.preventDefault()
        clientMo.post('/api/doctor/check').then((context)=>{
            if(context) 
                setBody(<NavFirst setMain={setMain} socket={socket} setdoctor={setBody} setSession={setSession} type={1} eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus}/>)
            else setSession()
        })
    }

    const Profile = (e) => {
        e.preventDefault()
        setBodyPopup(<ProfilePage RefPop={RefPopup} setPopup={setBodyPopup} session={setSession} returnToHome={Home}/>)
    }

    const OpenMenuMobile = () => {
        setBodyMenu(<MenuMobile RefMenu={RefMenu} setBodyMenu={setBodyMenu} ClickHome={Home}/>)
    }

    const Resize = () => {
        setResponsive(window.innerWidth)
    }

    return(
        <section className="tab-bar-desktop" style={
            Responsive > 800 ? {} :
            {
                padding : "6px 6px"
            }
        }>
            { Responsive > 800 ?
                <>
                <span className="pg-action">
                    <a onClick={Home} className="Logo" href="/doctor" title="หมอพืช">
                        <img src="/logo2.png"></img>
                        <span>หมอพืช</span>
                    </a>
                </span>
                <span className="bt-action">
                    {/* <a title="หน้าแรก" href="/doctor">หน้าแรก</a> */}
                    <a title="เมนู" href="/doctor">เมนู</a>
                    <a title="การแจ้งเตือน" href="/doctor">การแจ้งเตือน</a>
                    <a title="โปรไฟล์" href="/doctor" onClick={Profile}>โปรไฟล์</a>
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
                </>
                :
                <span className="pg-action">
                    <div className="icon-nev-menu" onClick={OpenMenuMobile}>
                        <svg viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="45" height="4.73529" rx="2.36765" fill="#8BFFEA"/>
                            <rect y="9.47058" width="45" height="4.05882" rx="2.02941" fill="#8BFFEA"/>
                            <rect y="18.2646" width="29.7" height="4.73529" rx="2.36765" fill="#8BFFEA"/>
                        </svg>
                    </div>
                </span>
            }
            <PopupDom Ref={RefPopup} Body={BodyPopup} zIndex={999}/>
            <PopupDom Ref={RefMenu} Body={BodyMenu} zIndex={900} positionEdit={true}/>
        </section>
    )
}

const MenuMobile = ({RefMenu , setBodyMenu , ClickHome}) => {

    const [ Menu , setMenu ] = useState(false)

    useEffect(()=>{
        RefMenu.current.style.opacity = "1"
        RefMenu.current.style.visibility = "visible"
        setMenu(true)

        window.addEventListener("click" , CloseCheck)

        return(()=>{
            window.removeEventListener("click" , CloseCheck)
        })
    } , [])

    const CloseCheck = (e) => {
        console.log(e.target === RefMenu.current)
        if(e.target === RefMenu.current) {
            Close()
        }
    }

    const Close = async () => {
        setMenu(false)
        await new Promise((resole , reject)=>{
            setTimeout(()=>{
                RefMenu.current.style.opacity = "0"
                RefMenu.current.style.visibility = "hidden"
                resole("")
            } , 500)
        })
        setBodyMenu(<></>)
    }

    return(
        <section className="menu-mobile" style={{
            transform : `translateX(${Menu ? 0 : -100}%)`
        }}>
            <div className="frame-pg">
                <span className="pg-action" onClick={Close}>
                    <div className="icon-nev-menu">
                        <svg viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="45" height="4.73529" rx="2.36765" fill="#8BFFEA"/>
                            <rect y="9.47058" width="45" height="4.05882" rx="2.02941" fill="#8BFFEA"/>
                            <rect y="18.2646" width="29.7" height="4.73529" rx="2.36765" fill="#8BFFEA"/>
                        </svg>
                    </div>
                </span>
            </div>
            <div className="menu-list">
                <div className="top">
                    <div className="menu-name-list" onClick={ClickHome}>เมนู</div>
                    <div className="menu-name-list">การแจ้งเตือน</div>
                    <div className="menu-name-list">โปรไฟล์</div>
                </div>
            </div>
        </section>
    )
}

export default DesktopNev