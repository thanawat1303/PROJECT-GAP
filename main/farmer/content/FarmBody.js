import React, { useEffect, useRef, useState } from "react";

import { clientMo } from "../../../src/assets/js/moduleClient";
import "../assets/FarmBody.scss"
import NavFirst from "./navFirst";
import ListPlant from "./page/ListPlant";
import { HrefData } from "../../../src/assets/js/module";

const FarmBody = ({path , liff , uid}) => {
    const [Body , setBody] = useState(<></>)
    const [Page , setPage] = useState("HOME")

    const [marginBody , setMargin] = useState(0)

    const HeadNav = useRef()
    const HeadNavMini = useRef()
    const BodyMain = useRef()
    const Nav = useRef()

    const HrafData = new HrefData("HOME")

    useEffect(()=>{
        // setBody(<NavFirst setPage={setPage} setBody={setBody} path={path} uid={uid} liff={liff}/>)
        
        window.addEventListener('popstate' , checkPage)
        checkPage()

        return ()=>{
            window.removeEventListener('popstate' , checkPage)
        }
    } , [])

    const HomeClick = () => {
        if(Page !== "HOME") {
            const pathClick = new Map([
                ["farm" , path.get("farm")]
            ])
            setBody(<NavFirst setBody={setBody} setPage={setPage} path={pathClick} uid={uid} liff={liff} isClick={1}/>)
        }
    }

    const checkPage = () => {
        // check page

        const authClick = window.location.href.split("?")[1]
        const pathClick = new Map([...authClick.split("&").map((val)=>val.split("="))])
        if(pathClick.has("farm")){
            if(pathClick.size === 1){
                clientMo.post("/api/farmer/sign" , {uid:uid , page : `authplant`}).then((result)=>{
                    if(result === "search") {
                        setBody(<NavFirst setBody={setBody} setPage={setPage} path={pathClick} uid={uid} liff={liff}/>)
                    }
                })
            }
            else if(pathClick.size === 2){
                if(pathClick.has("page"))
                    clientMo.post("/api/farmer/sign" , {uid:uid , page : `authplant`}).then((result)=>{
                        if(result === "search") {
                            setBody(<ListPlant path={pathClick} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={0} valuePage={pathClick.get("page")} typePath={"page"}/>)
                        }
                    })
                else if(pathClick.has("formferti")) 
                    clientMo.post("/api/farmer/sign" , {uid:uid , page : `authFactor`}).then((result)=>{
                        if(result === "search") {
                            setBody(<ListPlant path={pathClick} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={0} valuePage={pathClick.get("formferti")} typePath={"formferti"}/>)
                        }
                    })
                else if(pathClick.has("formcremi")) 
                    clientMo.post("/api/farmer/sign" , {uid:uid , page : `authFactor`}).then((result)=>{
                        if(result === "search") {
                            setBody(<ListPlant path={pathClick} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={0} valuePage={pathClick.get("formcremi")} typePath={"formcremi"}/>)
                        }
                    })

                // เก็บเกี่ยว ดูคำแนะนำ
            }
            
        }

        else if(pathClick.size === 2 && pathClick.has("farm") && pathClick.has("page"))
            clientMo.post("/api/farmer/sign" , {uid:uid , page : `authplant`}).then((result)=>{
                if(result === "search") {
                    setBody(<ListPlant path={pathClick} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={0} valuePage={pathClick.get("page")}/>)
                }
            })
    }

    const CloseNav = (e) => {
        if(e.target === Nav.current) Nav.current.removeAttribute("show")
    }

    const Load = () => {
        HeadNavMini.current.style.height = `${HeadNav.current.clientHeight}px`       
        setMargin(HeadNav.current.clientHeight)   
    }

    return (
        <section className="farm">
            <div className="farm-body">
                <div className="head-nav" ref={HeadNav}>
                    <div onLoad={Load} className="logo" onClick={HomeClick}>
                        <img src="/logo2.png"></img>
                        <span>GAP</span>
                    </div>
                    <div className="menu-icon">
                        <svg onClick={()=>Nav.current.setAttribute("show" , "")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H608zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H608z"/></svg>
                    </div>
                </div>
                <div style={{marginTop : `${marginBody}px`}} className="body-main">
                    {Body}
                </div>
            </div>
            <div onClick={CloseNav} ref={Nav} className="background-nav">
                <div className="nav-menu">
                    <div ref={HeadNavMini} className="head-nav">
                        <div></div>
                        <div className="menu-icon">
                            <svg onClick={()=>Nav.current.removeAttribute("show")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H608zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H608z"/></svg>
                        </div>
                    </div>
                    <div>ข้อมูลโรงเรือน</div>
                    <div>การปลูก</div>
                    <div>ปัจจัยการผลิต</div>
                    <div>สารเคมี</div>
                    <div>การเก็บเกี่ยว</div>
                    <div>คำแนะนำ</div>
                </div>
            </div>
        </section>
    )
}

export default  FarmBody