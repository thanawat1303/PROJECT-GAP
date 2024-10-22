import React, { useEffect, useRef, useState } from "react";
import '../assets/style/page/templatePage.scss'
import "../assets/style/page/List.scss"

import ListData from "./ListData";

const PageTemplate = ({socket , addHref = false , HrefData , modify , auth , session , TabOn}) => {
    const [StatusPage , setStatus] = useState({
        status :    HrefData.get() === "list?default" ? "default" : 
                    HrefData.get() === "list?delete" ? "delete" : 
                    HrefData.get() === "data?plant" ? "plant" : 
                    HrefData.get() === "data?station" ? "station" : "",
        changePath : addHref
    }) 

    const [StateOnPage , setStateOnPage] = useState({
        status :    HrefData.get() === "list?default" ? "default" : 
                    HrefData.get() === "list?delete" ? "delete" : 
                    HrefData.get() === "data?plant" ? "plant" : 
                    HrefData.get() === "data?station" ? "station" : "",
    })

    const [getTimeOut , setTimeOut] = useState(0)
    const [getTextSearch , setTextSearch] = useState("")

    const PageAddRef = useRef()
    const TextSearchRef = useRef()

    useEffect(()=>{
        // modify(70 , 30 , 
        //                 ["หน้าแรก"])

        if(HrefData.get().split("=")[1] === "pop") {
            state()
        }

    } , [HrefData.get()])

    useEffect(()=>{
        return(()=>{
            clearTimeout(getTimeOut)
        })
    } , [getTimeOut])

    const state = () => {
        const status =  HrefData.get() === "list?default=pop" ? "default" : 
                        HrefData.get() === "list?delete=pop" ? "delete" : 
                        HrefData.get() === "data?plant=pop" ? "plant" : 
                        HrefData.get() === "data?station=pop" ? "station" : "";
        setStatus({
            status : status, //ใช้ภายในหน้าได้
            changePath : false
        })
    }

    const ChangeStatus = async (statusClick) => {
        if(statusClick != StatusPage.status) {
            if(auth(true)) {
                setStatus({status : statusClick , changePath : true})
                HrefData.set(`${HrefData.get().split("?")[0]}?${statusClick}=c`)
                TextSearchRef.current.value = ""
            }
        }
    }

    return (
        <section className="page-manage">
            <div className="menu-page">
                {StateOnPage.status === "default" || StateOnPage.status === "plant" || StateOnPage.status === "station" ?
                <div className="bt-add">
                    <svg onClick={()=>PageAddRef.current.toggleAttribute("show")} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2A14.172 14.172 0 0 0 2 16a14.172 14.172 0 0 0 14 14a14.172 14.172 0 0 0 14-14A14.172 14.172 0 0 0 16 2Zm8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z"/><path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7v2z"/></svg>
                </div>
                : <></>
                }
                {
                StateOnPage.status === "default" ? 
                    <button className="bt-delete" onClick={()=>ChangeStatus("delete")}>แสดงบัญชีที่ถูกลบ</button> : 
                StateOnPage.status === "delete" ? 
                    <button className="bt-default" onClick={()=>ChangeStatus("default")}>แสดงบัญชีที่ยังไม่ถูกลบ</button> :
                
                StateOnPage.status === "plant" ? 
                    <button className="bt-station" onClick={()=>ChangeStatus("station")}>แสดงรายการศูนย์ส่งเสริม</button> :
                StateOnPage.status === "station" ? 
                    <button className="bt-plant" onClick={()=>ChangeStatus("plant")}>แสดงรายการชนิดพืช</button> :
                <></>
                }
                <div className="search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                            <path d="m11.25 11.25l3 3"/><circle cx="7.5" cy="7.5" r="4.75"/>
                        </g>
                    </svg>
                    <input ref={TextSearchRef} onInput={(e)=>{
                        clearTimeout(getTimeOut)
                        setTimeOut(setTimeout(()=>{
                            setTextSearch(e.target.value)
                        } , 2000))
                    }} type="text" placeholder="Search"></input>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{
                        clearTimeout(getTimeOut)
                        setTextSearch("")
                        TextSearchRef.current.value = ""
                    }} width="1em" height="1em" viewBox="0 0 32 32">
                        <path fill="currentColor" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4l-1.6 1.6z"/>
                    </svg>
                </div>
            </div>
            <div className="list-manage">
                <ListData socket={socket} status={StatusPage} PageAddRef={PageAddRef} auth={auth} session={session} TabOn={TabOn} HrefPage={HrefData} setStateOnPage={setStateOnPage} modify={modify} textSearch={getTextSearch}/>
            </div>
        </section>
    )
}

export default PageTemplate