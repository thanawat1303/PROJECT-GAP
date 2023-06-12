import React, { useEffect, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import { DAYUTC, Loading } from "../../../../../src/assets/js/module";

import "../../assets/style/page/doctor/Because.scss"
const ShowBecause = ({RefOnPage , id_table , type , TabOn}) => {
    const [LoadingState , setLoading] = useState(false)
    const [ListBecause , setList] = useState(<></>)

    const [ScreenW , setScreenW] = useState(window.innerWidth)
    const [ScreenH , setScreenH] = useState(window.innerHeight)

    useEffect(()=>{
        RefOnPage.current.style.opacity = "1"
        RefOnPage.current.style.visibility = "visible"

        TabOn.addTimeOut(TabOn.end())

        FetchData()
        window.addEventListener("resize" , ResizeScreen)

        return()=>{
            window.removeEventListener("resize" , ResizeScreen)
        }
    } , [])

    const FetchData = async () => {
        const data = await clientMo.post("/api/admin/doctor/because/get" , {id_table : id_table , type_status : type})
        const List = JSON.parse(data).map((value , key)=>
            <tr key={key}>
                <td style={{
                    textAlign : 'center' , 
                    fontSize : "2vw",
                    fontWeight : "900",
                    color : value.type_status ? "green" : "red",
                    width : "20%"
                }}>{value.type_status ? "ON" : "OFF" }</td>
                <td style={{width : "60%"}}>
                    <div>
                        <span className="date">
                            <DAYUTC DATE={value.date} TYPE="normal"/>
                        </span>
                        <span>
                            {value.because_text}
                        </span>
                    </div>
                </td>
                <td style={{textAlign : 'center' , width : "20%"}}>{value.id_admin}</td>
            </tr>
        )
        
        setList(List)
        setLoading(true)
    }

    const ResizeScreen = () => {
        setScreenW(window.innerWidth)
        setScreenH(window.innerHeight)
    }

    return(
        <section className="show-because">
            <div className="head">
                {type === "status_account" ? "ประวัติและเหตุผลการเปิด/ปิดบัญชี" : type === "status_delete" ? "ประวัติและเหตุผลการลบบัญชี" : ""}
            </div>
            <div className="content">
                {LoadingState ? 
                <table>
                    <thead>
                        <tr>
                            <td style={{ textAlign: "center" , width : "20%"}}>ประเภท</td>
                            <td style={{ textAlign: "center" , width : "60%"}}>เหตุผล</td>
                            <td style={{ textAlign: "center" , width : "20%"}}>ผู้จัดการ</td>
                        </tr>
                    </thead>
                    <tbody>
                        {ListBecause}
                    </tbody>
                </table> 
                : <Loading size={5/100 * ScreenW} border={0.6/100 * ScreenW} color="#22C7A9" animetion={true}/>}
            </div>
        </section>
    )
}

export default ShowBecause