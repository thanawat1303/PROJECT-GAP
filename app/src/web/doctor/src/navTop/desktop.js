import React, { useEffect, useRef, useState } from "react";
import Login from "../Login";
import SessionOut from "../sesionOut";
import { clientMo } from "../../../../assets/js/moduleClient";
import io from "socket.io-client"

import "../assets/style/NevTop/Desktop.scss"
import NavFirst from "../navFirst";
import { DayJSX, Loading, PopupDom, TimeDiff } from "../../../../assets/js/module";
import ProfilePage from "../page/profile/Profile";

const DesktopNev = ({setMain , socket = io() , setSession , setBody , eleImageCover , eleBody , setTextStatus , getProfile , FetchProfile}) => {
    const RefPopup = useRef()
    const RefMenu = useRef()
    const [BodyPopup , setBodyPopup] = useState(<></>)
    const [BodyMenu , setBodyMenu] = useState(false)
    const [Responsive , setResponsive] = useState(window.innerWidth)
    const [getFetchStart , setFetchStart] = useState(true)
    const [getStation , setStation] = useState(0)

    const [getNotifyContent , setNotifyContent] = useState(false)
    const [getNotifyCount , setNotifyCount] = useState(0)
    const [getNotifyList , setNotifyList] = useState([])
    const [getShowNotify , setShowNotify] = useState(false)
    
    useEffect(()=>{
        window.addEventListener("resize" , Resize)
        
        return(()=>{
            window.removeEventListener("resize" , Resize)
        })
    } , [])

    const NotifyConnect = async (id) => {
        if(getFetchStart) {
            await FetchNotify(0 , "count")
            setFetchStart(false)
        } else {
            SocketConnect(id)
        }
    }

    useEffect(()=>{
        socket.emit("disconnect_notify_doctor" , getStation)
        socket.removeListener("update")
        NotifyConnect(getNotifyList.length == 0 ? 0 : getNotifyList[0].id)
        return (()=>{
            socket.emit("disconnect_notify_doctor" , getStation)
            socket.removeListener("update")
        })
    } , [getNotifyList , getFetchStart , getNotifyContent])

    const SocketConnect = (id) => {
        socket.emit("connect_notify_doctor" , getStation)
        socket.on("update" ,()=>{
            FetchNotify(id , "update")
        })
    }

    const FetchNotify = async (id_focus , type) => {
        // function load notify
        // getNotifyContent check open popup notify
        const SelectDataOn = getNotifyContent ? type : "count"
        const notify = await clientMo.get(`/api/doctor/notify/get?type=${SelectDataOn}&id=${id_focus}`)
        if(notify) {
            const notifyData = JSON.parse(notify)
            setStation(notifyData.station)
            if(SelectDataOn === "start") {
                setNotifyList(notifyData.List)
                setNotifyCount(0)
            } else if (SelectDataOn === "update") {
                setNotifyList((prevent)=> [...notifyData.List , ...prevent])
                setNotifyCount(0)
            } else if (SelectDataOn === "get") {
                setNotifyList((prevent)=> [...prevent , ...notifyData.List])
            } else setNotifyCount(notifyData.countUn ? notifyData.countUn : 0)
            return notifyData.List
        } else setSession()
    }

    const Logout = (e) => {
        // e.target.parentElement.classList.toggle('hide')
        clientMo.LoadingPage()
        if(e) e.preventDefault()
        setTimeout(()=>{
            clientMo.get('/api/logout').then(()=>{
                setMain(<Login socket={socket} setMain={setMain} isClick={1}/>)
                clientMo.unLoadingPage()
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
        if(e) e.preventDefault()
        setBodyPopup(<ProfilePage RefPop={RefPopup} setPopup={setBodyPopup} session={setSession} returnToHome={Home} FetchProfileReload={FetchProfile} FetchNotify={FetchNotify}/>)
    }

    const Notify = (e) => {
        if(e) e.preventDefault()
        setNotifyContent(true)
    }

    const OpenMenuMobile = () => {
        setBodyMenu(true)
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
                    <div className="menu-content">
                        <a title="เมนู" href="/doctor" onClick={Home}>เมนู</a>
                    </div>
                    <div className="menu-content">
                        <a title="การแจ้งเตือน" href="/doctor" onClick={Notify} notify="">
                            การแจ้งเตือน
                            { getNotifyCount ?
                                <div notify="" className="count-notify">{getNotifyCount < 10 ? getNotifyCount : "9+"}</div>
                                : <></>
                            }
                        </a>
                        <div className="notify-content" show={getShowNotify ? "" : null}>
                            { getNotifyContent ?
                                <Notification session={setSession} setCount={setNotifyCount} setShow={setShowNotify} setContent={setNotifyContent} FetchNotifyData={()=>FetchNotify(0 , "start")} dataNotification={getNotifyList} FetchNotify={()=>FetchNotify(getNotifyList.length != 0 ? getNotifyList[getNotifyList.length - 1].id : 0 , "get")}/>
                                : <></>
                            }
                        </div>
                    </div>
                    <div className="menu-content">
                        <a title="โปรไฟล์" href="/doctor" onClick={Profile}>โปรไฟล์</a>
                    </div>
                    <div className="menu-content">
                        <a className="logout" onClick={Logout} title="ออกจากระบบ" href="/doctor/logout">ออกจากระบบ</a>
                    </div>
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
            { Responsive < 800 ?
                // <PopupDom Ref={RefMenu} Body={BodyMenu} zIndex={900} positionEdit={true}/>
                <div className="background-menu-mobile" ref={RefMenu}>
                    { BodyMenu ?
                        <MenuMobile RefMenu={RefMenu} Profile={getProfile} setBodyMenu={setBodyMenu} Click={{
                            HomeClick : Home,
                            ProfileClick : Profile,
                            LogoutClick : Logout
                        }} NotifyContent={{
                            getNotifyCount : getNotifyCount,
                            getNotifyList : getNotifyList
                        }} getNotifyContent={getNotifyContent} setNotifyContent={setNotifyContent} FetchNotify={FetchNotify} setCountNotify={setNotifyCount} session={setSession}/>
                        : <></>
                    }
                </div>
                : <></>
            }
        </section>
    )
}

const MenuMobile = ({RefMenu , setBodyMenu , Profile , 
Click = {
    HomeClick : null,
    ProfileClick : null,
    LogoutClick : null
} ,
NotifyContent = {
    getNotifyCount : 0,
    getNotifyList : []
} , getNotifyContent , setNotifyContent
, FetchNotify , setCountNotify , session}) => {

    const [ Menu , setMenu ] = useState(false)
    const [getShowNotify , setShowNotify] = useState(false)
    // const [getNotifyContent , setNotifyContent] = useState(false)

    useEffect(()=>{
        RefMenu.current.style.opacity = "1"
        RefMenu.current.style.visibility = "visible"
        setMenu(true)
        setNotifyContent(false)

        window.addEventListener("click" , CloseCheck)

        return(()=>{
            setNotifyContent(false)
            window.removeEventListener("click" , CloseCheck)
        })
    } , [])

    const CloseCheck = (e) => {
        if(e.target === RefMenu.current) {
            Close()
        }
    }

    const Notify = (e) => {
        if(e) e.preventDefault()
        setNotifyContent(true)
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
        setBodyMenu(false)
    }

    return(
        <section className="menu-mobile" style={{
            transform : `translateX(${Menu ? 0 : -100}%)`
        }}>
            <div className="content">
                <div className="frame-pg">
                    <div className="img">
                        <img src={Profile.img_doctor ? Profile.img_doctor : "/PROFILE.png"}></img>
                    </div>
                    <div className="fullname">
                        <div style={{
                            fontWeight : "900"
                        }} className="head-name">หมอพืช</div>
                        <div className="text-name">{Profile.fullname_doctor}</div>
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
                        <span>เมนู</span>
                    </div>
                    <div className="menu-name-list" notify="" onClick={Notify}>
                        <div notify="" className="notify-content" show={getShowNotify ? "" : null}>
                            { getNotifyContent ?
                                <Notification session={session} setCount={setCountNotify} setShow={setShowNotify} setContent={setNotifyContent} FetchNotifyData={()=>FetchNotify(0 , "start")} dataNotification={NotifyContent.getNotifyList} FetchNotify={()=>FetchNotify(NotifyContent.getNotifyList.length != 0 ? NotifyContent.getNotifyList[NotifyContent.getNotifyList.length - 1].id : 0 , "get")}/>
                                : <></>
                            }
                        </div>
                        <svg notify="" viewBox="0 0 25 25" fill="none">
                            <path d="M18.5904 8.59888C18.5904 7.00758 17.9582 5.48145 16.833 4.35624C15.7078 3.23102 14.1817 2.59888 12.5904 2.59888C10.9991 2.59888 9.47294 3.23102 8.34772 4.35624C7.2225 5.48145 6.59036 7.00758 6.59036 8.59888C6.59036 15.5989 3.59036 17.5989 3.59036 17.5989H21.5904C21.5904 17.5989 18.5904 15.5989 18.5904 8.59888Z" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14.3204 21.5989C14.1445 21.902 13.8922 22.1535 13.5886 22.3284C13.285 22.5033 12.9407 22.5953 12.5904 22.5953C12.24 22.5953 11.8957 22.5033 11.5921 22.3284C11.2885 22.1535 11.0362 21.902 10.8604 21.5989" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span notify="">การแจ้งเตือน</span>
                        {NotifyContent.getNotifyCount ? <div notify="" className="count-notify">{NotifyContent.getNotifyCount}</div> : <></>}
                    </div>
                    <div className="menu-name-list" onClick={()=>{
                        Click.ProfileClick()
                        Close()
                    }}>
                        <svg viewBox="0 0 26 22" fill="none">
                            <path d="M23.7206 0H2.15642C0.965895 0 0 1.04116 0 2.32445V19.3704C0 20.6537 0.965895 21.6949 2.15642 21.6949H23.7206C24.9111 21.6949 25.877 20.6537 25.877 19.3704V2.32445C25.877 1.04116 24.9111 0 23.7206 0ZM7.90686 4.6489C9.49273 4.6489 10.7821 6.03873 10.7821 7.74817C10.7821 9.45761 9.49273 10.8474 7.90686 10.8474C6.321 10.8474 5.03164 9.45761 5.03164 7.74817C5.03164 6.03873 6.321 4.6489 7.90686 4.6489ZM12.9385 16.1162C12.9385 16.6295 12.4892 17.046 11.9322 17.046H3.88155C3.32448 17.046 2.87522 16.6295 2.87522 16.1162V15.1864C2.87522 13.6465 4.22748 12.3971 5.89421 12.3971H6.11883C6.67142 12.6441 7.27341 12.7845 7.90686 12.7845C8.54031 12.7845 9.1468 12.6441 9.69489 12.3971H9.91952C11.5862 12.3971 12.9385 13.6465 12.9385 15.1864V16.1162ZM23.0018 13.5593C23.0018 13.7724 22.8401 13.9467 22.6424 13.9467H16.1731C15.9755 13.9467 15.8137 13.7724 15.8137 13.5593V12.7845C15.8137 12.5714 15.9755 12.3971 16.1731 12.3971H22.6424C22.8401 12.3971 23.0018 12.5714 23.0018 12.7845V13.5593ZM23.0018 10.46C23.0018 10.6731 22.8401 10.8474 22.6424 10.8474H16.1731C15.9755 10.8474 15.8137 10.6731 15.8137 10.46V9.68522C15.8137 9.47214 15.9755 9.29781 16.1731 9.29781H22.6424C22.8401 9.29781 23.0018 9.47214 23.0018 9.68522V10.46ZM23.0018 7.36077C23.0018 7.57384 22.8401 7.74817 22.6424 7.74817H16.1731C15.9755 7.74817 15.8137 7.57384 15.8137 7.36077V6.58595C15.8137 6.37287 15.9755 6.19854 16.1731 6.19854H22.6424C22.8401 6.19854 23.0018 6.37287 23.0018 6.58595V7.36077Z" fill="#22C7A9"/>
                        </svg>
                        <span>โปรไฟล์</span>
                    </div>
                </div>
            </div>
            <div className="content bottom">
                <div className="menu-list" style={{
                        marginTop : "0"
                    }} >
                    <div className="menu-name-list" onClick={()=>{
                        Click.LogoutClick()
                        // Close()
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

const Notification = ({setShow , setContent , dataNotification , FetchNotifyData , FetchNotify , setCount , session}) => {
    const [getLoadGet , setLoadGet] = useState(true)
    const [getListNew , setListNew] = useState([0])
    const [getWaitContent , setWaitContent] = useState("w")

    useEffect(()=>{
        window.addEventListener("click" , Close)
        LoadContent()
        setShow(true)

        return(()=>{
            window.removeEventListener("click" , Close)
        })
    } , [])

    const LoadContent = async () => {
        setWaitContent(await FetchNotifyData())
    }

    const Close = (e) => {
        if(e.target.getAttribute("notify") == null) {
            setShow(false)
            setTimeout(()=>{
                setContent(false)
            } , 500)
        }
    }

    const LoadGet = async (e = document.getElementById()) => {
        // console.log(parseInt(e.target.scrollHeight) , parseInt(e.target.scrollTop + e.target.clientHeight) + 1)
        if(parseInt(e.target.scrollHeight) == parseInt(e.target.scrollTop + e.target.clientHeight) + 1 && getLoadGet && getListNew.length != 0) {
            setLoadGet(false)
            setListNew(await FetchNotify())
            setLoadGet(true)
        }
    }

    // const ReadNotify = async () => {
    //     // function read notify and setCount un read
    //     const result = await clientMo.post("/api/doctor/notify/read" , {id_notify : dataNotification[0].id})
    //     if(result) {
    //         setCount(0)
    //     } else session()
    // }

    return(
        <section className="body-notification" notify="" onScroll={LoadGet}>
            <div className="list-notification" notify="">
                { 
                getWaitContent != "w" ?
                    dataNotification.length ?
                        dataNotification.map(val=>
                            <div className="content-notification" key={val.id} notify="">
                                <div className="box-left" notify="">
                                    <img notify="" src={val.img_farmer}></img>
                                </div>
                                <div className="box-right" notify="">
                                    <div className="subject" notify="">
                                        {val.notify}
                                    </div>
                                    <div className="date" notify="">
                                        <TimeDiff DATE={val.date}/>
                                    </div>
                                </div>
                            </div>
                        ) 
                    : <div>ไม่มีการแจ้งเตือน</div>
                : <Loading size={30} MaxSize={30} border={8} color="#22C7A9" animetion={true}/>
                }
            </div>
        </section>
    )
}

export default DesktopNev