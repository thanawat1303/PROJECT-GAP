import React, { useEffect } from "react"

import "./assets/style/Navfirst.scss"
import { clientMo } from "../../../src/assets/js/moduleClient"
import { ButtonMenu } from "../../../src/assets/js/module"

import PageManageDoctor from "./page/doctor/PageManageDoctor"
import PageData from "./page/data/PageManageData"

const NavFirst = ({setBodyFileAdmin , auth , socket , modify , type = 0 , TabOn , selectPage , HrefData}) => {
    useEffect(()=>{
        if(type === 1 && HrefData.get() !== "HOME") window.history.pushState({} , "" , "/admin")

        TabOn.addTimeOut(TabOn.end())

        HrefData.set("HOME")

        modify(50 , 50 , [])
    } , [selectPage])

    const doctor = async () => {
        if(await auth(true)) {
            HrefData.set("list?default")
            setBodyFileAdmin(<PageManageDoctor socket={socket} auth={auth} addHref={true} modify={modify} TabOn={TabOn} HrefData={HrefData}/>)
        }
    }

    const data = async () => {
        if(await auth(true)) {
            HrefData.set("data?default")
            setBodyFileAdmin(<PageData socket={socket} auth={auth} addHref={true} modify={modify} TabOn={TabOn} HrefData={HrefData}/>)
        }
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