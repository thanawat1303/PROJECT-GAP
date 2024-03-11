import React , {useEffect, useRef, useState} from "react";
import { clientMo } from "../../../assets/js/moduleClient";
import Login from "./Login";

import NavFirst from "./navFirst";

import "./assets/style/adminMain.scss"

import DesktopNev from "./navTop/desktop";
import SessionOut from "./sesionOut";
import PageTemplate from "./page/PageTemplate";
import { HrefData, TabLoad } from "../../../assets/js/module";

const Admin = ({setBodyFileMain , socket}) => {
    const [body , setBody] = useState(<div></div>)
    const [TabMenuTop , setTabMenu] = useState(<></>)
    const [session , setSession] = useState(<div></div>)
    const [TextPage , setTextPage] = useState([])

    const ImageCover = useRef()
    const BodyRef = useRef()
    const Tabbar = useRef()

    const sessionRef = useRef()

    const TabOn = new TabLoad(Tabbar)
    const Href = new HrefData("HOME") 

    const [Responsive , setResponsive] = useState(window.innerWidth)

    useEffect(()=>{

        ChkPath("")
        setTabMenu(<DesktopNev setBodyFileMain={setBodyFileMain} setBodyFileAdmin={setBody} socket={socket} 
                        auth={Auth} modify={modifyMainPage} TabOn={TabOn} HrefData={Href}/>)
        
        window.addEventListener("popstate" , ChkPath)
        window.addEventListener("resize" , Resize)
        return() => {
            window.removeEventListener("popstate" , ChkPath)
            window.removeEventListener("resize" , Resize)
        }
    } , [])

    const ChkPath = async (e) => {
        if(await Auth(true)) method(e)
    }

    const method = (e) => {
        let path = window.location.href.replace(window.location.origin , "").split("/").filter(val=>(val))
        const type = e ? "=pop" : ''
        if(path.length === 1 && path[0] === "admin") 
            setBody(<NavFirst session={sessionoff} setBodyFileAdmin={setBody} auth={Auth} socket={socket} modify={modifyMainPage} TabOn={TabOn} HrefData={Href}/>)
        else if(path.length >= 2 && path[0] === "admin") {

            let seconPath = path[1].split("?")

            if(seconPath[0] === "list"){
                let query = seconPath[1]
                if(query.indexOf("default") == 0) {
                    Href.set(`list?default${type}`)
                    setBody(<PageTemplate session={sessionoff} TabOn={TabOn} socket={socket} modify={modifyMainPage} auth={Auth} HrefData={Href}/>)
                } 
                else if (query.indexOf("delete") == 0) {
                    Href.set(`list?delete${type}`)
                    setBody(<PageTemplate session={sessionoff} TabOn={TabOn} socket={socket} modify={modifyMainPage} auth={Auth} HrefData={Href}/>)
                }
            }

            else if(seconPath[0] === "data"){
                let query = seconPath[1]
                if(query.indexOf("plant") == 0) {
                    Href.set(`data?plant${type}`)
                    setBody(<PageTemplate session={sessionoff} TabOn={TabOn} socket={socket} modify={modifyMainPage} auth={Auth} HrefData={Href}/>)
                } 
                else if (query.indexOf("station") == 0) {
                    Href.set(`data?station${type}`)
                    setBody(<PageTemplate session={sessionoff} TabOn={TabOn} socket={socket} modify={modifyMainPage} auth={Auth} HrefData={Href}/>)
                }
            }
            
            // other path
        } else {
            setBody(<NavFirst session={sessionoff} setBodyFileAdmin={setBody} auth={Auth} socket={socket} modify={modifyMainPage} TabOn={TabOn} HrefData={Href}/>)
        }
    }

    const Auth = async (tebLoadOn = false) => {
        if(tebLoadOn) TabOn.start()
        const result = await clientMo.post('/api/admin/check')
        if(result) return true;
        else sessionoff()
    }

    const sessionoff = (type = false) => {
        if(type) {
            setBodyFileMain(<Login setBodyFileMain={setBodyFileMain} socket={socket}/>)
        } else {
            setSession(<SessionOut setBodyFileMain={setBodyFileMain} sessionEle={sessionRef}/>)
        }
    } 

    const modifyMainPage = (heigthBody , heightCover , ArrtextPage = new Array) => {
        setTextPage(ArrtextPage.filter((val)=>val != ""))
        ImageCover.current.style.height = `${heightCover}%`
        BodyRef.current.style.height = `${heigthBody}%`
    }

    const Resize = () => {
        setResponsive(window.innerWidth)
    }

    return (
        <div onLoad={
        // ()=>{
        //     if(getLoad) {
        //         clientMo.unLoadingPage()
        //         setLoad(false)
        //     }
        // }
        clientMo.unLoadingPage
    } className="admin" 
        // onMouseDown={this.hidePopUp} onContextMenu={this.hidePopUp}
        >
            {TabMenuTop}
            <div className="status-loadPage">
                <div ref={Tabbar} className="tab-load"></div>
            </div>
            <section ref={ImageCover} className="image-cover">
                { Responsive > 800 ?
                    <>
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
                    </> :
                    <>
                    <div className="text-icon-cover">
                        <div className="text">
                            <span>ยินดีต้อนรับ</span>
                            <span style={{fontWeight : 900}}>ผู้ดูแลระบบ</span>
                        </div>
                    </div>
                    <div className="frame-image-cover">
                        <img src="/ดอย.jpg"></img>
                    </div>
                    </>
                }
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