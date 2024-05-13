import React, { useContext, useEffect, useState } from "react"

import "./assets/style/Navfirst.scss"
import PageFormPlant from "./page/form/PageFormPlant"
import PageFarmer from "./page/farmer/PageFarmer"

import { clientMo } from "../../../assets/js/moduleClient"
import { ButtonMenu } from "./page/modules"
import PageData from "./page/data/PageData"

import { DoctorProvider } from "./main"
import Locals from "../../../locals"
const NavFirst = ({setMain , setSession , setdoctor , socket , type = 0 , eleImageCover , eleBody , setTextStatus}) => {
    const { lg } = useContext(DoctorProvider)
    
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
                <span>{Locals[lg]["menu"]}</span>
            </div>
            <div className={`content-menu${Responsive > 800 ? "" : " column"}`}>
                { Responsive > 800 ?
                    <>
                    <ButtonMenu type={"farmer"} textRow1={Locals[lg]["BtMenuDoctorRegister"]["row_1"]} textRow2={Locals[lg]["BtMenuDoctorRegister"]["row_2"]} action={farmer}/>
                    <ButtonMenu type={"form"} textRow1={Locals[lg]["BtMenuDoctorFrom"]["row_1"]} textRow2={Locals[lg]["BtMenuDoctorFrom"]["row_2"]} action={form}/>
                    </>
                    :
                    <div className="row">
                        <ButtonMenu type={"farmer"} textRow1={Locals[lg]["BtMenuDoctorRegister"]["row_1"]} textRow2={Locals[lg]["BtMenuDoctorRegister"]["row_2"]} action={farmer}/>
                        <ButtonMenu type={"form"} textRow1={Locals[lg]["BtMenuDoctorFrom"]["row_1"]} textRow2={Locals[lg]["BtMenuDoctorFrom"]["row_2"]} action={form}/>
                    </div>
                }
                <ButtonMenu type={"data"} textRow1={Locals[lg]["BtMenuAdminData"]["row_1"]} textRow2={Locals[lg]["BtMenuAdminData"]["row_2"]} action={data}/>
            </div>
        </section>
    )
}

export default NavFirst