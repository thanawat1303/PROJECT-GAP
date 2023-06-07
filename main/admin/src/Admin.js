import React , {useEffect, useRef, useState} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";
import Login from "./Login";

import NavFirst from "./navFirst";

import "./assets/style/adminMain.scss"

import DesktopNev from "./navTop/desktop";
import SessionOut from "./sesionOut";

const Admin = ({setBodyFileMain , socket , type = 0}) => {
    const [body , setBody] = useState(<div></div>)
    const [session , setSession] = useState(<div></div>)
    const [TextPage , setTextPage] = useState([])

    const ImageCover = useRef()
    const BodyRef = useRef()

    const sessionRef = useRef()

    useEffect(()=>{
        ChkPath()
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
                    setBody(<NavFirst setBodyFileAdmin={setBody} setSession={sessionoff} socket={socket} modify={modifyMainPage}/>)
                else if(path.length >= 2 && path[0] === "admin") {
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
            <DesktopNev setBodyFileMain={setBodyFileMain} socket={socket} setSession={sessionoff} setBodyFileAdmin={setBody} modify={modifyMainPage}/>
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