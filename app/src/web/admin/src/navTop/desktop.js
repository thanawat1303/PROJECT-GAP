import React, { useEffect, useRef, useState } from "react";
import Login from "../Login";
import { clientMo } from "../../../../assets/js/moduleClient";

import "../assets/style/NevTop/Desktop.scss"
import NavFirst from "../navFirst";
import { PopupDom } from "../../../../assets/js/module";

const DesktopNev = ({setBodyFileMain , socket , auth , setBodyFileAdmin , modify , TabOn , HrefData}) => {
    let selectPage = true
    const RefMenu = useRef()
    const [BodyMenu , setBodyMenu] = useState(<></>)
    const [Responsive , setResponsive] = useState(window.innerWidth)

    useEffect(()=>{
        window.addEventListener("resize" , Resize)
        
        return(()=>{
            window.removeEventListener("resize" , Resize)
        })
    } , [])

    const Logout = (e) => {
        clientMo.LoadingPage()
        if(e) e.preventDefault()
        clientMo.get('/api/logout').then(()=>{
            setTimeout(()=>{
                setBodyFileMain(<Login socket={socket} setBodyFileMain={setBodyFileMain} state={true}/>)
            } , 2000)
        })
    }

    const clickMenu = async (e , OpenPage) => {
        if(e) e.preventDefault()
        const result = await auth(true)
        if(result) {
            if(OpenPage === "HOME") navOpen()
        }
    }

    const navOpen = () => {
        selectPage = !selectPage
        setBodyFileAdmin(<NavFirst setBodyFileAdmin={setBodyFileAdmin} socket={socket} auth={auth} modify={modify} type={1} 
                            TabOn={TabOn} selectPage={selectPage} HrefData={HrefData}/>)
    }

    const OpenMenuMobile = () => {
        setBodyMenu(<MenuMobile RefMenu={RefMenu} setBodyMenu={setBodyMenu} Click={{
            HomeClick : ()=>clickMenu("" , "HOME"),
            LogoutClick : Logout
        }}/>)
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
                    <a onClick={(e)=>clickMenu(e , "HOME")} className="Logo" href="/admin" title="หมอพืช">
                        <img src="/logo2.png"></img>
                        <span>Admin</span>
                    </a>
                </span>
                <span className="bt-action">
                    {/* <a onClick={(e)=>clickMenu(e , "HOME")} title="หน้าแรก" href="/admin">หน้าแรก</a> */}
                    <a onClick={(e)=>clickMenu(e , "HOME")} title="หน้าแรก" href="/admin">หน้าแรก</a>
                    {/* <a title="การแจ้งเตือน" href="/admin">การแจ้งเตือน</a>
                    <a title="โปรไฟล์" href="/admin">โปรไฟล์</a> */}
                    <a className="logout" onClick={Logout} title="ออกจากระบบ" href="/admin/logout">ออกจากระบบ</a>
                </span>
                </> :
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
            { Responsive < 800 ?
                <PopupDom Ref={RefMenu} Body={BodyMenu} zIndex={900} positionEdit={true}/>
                : <></>
            }
        </section>
    )
}

const MenuMobile = ({RefMenu , setBodyMenu , Profile , Click = {
    HomeClick : null,
    LogoutClick : null
}}) => {

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
            <div className="content">
                <div className="frame-pg">
                    <div className="img">
                        <img src={"/logo2.png"}></img>
                    </div>
                    <div className="fullname">
                        <div style={{
                            fontWeight : "900"
                        }} className="head-name">ผู้ดูแลระบบ</div>
                    </div>
                </div>
                <div className="menu-list">
                    <div className="menu-name-list" onClick={()=>{
                        Click.HomeClick()
                        Close()
                    }}>
                        <svg viewBox="0 0 25 25" fill="none">
                            <path d="M3.0802 9.15381L12.0802 2.15381L21.0802 9.15381V20.1538C21.0802 20.6842 20.8695 21.1929 20.4944 21.568C20.1193 21.9431 19.6106 22.1538 19.0802 22.1538H5.0802C4.54977 22.1538 4.04106 21.9431 3.66599 21.568C3.29091 21.1929 3.0802 20.6842 3.0802 20.1538V9.15381Z" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.0802 22.1538V12.1538H15.0802V22.1538" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>หน้าแรก</span>
                    </div>
                </div>
            </div>
            <div className="content bottom">
                <div className="menu-list">
                    <div className="menu-name-list" onClick={()=>{
                        Click.LogoutClick()
                        Close()
                    }}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 17L21 12L16 7" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 12H9" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>ออกจากระบบ</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DesktopNev