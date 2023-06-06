import React, { useEffect } from "react"

import "./assets/style/Navfirst.scss"
import PageForm from "./page/form/PageForm"
import PageExport from "./page/export/PageExport" 
import { clientMo } from "../../../src/assets/js/moduleClient"
import { ButtonMenu } from "./page/modules"
const NavFirst = ({main , setSession , setdoctor , socket , type = 0 , eleImageCover , eleBody , setTextStatus}) => {
    useEffect(()=>{
        if(type === 1) window.history.pushState({} , "" , "/doctor")

        setTextStatus([])
        eleImageCover.current.style.height = "50%"
        eleBody.current.style.height = "50%"
    } , [])

    const farmer = () => {
        console.log(123)
    }

    const form = () => {
        clientMo.post('/api/doctor/check').then((context)=>{
            if(context) 
                setdoctor(<PageForm main={main} 
                            socket={socket} setBodyDoctor={setdoctor} session={setSession} type={1} 
                            eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus}/>)
            else setSession()
        })
    }

    const data = () => {
        console.log(123)
    }

    const exportData = () => {
        clientMo.post('/api/doctor/check').then((context)=>{
            if(context) 
                setdoctor(<PageExport main={main} 
                            socket={socket} setBodyDoctor={setdoctor} session={setSession} type={1} typeDataForm={"all"}
                            eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus}/>)
            else setSession()
        })
    }
    return (
        <section className="nav-first">
            <div className="head">
                <span>Menu</span>
            </div>
            <div className="content-menu">
                <ButtonMenu type={"farmer"} textRow1={"ลงทะเบียน"} textRow2={"เกษตรกร"} action={farmer}/>
                <ButtonMenu type={"form"} textRow1={"แบบบันทึก"} textRow2={"และการปลูก"} action={form}/>
                <ButtonMenu type={"data"} textRow1={"เพิ่มเติม"} textRow2={"ข้อมูล"} action={data}/>
                <ButtonMenu type={"exportData"} textRow1={"Export"} textRow2={"ข้อมูล"} action={exportData}/>
            </div>
        </section>
    )
}

export default NavFirst