import React, { useContext, useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../assets/js/moduleClient";

import "../../assets/style/page/PopupManage.scss"
import { Loading, ReportAction } from "../../../../../assets/js/module";
import { AdminProvider } from "../../main";
import Locals from "../../../../../locals";
const ManageDoctorPage = ({RefOnPage , id_table , type , status , setBecause , TabOn , session , ReloadFetch}) => {
    const { lg } = useContext(AdminProvider)
    
    const [LoadingStatus , setLoading] = useState(true)

    const [ScreenW , setScreenW] = useState(window.innerWidth)
    const [ScreenH , setScreenH] = useState(window.innerHeight)

    const [Open , setOpen] = useState(0)
    const [Text , setText] = useState("")
    const [Status , setStatus] = useState(0)

    const BecauseRef = useRef()
    const PasswordRef = useRef()

    const [Profile , setProfile] = useState({
        id_table : "", 
        id : "" ,
        fullname : "",
        img : "",
        station : "",
        isdelete : false
    })

    useEffect(()=>{
        RefOnPage.current.style.opacity = "1"
        RefOnPage.current.style.visibility = "visible"

        TabOn.addTimeOut(TabOn.end())

        FecthProfile()

        window.removeEventListener("resize" , setSizeScreen)
        window.addEventListener("resize" , setSizeScreen)
        return()=>{
            window.removeEventListener("resize" , setSizeScreen)
        }
    } , [])

    const FecthProfile = async () => {
        let profile = await clientMo.get("/api/admin/doctor/" + id_table)
        profile = JSON.parse(profile).map((val)=>val)[0]
        setProfile({
            id_table : profile.id_table_doctor,
            id : profile.id_doctor,
            fullname : profile.fullname_doctor,
            img :  profile.img_doctor !== "" ? profile.img_doctor : "/doctor-svgrepo-com.svg",
            station : profile.station,
            isdelete : profile.status_delete
        })
    }

    const close = () => {
        RefOnPage.current.removeAttribute("style")
        window.removeEventListener("resize" , setSizeScreen)
        setTimeout(()=>{
            setBecause(<></>)
        } , 500)
    }

    const setSizeScreen = (e) => {
        setScreenW(window.innerWidth)
        setScreenH(window.innerHeight)
    }

    const Submit = async () => {
        if(BecauseRef.current.value && PasswordRef.current.value) {
            const data = {
                id_table : Profile.id_table,
                type_status : type,
                status : type === "status_account" ? status ? 0 : 1 : 1,
                because : BecauseRef.current.value,
                password : PasswordRef.current.value,
            }

            setOpen(1)
            const result = await clientMo.post("/api/admin/manage/doctor" , data)
            if(result === "133") {
                setText(`${type === "status_account" ? status ? Locals[lg]["off_account"] : Locals[lg]["on_account"] : Locals[lg]["delete_account"]}${ lg === "th" ? Locals[lg]["success"] : ` ${Locals[lg]["success"]}` }`)
                setStatus(1)
            } else if(result === "delete") {
                setText(Locals[lg]["account_has_deleted"])
                setStatus(2)
            } else if(result === "because") {
                setText(Locals[lg]["err_server"])
                setStatus(3)
            } else if(result === "password") {
                setText(Locals[lg]["err_password"])
                setStatus(3)
                PasswordRef.current.value = ""
            } else session()
        }
    }

    let Time = 0
    const AfterConfirm = () => {
        if(Status === 1 || Status === 2) {
            if(type === "status_delete" || Status === 2) {
                // const block = document.getElementById(`data-list-content-${id_table}`)
                // block.setAttribute("remove" , "")
                setTimeout(()=>{
                    ReloadFetch()
                } , 600)
                // document.querySelector(`#data-list-content-${id_table} Action-bt content-status bt-because`).innerHTML = `<button onclick=\"()=>${methodOpenManage(2 , 'status_account')}\">เหตุผล</button>`
                    // <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_account")}>เหตุผล</button>
            } else if (type === "status_account") {
                // document.querySelector(`#data-list-content-${id_table} Action-bt content-status Bt-status .frame`)
                //     .setAttribute("status" , status ? 0 : 1)
                ReloadFetch()
            }
            close()
        }
        else {
            if(Status != 0) {
                setOpen(0)
                Time = setTimeout(()=>{
                    setText("")
                    setStatus(0)
                } , 500)
            }
        }
    }

    return (
        <>
        <ReportAction Open={Open} Text={Text} Status={Status} 
                        setOpen={setOpen} setText={setText} setStatus={setStatus}
                        sizeLoad={6/100 * ScreenW >= 60 ? 6/100 * ScreenW : 60}
                        BorderLoad={0.8/100 * ScreenW >= 10 ? 0.8/100 * ScreenW : 10}
                        color="#1CFFF1" action={AfterConfirm}/>
        <div className="manage-page">
            <div className="head-page">
                {type === "status_account" ? status ? Locals[lg]["reason_off_account"] : Locals[lg]["reason_on_account"] : Locals[lg]["reason_delete_account"]}
            </div>
            <div className="detail-content">
                {LoadingStatus ? 
                    <div className="Loading">
                        <Loading size={4/100 * ScreenW >= 41 ? 4/100 * ScreenW : 41} border={0.5/100 * ScreenW >= 5 ? 0.5/100 * ScreenW : 5} color="#1CFFF1" animetion={LoadingStatus}/>
                        <span>{Locals[lg]["loading_data_doctor"]}</span>
                    </div>
                    : <></>
                }
                <div onLoad={()=>setLoading(false)} className="detail-data-report">
                    {
                    Profile.id_table ?
                        Profile.isdelete ? 
                            <div className="data-delete">
                                <img src="/error-cross-svgrepo-com.svg"></img>
                                <div>{Locals[lg]["account_has_deleted"]}</div>
                            </div>
                            :
                            <>
                                <div className="img">
                                    <img src={Profile.img}></img>
                                </div>
                                <div className="detail-text">
                                    <div className="text-preview">
                                        <span className="fullname">{Profile.fullname ? Profile.fullname : Locals[lg]["not_name"]}</span>
                                    </div>
                                    <div className="text-preview">
                                        <span className="head-data">{Locals[lg]["id"]}</span>
                                        <div>{Profile.id}</div>
                                    </div>
                                    <div className="text-preview">
                                        <span className="head-data">{Locals[lg]["__station"]}</span> 
                                        <div>{Profile.station ? Profile.station : Locals[lg]["station_anonymous"]}</div>
                                    </div>
                                </div>
                            </> 
                    : <></>
                    }
                </div>
            </div>
            <div className="form-manage">
                <label className="column">
                    <span>{Locals[lg]["reason"]}</span>
                    { Profile.isdelete ? 
                        <textarea readOnly ref={BecauseRef} className="input-text"></textarea>
                        :
                        <textarea ref={BecauseRef} className="input-text"></textarea>
                    }
                </label>
                <label className="column">
                    <span>{Locals[lg]["admin_password_short"]}</span>
                    { Profile.isdelete ? 
                        <input placeholder={Locals[lg]["please_password"]} readOnly ref={PasswordRef} type="password" className="input-text input-pw"></input>
                        : 
                        <input placeholder={Locals[lg]["please_password"]} ref={PasswordRef} type="password" className="input-text input-pw"></input>
                    }
                </label>
                <div className="bt-manage">
                    <button onClick={close} className="close">{Locals[lg]["cancel"]}</button>
                    { Profile.isdelete ?
                        <></>
                        : 
                        <button onClick={Submit} className="submit">{Locals[lg]["confirm"]}</button>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default ManageDoctorPage