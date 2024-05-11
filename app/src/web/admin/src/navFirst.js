import React, { useContext, useEffect, useState } from "react"

import "./assets/style/Navfirst.scss"
import { ButtonMenu } from "../../../assets/js/module"

import PageTemplate from "./page/PageTemplate"
import { AdminProvider } from "./main"

import Locals from "../../../locals"
const NavFirst = ({setBodyFileAdmin , auth , session , socket , modify , type = 0 , TabOn , selectPage , HrefData}) => {
    const [ Responsive , setResponsive ] = useState(window.innerWidth)
    const { lg } = useContext(AdminProvider)

    useEffect(()=>{
        if(type === 1 && HrefData.get() !== "HOME") window.history.pushState({} , "" , "/admin")

        TabOn.addTimeOut(TabOn.end())
        // Resize()

        HrefData.set("HOME")

        modify(50 , 50 , [])

        // window.addEventListener("resize" , Resize)

        // return(()=>{
        //     window.removeEventListener("resize" , Resize)
        // })
    } , [selectPage])

    const Resize = () => {
        const Size = window.innerWidth
        if(Size > 800) {
            modify(50 , 50 , [])
        } else if(Size > 570){
            modify(50 , 50 , [])
        } else {
            modify(50 , 50 , [])
        }
        setResponsive(Size)
    }

    const doctor = async () => {
        if(await auth(true)) {
            HrefData.set("list?default")
            setBodyFileAdmin(<PageTemplate session={session} socket={socket} auth={auth} addHref={true} modify={modify} TabOn={TabOn} HrefData={HrefData}/>)
        }
    }

    const data = async () => {
        if(await auth(true)) {
            HrefData.set("data?plant")
            setBodyFileAdmin(<PageTemplate session={session} socket={socket} auth={auth} addHref={true} modify={modify} TabOn={TabOn} HrefData={HrefData}/>)
        }
    }

    return (
        <section className="nav-first">
            <div className="head">
                <span>{Locals[lg]["menu"]}</span>
            </div>
            <div className="content-menu">
                <ButtonMenu type={"doctor"} textRow1={Locals[lg]["BtMenuAdminRegister"]["row_1"]} textRow2={Locals[lg]["BtMenuAdminRegister"]["row_2"]} action={doctor}/>
                <ButtonMenu type={"add-data"} textRow1={Locals[lg]["BtMenuAdminData"]["row_1"]} textRow2={Locals[lg]["BtMenuAdminData"]["row_2"]} action={data}/>
            </div>
        </section>
    )
}

export default NavFirst