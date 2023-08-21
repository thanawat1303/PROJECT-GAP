import React, { useEffect, useRef, useState } from "react";

import { clientMo } from "../../../src/assets/js/moduleClient";
import "../assets/FarmBody.scss"
import ListForm from "./PlantList/ListForm";
import MenuPlant from "./PlantList/MenuPlant";
import ListFactor from "./Factor/ListFactor";
import { CloseAccount, GetPath } from "../method";
import { PopupDom } from "../../../src/assets/js/module";
import House from "./House/House";
import DataForm from "./DataForm/DataForm";
import Success from "./Success/Success";
import Report from "./Report/Report";

const FarmBody = ({liff , uid , id_farmhouse}) => {
    const [Body , setBody] = useState(<></>)
    const [Page , setPage] = useState("HOME")

    const [paddingBody , setPadding] = useState(0)

    const HeadNav = useRef()
    const HeadNavMini = useRef()
    const BodyMain = useRef()
    const Nav = useRef()

    const MenuHome = useRef()

    useEffect(()=>{
        // setBody(<NavFirst setPage={setPage} path={path} liff={liff}/>)
        
        window.addEventListener('popstate' , checkPage)
        checkPage("")

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

    const checkPage = async (e , Time = new Date().getTime()) => {
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
            else if(GetPath()[1] === "c") {
                const result = await clientMo.post("/api/farmer/formplant/check" , {id_farmhouse:id_farmhouse , id_form_plant : GetPath()[2]})
                if(await CloseAccount(result , setPage)) {
                    setBody(<ListFactor setBody={setBody} setPage={setPage} id_house={id_farmhouse} 
                                typeHraf={{type : "c" , id_form_plant : GetPath()[2]}} liff={liff}/>)
                }
            }
            else if(GetPath()[1] === "d") {
                const result = await clientMo.post("/api/farmer/formplant/check" , {id_farmhouse:id_farmhouse , id_form_plant : GetPath()[2]})
                if(await CloseAccount(result , setPage)) {
                    setBody(<DataForm id_house={id_farmhouse} id_plant={GetPath()[2]} setBody={setBody} 
                                setPage={setPage} liff={liff}/>)
                }
            }
            else if(GetPath()[1] === "r") {
                const result = await clientMo.post("/api/farmer/formplant/check" , {id_farmhouse:id_farmhouse , id_form_plant : GetPath()[2]})
                if(await CloseAccount(result , setPage)) {
                    setBody(<Report setBody={setBody} setPage={setPage} id_house={id_farmhouse} 
                                id_plant={GetPath()[2]} liff={liff}/>)
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
        } else if (GetPath().length === 4) {
            if(GetPath()[1] === "s" && (GetPath()[3] === "h" || GetPath()[3] === "cf" || GetPath()[3] === "cp")) {
                const result = await clientMo.post("/api/farmer/formplant/check" , {id_farmhouse:id_farmhouse , id_form_plant : GetPath()[2]})
                if(await CloseAccount(result , setPage)) {
                    setBody(<Success setBody={setBody} setPage={setPage} id_house={id_farmhouse} 
                                id_plant={GetPath()[2]} type={`menu:${GetPath()[3]}:${Time}`} liff={liff}/>)
                }
            }
        }

        // else if(GetPath().length === 3 && path.has("f") && path.has("p"))
        //     clientMo.post("/api/farmer/account/check").then((result)=>{
        //         if(result === "search") {
        //             setBody(<ListFactor id_house={id_farmhouse} setPage={setPage} liff={liff} type={0} valuePage={GetPath()[2]}/>)
        //         }
        //     })
    }

    const CloseNav = (e) => {
        Nav.current.removeAttribute("show")
    }

    const Load = () => {
        HeadNavMini.current.style.height = `${HeadNav.current.clientHeight}px`       
        setPadding(HeadNav.current.clientHeight)   
    }

    const RefHouse = useRef()
    const [getHouseEdit , setHouseEdit] = useState(<></>)
    const OpenEditHouse = () => {
        setHouseEdit(<House Ref={RefHouse} setPage={setPage} setPopup={setHouseEdit} id_farmhouse={id_farmhouse}/>)
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
                    <div className="content-list-menu">
                        <div className="frame-list-menu">
                            <div className="menu-list" onClick={HomeClick}>
                                <svg viewBox="0 0 25 25" fill="none">
                                    <path d="M3.0802 9.15381L12.0802 2.15381L21.0802 9.15381V20.1538C21.0802 20.6842 20.8695 21.1929 20.4944 21.568C20.1193 21.9431 19.6106 22.1538 19.0802 22.1538H5.0802C4.54977 22.1538 4.04106 21.9431 3.66599 21.568C3.29091 21.1929 3.0802 20.6842 3.0802 20.1538V9.15381Z" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9.0802 22.1538V12.1538H15.0802V22.1538" stroke="#22C7A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>รายการปลูก</span>
                            </div>
                            <div className="menu-list" onClick={OpenEditHouse}>
                                <svg viewBox="0 0 26 22" fill="none">
                                    <path d="M23.7206 0H2.15642C0.965895 0 0 1.04116 0 2.32445V19.3704C0 20.6537 0.965895 21.6949 2.15642 21.6949H23.7206C24.9111 21.6949 25.877 20.6537 25.877 19.3704V2.32445C25.877 1.04116 24.9111 0 23.7206 0ZM7.90686 4.6489C9.49273 4.6489 10.7821 6.03873 10.7821 7.74817C10.7821 9.45761 9.49273 10.8474 7.90686 10.8474C6.321 10.8474 5.03164 9.45761 5.03164 7.74817C5.03164 6.03873 6.321 4.6489 7.90686 4.6489ZM12.9385 16.1162C12.9385 16.6295 12.4892 17.046 11.9322 17.046H3.88155C3.32448 17.046 2.87522 16.6295 2.87522 16.1162V15.1864C2.87522 13.6465 4.22748 12.3971 5.89421 12.3971H6.11883C6.67142 12.6441 7.27341 12.7845 7.90686 12.7845C8.54031 12.7845 9.1468 12.6441 9.69489 12.3971H9.91952C11.5862 12.3971 12.9385 13.6465 12.9385 15.1864V16.1162ZM23.0018 13.5593C23.0018 13.7724 22.8401 13.9467 22.6424 13.9467H16.1731C15.9755 13.9467 15.8137 13.7724 15.8137 13.5593V12.7845C15.8137 12.5714 15.9755 12.3971 16.1731 12.3971H22.6424C22.8401 12.3971 23.0018 12.5714 23.0018 12.7845V13.5593ZM23.0018 10.46C23.0018 10.6731 22.8401 10.8474 22.6424 10.8474H16.1731C15.9755 10.8474 15.8137 10.6731 15.8137 10.46V9.68522C15.8137 9.47214 15.9755 9.29781 16.1731 9.29781H22.6424C22.8401 9.29781 23.0018 9.47214 23.0018 9.68522V10.46ZM23.0018 7.36077C23.0018 7.57384 22.8401 7.74817 22.6424 7.74817H16.1731C15.9755 7.74817 15.8137 7.57384 15.8137 7.36077V6.58595C15.8137 6.37287 15.9755 6.19854 16.1731 6.19854H22.6424C22.8401 6.19854 23.0018 6.37287 23.0018 6.58595V7.36077Z" fill="#22C7A9"/>
                                </svg>
                                <span>แก้ไขโรงเรือน</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PopupDom Ref={RefHouse} Body={getHouseEdit} zIndex={999}/>
        </section>
    )
}

export default  FarmBody