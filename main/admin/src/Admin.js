import React , {useEffect, useRef, useState} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";
import Login from "./Login";

import NavFirst from "./navFirst";

import "./assets/style/adminMain.scss"

import DesktopNev from "./navTop/desktop";
import SessionOut from "./sesionOut";
import PageManageDoctor from "./page/doctor/PageManageDoctor";
import { TabLoad } from "../../../src/assets/js/module";

const Admin = ({setBodyFileMain , socket , type = 0}) => {
    const [body , setBody] = useState(<div></div>)
    const [TabMenuTop , setTabMenu] = useState(<></>)
    const [session , setSession] = useState(<div></div>)
    const [TextPage , setTextPage] = useState([])

    const ImageCover = useRef()
    const BodyRef = useRef()
    const Tabbar = useRef()

    const sessionRef = useRef()

    const TabOn = new TabLoad(Tabbar)

    useEffect(()=>{
        ChkPath()
        setTabMenu(<DesktopNev setBodyFileMain={setBodyFileMain} socket={socket} setSession={sessionoff} setBodyFileAdmin={setBody} modify={modifyMainPage} TabOn={TabOn}/>)
        window.addEventListener("popstate" , ChkPath)

        return() => {
            window.removeEventListener("popstate" , ChkPath)
        }
    } , [])

    const modifyMainPage = (heigthBody , heightCover , ArrtextPage) => {
        setTextPage(ArrtextPage)
        ImageCover.current.style.height = `${heightCover}%`
        BodyRef.current.style.height = `${heigthBody}%`
    }


    const ChkPath = () => {
        clientMo.post('/api/admin/check').then((context)=>{
            if(context) {
                let path = window.location.href.replace(window.location.origin , "").split("/").filter(val=>(val))

                if(path.length === 1 && path[0] === "admin") 
                    setBody(<NavFirst setBodyFileAdmin={setBody} setSession={sessionoff} socket={socket} modify={modifyMainPage} TabOn={TabOn}/>)
                else if(path.length >= 2 && path[0] === "admin") {

                    let seconPath = path[1].split("?")

                    if(seconPath[0] === "list"){
                        let query = seconPath[1]
                        if(query.indexOf("default") == 0) 
                            setBody(<PageManageDoctor TabOn={TabOn} socket={socket} modify={modifyMainPage} setSession={sessionoff}/>)
                        else if (query.indexOf("delete") == 0) 
                            setBody(<PageManageDoctor TabOn={TabOn} socket={socket} modify={modifyMainPage} setSession={sessionoff} statusStart="delete"/>)
                    }
                    
                    // other path
                } else {
                    console.log(15)
                }
            }
            else sessionoff()
        })
    }

    const sessionoff = (type = false) => {
        if(type) {
            setBodyFileMain(<Login setBodyFileMain={setBodyFileMain} socket={socket}/>)
        } else {
            setSession(<SessionOut setBodyFileMain={setBodyFileMain} sessionEle={sessionRef}/>)
        }
    } 

    const LoadingPage = () => {
        clientMo.unLoadingPage()
    }

    return (
        <div onLoad={LoadingPage} className="admin" 
        // onMouseDown={this.hidePopUp} onContextMenu={this.hidePopUp}
        >
            {TabMenuTop}
            <div className="status-loadPage">
                <div ref={Tabbar} className="tab-load"></div>
            </div>
            <section ref={ImageCover} className="image-cover">
                <div className="text-cover">
                    <div className="icon">
                        <span>ยินดีต้อนรับ</span>
                        <img src="/Logo-white.png"></img>
                    </div>
                    <div className="status">
                        {TextPage.map((val , index)=>(
                            <div className="box-status" key={index}>
                                <span>{val}</span>
                                {TextPage.length - 1 > index ? <img src={"/arrow.png"}></img> : <></>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="frame">
                    <img src="/ดอย.jpg"></img>
                </div>
            </section>
            <section ref={BodyRef} className="container-body-admin">
                <bot-main>
                    <bot-content>
                        {body}
                    </bot-content>
                </bot-main>
            </section>
            {/* feedBack */}
            <section ref={sessionRef} id="session">
                {session}
            </section>
        </div>
    )
}

export default Admin