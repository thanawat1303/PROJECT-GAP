import React, { useEffect, useState } from "react"

import "./assets/style/Navfirst.scss"
import PageFormPlant from "./page/form/PageFormPlant"
import PageFarmer from "./page/farmer/PageFarmer"

import { clientMo } from "../../../src/assets/js/moduleClient"
import { ButtonMenu } from "./page/modules"
import PageData from "./page/data/PageData"
const NavFirst = ({setMain , setSession , setdoctor , socket , type = 0 , eleImageCover , eleBody , setTextStatus}) => {
    const [ Responsive , setResponsive ] = useState(window.innerWidth)
    
    useEffect(()=>{
        if(type === 1) window.history.pushState({} , "" , "/doctor")

        setTextStatus([])
        Resize()

        window.addEventListener("resize" , Resize)

        return(()=>{
            window.removeEventListener("resize" , Resize)
        })
    } , [])

    const Resize = () => {
        const Size = window.innerWidth
        if(Size > 800) {
            eleImageCover.current.style.height = "50%"
            eleBody.current.style.height = "50%"
        } else {
            eleImageCover.current.style.height = "40%"
            eleBody.current.style.height = "60%"
        }
        setResponsive(Size)
    }

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
            <div className={`content-menu${Responsive > 800 ? "" : " column"}`}>
                { Responsive > 800 ?
                    <>
                    <ButtonMenu type={"farmer"} textRow1={"ทะเบียน"} textRow2={"เกษตรกร"} action={farmer}/>
                    <ButtonMenu type={"form"} textRow1={"แบบบันทึก"} textRow2={"และการปลูก"} action={form}/>
                    </>
                    :
                    <div className="row">
                        <ButtonMenu type={"farmer"} textRow1={"ทะเบียน"} textRow2={"เกษตรกร"} action={farmer}/>
                        <ButtonMenu type={"form"} textRow1={"แบบบันทึก"} textRow2={"และการปลูก"} action={form}/>
                    </div>
                }
                <ButtonMenu type={"data"} textRow1={"เพิ่มเติม"} textRow2={"ข้อมูล"} action={data}/>
            </div>
        </section>
    )
}

export default NavFirst