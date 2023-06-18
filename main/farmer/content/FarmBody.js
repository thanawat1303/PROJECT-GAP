import React, { useEffect, useRef, useState } from "react";

import { clientMo } from "../../../src/assets/js/moduleClient";
import "../assets/FarmBody.scss"
import ListForm from "./PlantList/ListForm";
import MenuPlant from "./PlantList/MenuPlant";
import ListFactor from "./Factor/ListFactor";
import { CloseAccount } from "../method";

const FarmBody = ({liff , uid}) => {
    const [Body , setBody] = useState(<></>)
    const [Page , setPage] = useState("HOME")

    const [marginBody , setMargin] = useState(0)

    const HeadNav = useRef()
    const HeadNavMini = useRef()
    const BodyMain = useRef()
    const Nav = useRef()

    useEffect(()=>{
        // setBody(<NavFirst setPage={setPage} setBody={setBody} path={path} liff={liff}/>)
        
        window.addEventListener('popstate' , checkPage)
        checkPage()

        return ()=>{
            window.removeEventListener('popstate' , checkPage)
        }
    } , [])

    const HomeClick = async () => {
        if(Page !== "HOME") {
            const result = await clientMo.post("/api/farmer/sign" , {uid:uid})
            if(await CloseAccount(result)) {
                const split = window.location.href.split("?")[1]
                const path = new Map([...split.split("&").map((val)=>val.split("="))])
                setBody(<ListForm id_house={path.get("f")} setBody={setBody} setPage={setPage} liff={liff} isClick={1}/>)
            }
        }
    }

    const checkPage = async () => {
        // check page
        const split = window.location.href.split("?")[1]
        const path = new Map([...split.split("&").map((val)=>val.split("="))])
        if(path.size === 1){
            const result = await clientMo.post("/api/farmer/sign" , {uid:uid})
            if(await CloseAccount(result)) {
                setBody(<ListForm id_house={path.get("f")} setBody={setBody} setPage={setPage} liff={liff}/>)
            }
        }

        // 
        else if(path.size === 2){
            if(path.has("p"))
                clientMo.post("/api/farmer/sign" , {uid:uid}).then((result)=>{
                    if(result === "search") {
                        setBody(<MenuPlant id_house={path.get("f")} id_plant={path.get("p")} setBody={setBody} setPage={setPage} liff={liff}/>)
                    }
                })
            else if(path.has("formferti")) 
                clientMo.post("/api/farmer/sign" , {uid:uid , page : `authFactor`}).then((result)=>{
                    if(result === "search") {
                        const Hraf = {
                            Path : "formferti",
                            id_plant : path.get("p")
                        }
                        setBody(<ListFactor id_house={path.get("f")} HrafPath={Hraf} setPage={setPage} setBody={setBody} liff={liff} type={0}/>)
                    }
                })
            else if(path.has("formcremi")) 
                clientMo.post("/api/farmer/sign" , {uid:uid , page : `authFactor`}).then((result)=>{
                    if(result === "search") {
                        const Hraf = {
                            Path : "formcremi",
                            id_plant : path.get("p")
                        }
                        setBody(<ListFactor id_house={path.get("f")} HrafPath={Hraf} setPage={setPage} setBody={setBody} liff={liff} type={0}/>)
                    }
                })

            // เก็บเกี่ยว ดูคำแนะนำ
        }

        // else if(path.size === 2 && path.has("f") && path.has("p"))
        //     clientMo.post("/api/farmer/sign" , {uid:uid}).then((result)=>{
        //         if(result === "search") {
        //             setBody(<ListFactor id_house={path.get("f")} setPage={setPage} setBody={setBody} liff={liff} type={0} valuePage={path.get("p")}/>)
        //         }
        //     })
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