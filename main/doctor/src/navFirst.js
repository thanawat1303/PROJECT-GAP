import React, { useEffect } from "react"

import "./assets/style/Navfirst.scss"
import PageFormPlant from "./page/form/PageFormPlant"
import PageExport from "./page/export/PageExport"
import PageFarmer from "./page/farmer/PageFarmer"

import { clientMo } from "../../../src/assets/js/moduleClient"
import { ButtonMenu } from "./page/modules"
import PageData from "./page/data/PageData"
const NavFirst = ({setMain , setSession , setdoctor , socket , type = 0 , eleImageCover , eleBody , setTextStatus}) => {
    useEffect(()=>{
        if(type === 1) window.history.pushState({} , "" , "/doctor")

        setTextStatus([])
        eleImageCover.current.style.height = "50%"
        eleBody.current.style.height = "50%"
    } , [])

    const farmer = async () => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) 
            setdoctor(<PageFarmer setMain={setMain}
                        socket={socket} LoadType={"ap"} session={setSession} type={1} 
                        eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus}/>)
        else setSession()
    }

    const form = async () => {
        const context = await clientMo.post('/api/doctor/check')
        if(context)
            setdoctor(<PageFormPlant setMain={setMain}
                        socket={socket} LoadType={"ap"} session={setSession} type={true} 
                        eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus} />)
        else setSession()
    }

    const data = async () => {
        const context = await clientMo.post('/api/doctor/check')
        if(context)
            setdoctor(<PageData setMain={setMain}
                        socket={socket} LoadType={"plant"} session={setSession} type={true} 
                        eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus} />)
        else setSession()
    }

    return (
        <section className="nav-first" onLoad={clientMo.unLoadingPage}>
            <div className="head">
                <span>Menu</span>
            </div>
            <div className="content-menu">
                <ButtonMenu type={"farmer"} textRow1={"ทะเบียน"} textRow2={"เกษตรกร"} action={farmer}/>
                <ButtonMenu type={"form"} textRow1={"แบบบันทึก"} textRow2={"และการปลูก"} action={form}/>
                <ButtonMenu type={"data"} textRow1={"เพิ่มเติม"} textRow2={"ข้อมูล"} action={data}/>
            </div>
        </section>
    )
}

export default NavFirst