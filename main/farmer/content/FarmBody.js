import React, { useEffect, useRef, useState } from "react";

import { clientMo } from "../../../src/assets/js/moduleClient";
import "../assets/FarmBody.scss"
import ListForm from "./PlantList/ListForm";
import MenuPlant from "./PlantList/MenuPlant";
import ListFactor from "./Factor/ListFactor";
import { CloseAccount, GetPath } from "../method";

const FarmBody = ({liff , uid , id_farmhouse}) => {
    const [Body , setBody] = useState(<></>)
    const [Page , setPage] = useState("HOME")

    const [paddingBody , setPadding] = useState(0)

    const HeadNav = useRef()
    const HeadNavMini = useRef()
    const BodyMain = useRef()
    const Nav = useRef()

    useEffect(()=>{
        // setBody(<NavFirst setPage={setPage} path={path} liff={liff}/>)
        
        window.addEventListener('popstate' , checkPage)
        checkPage()

        return ()=>{
            window.removeEventListener('popstate' , checkPage)
        }
    } , [])

    const HomeClick = async () => {
        if(Page !== "HOME") {
            const result = await clientMo.post("/api/farmer/account/check")
            if(await CloseAccount(result , setPage)) {
                setBody(<ListForm setBody={setBody} id_house={id_farmhouse} setPage={setPage} liff={liff} isClick={1}/>)
            } 
        }
    }

    const checkPage = async () => {
        // check page
        if(GetPath().length === 1){
            const result = await clientMo.post("/api/farmer/account/check")
            if(await CloseAccount(result , setPage)) {
                setBody(<ListForm setBody={setBody} id_house={id_farmhouse} setPage={setPage} liff={liff}/>)
            } 
        }

        // 
        else if(GetPath().length === 3){
            if(GetPath()[1] === "p") {
                const result = await clientMo.post("/api/farmer/formplant/check" , {id_farmhouse:id_farmhouse , id_form_plant : GetPath()[2]})
                if(await CloseAccount(result , setPage)) {
                    setBody(<MenuPlant setBody={setBody} id_house={id_farmhouse} id_plant={GetPath()[2]} setPage={setPage} liff={liff}/>)
                }
            }
            else if(GetPath()[1] === "z") {
                const result = await clientMo.post("/api/farmer/formplant/check" , {id_farmhouse:id_farmhouse , id_form_plant : GetPath()[2]})
                if(await CloseAccount(result , setPage)) {
                    setBody(<ListFactor setBody={setBody} setPage={setPage} id_house={id_farmhouse} 
                                typeHraf={{type : "z" , id_form_plant : GetPath()[2]}} liff={liff}/>)
                }
            }
                
            // else if(path.has("formcremi")) 
            //     clientMo.post("/api/farmer/account/check" , {uid:uid , page : `authFactor`}).then((result)=>{
            //         if(result === "search") {
            //             const Hraf = {
            //                 Path : "formcremi",
            //                 id_plant : GetPath()[2]
            //             }
            //             setBody(<ListFactor id_house={id_farmhouse} HrafPath={Hraf} setPage={setPage} liff={liff} type={0}/>)
            //         }
            //     })

            // เก็บเกี่ยว ดูคำแนะนำ
        }

        // else if(GetPath().length === 3 && path.has("f") && path.has("p"))
        //     clientMo.post("/api/farmer/account/check").then((result)=>{
        //         if(result === "search") {
        //             setBody(<ListFactor id_house={id_farmhouse} setPage={setPage} liff={liff} type={0} valuePage={GetPath()[2]}/>)
        //         }
        //     })
    }

    const CloseNav = (e) => {
        if(e.target === Nav.current) Nav.current.removeAttribute("show")
    }

    const Load = () => {
        HeadNavMini.current.style.height = `${HeadNav.current.clientHeight}px`       
        setPadding(HeadNav.current.clientHeight)   
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
                <div style={{paddingTop : `${paddingBody}px`}} className="body-main">
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
                    <div>รายการปลูก</div>
                    <div>ข้อมูลโรงเรือน</div>
                </div>
            </div>
        </section>
    )
}

export default  FarmBody