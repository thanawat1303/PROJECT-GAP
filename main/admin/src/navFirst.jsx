import React, { useEffect } from "react"

import "./assets/style/Navfirst.scss"
import { clientMo } from "../../../src/assets/js/moduleClient"
import { ButtonMenu } from "../../../src/assets/js/module"

import PageManageDoctor from "./page/doctor/PageManageDoctor"

const NavFirst = ({setBodyFileAdmin , setSession , socket , modify , type = 0 , TabOn}) => {
    useEffect(()=>{
        let path = window.location.pathname.split("/").filter((path)=>path)
        if(type === 1 && path.length !== 1) window.history.pushState({} , "" , "/admin")

        modify(50 , 50 , [])
    } , [])

    const doctor = () => {
        TabOn.start()
        clientMo.post('/api/admin/check').then((context)=>{
            if(context) 
                setBodyFileAdmin(<PageManageDoctor socket={socket} setSession={setSession} addHref={true} modify={modify} TabOn={TabOn}/>)
            else setSession()
        })
    }

    const data = () => {
        // clientMo.post('/api/admin/check').then((context)=>{
        //     if(context) 
        //         setBodyFileAdmin(<></>)
        //     else setSession()
        // })
    }

    return (
        <section className="nav-first">
            <div className="head">
                <span>Menu</span>
            </div>
            <div className="content-menu">
                <ButtonMenu type={"doctor"} textRow1={"ทะเบียน"} textRow2={"เจ้าหน้าที่"} action={doctor}/>
                <ButtonMenu type={"add-data"} textRow1={"เพิ่มเติม"} textRow2={"ข้อมูล"} action={data}/>
            </div>
        </section>
    )
}

export default NavFirst