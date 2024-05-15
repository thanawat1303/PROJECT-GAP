import React, { useContext, useEffect, useState } from "react";
import FormList from "./PageFormPlant";

import "../../assets/style/page/form/Pageform.scss"
import { ButtonMenu } from "../modules";
import { clientMo } from "../../../../../assets/js/moduleClient";
import Locals from "../../../../../locals";
import { DoctorProvider } from "../../main";
const PageForm = ({main , session , setBodyDoctor , socket , type = 0 , eleImageCover , eleBody , setTextStatus}) =>{
    const { lg } = useContext(DoctorProvider)
    const [Body , setBody] = useState(<></>)

    useEffect(()=>{
        // let path = window.location.href.replace(window.location.origin , "").split("/").filter(val=>(val))

        if(type === 1) window.history.pushState({} , "" , "/doctor/form")
        
        eleImageCover.current.style.height = "50%"
        eleBody.current.style.height = "50%"
        setTextStatus([Locals[lg]["home"] , "แบบบันทึกการปลูก"])

        console.log(type)
        // if(path.length >= 2) {
        //     if(path[1].indexOf("ap") >= 0) setBody(<FormList main={main} socket={socket} setBodyDoctor={setBodyDoctor} session={session} eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus} typeDataForm={"ap"}/>)
        //     else if (path[1].indexOf("wt") >= 0) setBody(<FormList main={main} socket={socket} setBodyDoctor={setBodyDoctor} session={session} eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus} typeDataForm={"wt"}/>)
        // }
        // else {
        //     
        // }
    } , [])

    const OpenListForm = () => {
        clientMo.post('/api/doctor/check').then((context)=>{
            if(context) 
                setBodyDoctor(<FormList main={main} socket={socket} setBodyDoctor={setBodyDoctor} session={session} eleImageCover={eleImageCover} eleBody={eleBody} setTextStatus={setTextStatus} type={1} LoadType={"ap"}/>)
            else session()
        })
    }

    return (
        <section className="page-form">
            <div className="head">
                <span>แบบบันทึกการปลูก</span>
            </div>
            <div className="content-menu">
                <ButtonMenu type={"plant"} textRow1={"แบบบันทึก"} textRow2={"การปลูกพืช"} action={OpenListForm}/>
                <ButtonMenu type={"success"} textRow1={"ยืนยัน"} textRow2={"การเก็บเกี่ยว"} />
            </div>
        </section>
    )
}

export default PageForm