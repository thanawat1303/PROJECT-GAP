import React, { useEffect } from "react"

import "./assets/style/Navfirst.scss"
import { clientMo } from "../../../src/assets/js/moduleClient"
import { ButtonMenu } from "../../../src/assets/js/module"

import PageManageDoctor from "./page/doctor/PageManageDoctor"

const NavFirst = ({setBodyFileAdmin , auth , socket , modify , type = 0 , TabOn , selectPage}) => {
    useEffect(()=>{
        let path = window.location.pathname.split("/").filter((path)=>path)
        if(type === 1 && path.length !== 1) window.history.pushState({} , "" , "/admin")

        TabOn.addTimeOut(TabOn.end())

        modify(50 , 50 , [])
    } , [selectPage])

    const doctor = () => {
        const method = () => {
            setBodyFileAdmin(<PageManageDoctor socket={socket} auth={auth} addHref={true} modify={modify} TabOn={TabOn} hrefDataPage={"default"}/>)
        }
        auth(method , true)
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