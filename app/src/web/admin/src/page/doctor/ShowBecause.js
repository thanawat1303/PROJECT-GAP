import React, { useContext, useEffect, useState } from "react";
import { clientMo } from "../../../../../assets/js/moduleClient";
import { DayJSX, Loading } from "../../../../../assets/js/module";

import "../../assets/style/page/doctor/Because.scss"
import { AdminProvider } from "../../main";
import Locals from "../../../../../locals";
const ShowBecause = ({RefOnPage , id_table , type , TabOn , setBecause}) => {
    const { lg } = useContext(AdminProvider)

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
                { type === "status_account" ?
                    <>
                    <td style={{
                        textAlign : 'center' ,
                        fontWeight : "900",
                        color : value.type_status ? "green" : "red",
                        width : "20%",
                        // outlineLeft : "0px",
                    }}>{value.type_status ? "ON" : "OFF" }</td>
                    <td style={{width : "60%"}}>
                        <div>
                            <span className="date">
                                <DayJSX DATE={value.date} TYPE="normal"/>
                            </span>
                            <span>
                                {value.because_text}
                            </span>
                        </div>
                    </td>
                    <td style={{textAlign : 'center' , width : "20%"}}>{value.id_admin}</td>
                    </> : 
                    type === "status_delete" ?
                    <>
                    <td style={{width : "80%"}}>
                        <div>
                            <span className="date">
                                <DayJSX DATE={value.date} TYPE="normal"/>
                            </span>
                            <span>
                                {value.because_text}
                            </span>
                        </div>
                    </td>
                    <td style={{textAlign : 'center' , width : "20%"}}>{value.id_admin}</td>
                    </> : <></>
                }
            </tr>
        )
        
        setList(List)
        setLoading(true)
    }

    const close = () => {
        RefOnPage.current.removeAttribute("style")
        // window.removeEventListener("resize" , setSizeScreen)
        setTimeout(()=>{
            setBecause(<></>)
        } , 500)
    }

    const ResizeScreen = () => {
        setScreenW(window.innerWidth)
        setScreenH(window.innerHeight)
    }

    return(
        <section className="show-because">
            <div className="head">
                <div className="head-text">
                    {type === "status_account" ? Locals[lg]["history_reason_on_off"] : type === "status_delete" ? Locals[lg]["history_reason_on_off"] : ""}
                </div>    
                <img onClick={close} src="/close.svg"></img>            
            </div>
            <div className="content">
                {LoadingState ? 
                <table>
                    <thead>
                        <tr>
                            { type === "status_account" ? 
                                <>
                                <td style={{ textAlign: "center" , width : "20%"}}>{Locals[lg]["type_manage"]}</td> 
                                <td style={{ textAlign: "center" , width : "60%"}}>{Locals[lg]["reason"]}</td>
                                <td style={{ textAlign: "center" , width : "20%"}}>{Locals[lg]["manager"]}</td>
                                </>
                                : type === "status_delete" ? 
                                <>
                                <td style={{ textAlign: "center" , width : "80%"}}>{Locals[lg]["reason"]}</td>
                                <td style={{ textAlign: "center" , width : "20%"}}>{Locals[lg]["manager"]}</td>
                                </> : <></>
                            }
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