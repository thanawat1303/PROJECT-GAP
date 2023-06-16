import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import "../../assets/ListPlant.scss"
import { DAYUTC } from "../../../../src/assets/js/module";
import PopupInsertPlant from "./InsertPlant";
import PopupInsertFertilizer from "./InsertFertilizer";
const ListPlant = ({setBody , setPage , path , liff , uid , type , valuePage , typePath}) => {
    const [BodyList , setBodyList] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    const [PopupAdd , setPopupAdd] = useState(<></>)

    const PopupRef = useRef()

    let Factor = ["ferti" , "cremi" , "success" , "report"]
    let FormNamePage = ["formferti" , "formcremi"]
    
    useEffect(()=>{
        setPage(valuePage)
        setBodyList(<></>)
        console.log(path)
        if(type === 1) window.history.pushState({} , null , `/farmer?farm=${path.get("farm")}&${typePath}=${valuePage}`)

        // if(path.has("list")) SelectList(path.get("list"))
        // else {
            
        // }
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()

        if(typePath === "page") ListPlantForm()
        else if (typePath === "formferti") ListFerti()
    } , [valuePage , typePath])

    const openListFerti = (id) => {
        clientMo.post("/api/farmer/sign" , {uid:uid , page : `authFactor`}).then((result)=>{
            if(result === "search") {
                setBody(<ListPlant path={path} setPage={setPage} setBody={setBody} liff={liff} uid={uid} type={1} valuePage={id} typePath={"formferti"}/>)
            }
        })
    }

    const ListFerti = () => {
        console.log(valuePage)
        clientMo.post('/api/farmer/factor/select' , {
            uid : uid,
            id_farmhouse : path.get("farm"),
            type : "formfertilizer",
            id : valuePage,
            order : "date"
        }).then((list)=>{
            setLoading(true)
            console.log(list)
            if(list !== 'error auth'){
                // setBodyList(JSON.parse(list).map((val , key)=>
                //     <div key={key} className="plant-content">
                //         <div className="top">
                //             <div className="type-main">
                //                 <input readOnly value={val.type_main}></input>
                //             </div>
                //             <div className="date">
                //                 <span>วันที่ปลูก <DAYUTC DATE={val.date_plant} TYPE="short"/></span>
                //             </div>
                //         </div>
                //         <div className="body">
                //             <div className="content">
                //                 <span>{val.type}</span>
                //             </div>
                //             <div className="content">
                //                 <input readOnly value={`จำนวน ${val.qty} ต้น`}></input>
                //             </div>
                            
                //         </div>
                //         <div className="bottom">
                //             <div className="content">
                //                 <span>{`รุ่นที่ ${val.generation}`}</span>
                //             </div>
                //             {
                //                 valuePage === "plant" ? 
                //                 <div className="bt">
                //                     <button>แก้ไข</button>
                //                     <button>รายละเอียด</button>
                //                 </div>
                //                 : valuePage === "ferti" ?
                //                 <div className="bt">
                //                     <div></div>
                //                     <button onClick={()=>openListFerti(val.id)}>ดูปัยจัยการผลิต</button>
                //                 </div>
                //                 : <></>
                //             }
                //         </div>
                //     </div>
                // ))
            } else {
                setBodyList(<div></div>)
            }
        })
    }

    const ListPlantForm = () => {
        clientMo.post('/api/farmer/formplant/select' , {
                uid : uid,
                id_farmhouse : path.get("farm")
            }).then((list)=>{
                setLoading(true)
                console.log(list)
                if(list !== 'error auth' && list !== 'not'){
                    setBodyList(JSON.parse(list).map((val , key)=>
                        <div key={key} className="plant-content">
                            <div className="top">
                                <div className="type-main">
                                    <input readOnly value={val.type_main}></input>
                                </div>
                                <div className="date">
                                    <span>วันที่ปลูก <DAYUTC DATE={val.date_plant} TYPE="short"/></span>
                                </div>
                            </div>
                            <div className="body">
                                <div className="content">
                                    <span>{val.type}</span>
                                </div>
                                <div className="content">
                                    <input readOnly value={`จำนวน ${val.qty} ต้น`}></input>
                                </div>
                                
                            </div>
                            <div className="bottom">
                                <div className="content">
                                    <span>{`รุ่นที่ ${val.generation}`}</span>
                                </div>
                                {
                                    valuePage === "plant" ? 
                                    <div className="bt">
                                        <button>แก้ไข</button>
                                        <button>รายละเอียด</button>
                                    </div>
                                    : valuePage === "ferti" ?
                                    <div className="bt">
                                        <div></div>
                                        <button onClick={()=>openListFerti(val.id)}>ดูปัยจัยการผลิต</button>
                                    </div>
                                    : <></>
                                }
                            </div>
                        </div>
                    ))
                } else {
                    setBodyList(<div></div>)
                }
            })
    }

    const SelectList = (page , type = 0) => {
        console.log(page)
        // clientMo.post("/api/farmer/sign" , {
        //     uid : uid,
        //     page : `auth${page}`
        // }).then((val)=>{
        //     if(val === "search") {
        //         if(page === "plant") setBody(<ListPlant path={path} setBody={setBody} liff={liff} uid={uid} type={type}/>)
        //     }
        // })
    }

    const popupPlant = () => {
        const authClick = window.location.href.split("?")[1]
        const pathClick = new Map([...authClick.split("&").map((val)=>val.split("="))])
        setPopupAdd(<PopupInsertPlant setLoading={setLoading} setBodyList={setBodyList} setPopup={setPopupAdd} RefPop={PopupRef} uid={uid} path={pathClick}/>)
    }

    const popupFertilizer = () => {
        const authClick = window.location.href.split("?")[1]
        const pathClick = new Map([...authClick.split("&").map((val)=>val.split("="))])
        setPopupAdd(<PopupInsertFertilizer setLoading={setLoading} setBodyList={setBodyList} setPopup={setPopupAdd} RefPop={PopupRef} uid={uid} path={pathClick}/>)
    }

    return (
        <section className="plant">
            <section ref={PopupRef} className="popup-add">
                {PopupAdd}
            </section>
            <div className="content-body">
                <div className="head">
                    {valuePage === "plant" && typePath === "page" ? 
                    <>
                        <div className="title">แบบบันทึกเกษตรกร</div>
                        <div onClick={popupPlant} className="frame-menu">
                            <div className="img">
                                <img src="/ปลูก.jpg"></img>
                            </div>
                            <span>เพิ่มการบันทึก</span>
                        </div> 
                    </>
                    : 
                    Factor.indexOf(valuePage) >= 0 && typePath === "page" ?
                    <>
                        <div className="title">แบบบันทึกเกษตรกร</div>
                        <div className="frame-menu">
                            <div className="img">
                                <img src="/ปลูก.jpg"></img>
                            </div>
                        </div>
                    </>
                    :
                    FormNamePage.indexOf(typePath) >= 0 ?
                    <>
                        <div className="title">รายการ{
                            FormNamePage.indexOf(typePath) == 0 ? "ปัจจัยการผลิต" :
                            FormNamePage.indexOf(typePath) == 1 ? "สารเคมี" : ""
                        }</div>
                        <div onClick={
                            typePath === "formferti" ? popupFertilizer : null
                        } className="frame-menu">
                            <div className="img">
                                <img src={
                                    typePath === "formferti" ? "/ปุ๋ยธรรมชาติ.webp" : ""
                                }></img>
                            </div>
                            <span>เพิ่มการบันทึก</span>
                        </div>
                    </>
                    : <></>
                    }
                </div>
                <div className="list-plant">
                    {BodyList}
                    {Loading}
                </div>
            </div>
        </section>
    )
}

export default ListPlant