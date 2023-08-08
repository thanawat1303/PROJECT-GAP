import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import { DayJSX, Loading, MapsJSX, PopupDom, ReportAction, TimeJSX } from "../../../../../src/assets/js/module";
import "../../assets/style/page/farmer/ManagePopup.scss"

import SelectConvert from "./SelectConvert";
import Messageing from "./message/Message";
import EditProfile from "./editProfile/editProfile";

const ManagePopup = ({setPopup , RefPop , resultPage = {
    id_table : "",
    link_user : ""
} , status , session , countLoad , Fecth , socket}) => {
    const [DetailFarmer , setDetailFarmer] = useState(<></>)
    const [DetailDoctor , setDetailDoctor] = useState(<></>)
    // const [DetailMsg , setDetailMsg] = useState(<></>)
    const [ TypeDetail , setTypeDetail ] = useState("farmer")

    const [Load , setLoad] = useState(true)
    const [ReLoadAll , setReload] = useState(true)

    const [resultDate , setResult] = useState([])

    const PopRefConvert = useRef()
    const [PopupConvert , setPopConvert] = useState(<></>)
    const [LoadConvert , setLoadConvert] = useState(false)

    const RefPopCancel = useRef()
    const [PopupCancel , setPopCancel] = useState(<></>)

    const RefTab = useRef()

    const [ProfileConvert , setConvert] = useState({
        id_table_convert : "" ,
        id_farmer : "",
        fullname : "" ,
        img : ""
    })

    const RefOnType = status === "ap" ? 
    {
        DoctorPw : useRef(),
        ButtonRef : useRef()
    } 
    : 
    {
        FarmerID : useRef(),
        DoctorPw : useRef(),
        ButtonRef : useRef()
    }

    const [OpenReport , setOpen] = useState(0)
    const [StatusReport , setStatus] = useState(0)
    const [TextReport , setText] = useState("")
    const [ResultAction , setResultAction] = useState("")

    const [StateActionConfirm , setStateActionConfirm] = useState("")

    const [StateEdit , setStateEdit] = useState(false)
    const RefPasswordEdit = useRef()
    const [BtStateEdit , setBtStateEdit] = useState(false)

    useEffect(()=>{
        RefPop.current.style.opacity = "1"
        RefPop.current.style.visibility = "visible"

        FetchCountList(resultPage.link_user , resultPage.id_table)

        return(()=>{
            socket.emit("disconnect msg" , DetailFarmer.uid_line)
            socket.removeListener("new_msg")
        })
    } , [])

    const [newMessage , SetNewMessage] = useState(true)
    const [messageCount , setmessageCount] = useState(0)
    useEffect(()=>{
        socket.removeListener("new_msg")
        socket.on("new_msg" , async (type)=>{
            if(type !== "read") SetNewMessage((prevent)=>!prevent)
            const Count = await clientMo.post("/api/doctor/farmer/msg/count" , {id_table : DetailFarmer.id_table})
            try {
                const count = JSON.parse(Count)[0]
                setmessageCount(count.count_msg)
            } catch(e) {session()}
        })
    } , [messageCount , DetailFarmer])

    const StartSocketMsg = async (uid_line) => {
        const uid_lineIn = DetailFarmer.uid_line ? DetailFarmer.uid_line : uid_line;
        socket.emit("disconnect msg" , uid_lineIn)
        socket.emit("connect msg" , uid_line)
    }

    const close = () => {
        RefPop.current.style.opacity = "0"
        RefPop.current.style.visibility = "hidden"

        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const FetchCountList = async (link_user , id_table) => {
        const Data = (status === "ap") ?
                            await clientMo.post("/api/doctor/farmer/get/count" , {link_user : link_user , auth : 1})
                            : await clientMo.post("/api/doctor/farmer/get/count" , {id_table : id_table , auth : (status === "wt") ? 0 : 2})
        const result = JSON.parse(Data)
        if(result.length != 0) {
            setConvert({
                id_table_convert : "" ,
                id_farmer : "",
                fullname : "" ,
                img : ""
            })
            console.log(link_user , id_table)
            setResult(result)
            setReload(false)
            await FetchData(result[0])
        } else {
            close()
        }
    }

    const FetchData = async (result) => {
        if(result) {
            setLoad(true)
            setStateEdit(false)
            const resultData = await clientMo.post("/api/doctor/farmer/get/detail" , {id_table : result.id_table , link_user : result.link_user})
            const Count = await clientMo.post("/api/doctor/farmer/msg/count" , {id_table : result.id_table})
            try {
                const data = JSON.parse(resultData)
                const count = JSON.parse(Count)[0]
                if(data.length === 1) {
                    const Detail = data[0]
                    setDetailFarmer(Detail)
                    setmessageCount(count.count_msg)
                    StartSocketMsg(Detail.uid_line)
                } else {
                    FetchCountList(resultPage.link_user , resultPage.id_table)
                    // <div className="detail">
                    //         {status === "ap" ? "บัญชีผ่านการตรวจสอบแล้ว" : "ไม่พบบัญชี"}
                    //     </div>
                }
            } catch(e) {
                session()
            }
            setDetailDoctor([])
            setTypeDetail("farmer")
            setLoad(false)
        } else close()
    }

    // convert
    const OpenListConvert = async (id_table) => {
        try {
            setLoadConvert(true)
            const context = await clientMo.post('/api/doctor/check')
            if(context) {
                setLoadConvert(false)
                setPopConvert(<SelectConvert RefPop={PopRefConvert} setPopup={setPopConvert} 
                        setProfile={setConvert} id_table={id_table} session={session}/>)
            } else session()
        } catch(e) {
            session()
        }
    }
    const DeleteConvert = () => {
        setConvert({
            id_table_convert : "" ,
            id_farmer : "",
            fullname : "" ,
            img : ""
        })
    }
    const ConfirmConvert = async (Detail , type) => {
        if(CheckEmplyPassword()) {
            const result = (type === "cancel") ? 
                                await clientMo.post("/api/doctor/farmer/convert/cancel" , {
                                    id_table : Detail.id_table,
                                    password : RefOnType.DoctorPw.current.value
                                })
                                :
                                await clientMo.post("/api/doctor/farmer/convert/comfirm" , {
                                    id_table : Detail.id_table,
                                    uid_line : Detail.uid_line,
                                    id_table_convert : ProfileConvert.id_table_convert,
                                    password : RefOnType.DoctorPw.current.value
                                })

            if (result === "password") {
                RefOnType.DoctorPw.current.value = ""
                RefOnType.DoctorPw.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
                CheckEmplyPassword()
            } else if(result === "over") {

            } else if (result) {
                setReload(true)
                console.log(result)
                await FetchCountList(result , ProfileConvert.id_table_convert)
                await Fecth(countLoad)
            } else session()

            setStateActionConfirm("")
        }
    }
    const CheckEmplyPassword = () => {
        if(RefOnType.DoctorPw.current.value) {
            RefOnType.ButtonRef.current.removeAttribute("not")
            return true
        }
        else {
            RefOnType.ButtonRef.current.setAttribute("not" , "")
            return false
        }
    }
    // convert

    // account check
    const ConfirmAppove = async () => {
        const check = CheckEmply()
        if(check) {
            const id_table_convert = ProfileConvert.id_table_convert
            const uid_line = DetailFarmer.uid_line
            
            setOpen(1)
            const result = await clientMo.post("/api/doctor/farmer/account/comfirm" , {
                id_table_convert : id_table_convert,
                id_table : DetailFarmer.id_table,
                uid_line : uid_line,
                password : RefOnType.DoctorPw.current.value,
                id_farmer : RefOnType.FarmerID.current.value,
                status_change : status === "wt" ? 0 : 2
            })
            setResultAction(result)
            if(result === "113") {
                setStatus(1)
                setText("ยืนยันบัญชี")
            } else if (result === "password") {
                setStatus(2)
                setText("รหัสเจ้าหน้าที่ไม่ถูกต้อง")
            } else if(result === "over") {
                setStatus(2)
                setText("มีบัญชียืนยันอยู่แล้ว")
            } 
            // else session()
        }
    }
    const CancelAppove = async () => {
        RefOnType.DoctorPw.current.removeAttribute("style")
        if(RefOnType.DoctorPw.current.value) {
            setOpen(1)
            const result = await clientMo.post("/api/doctor/farmer/account/cancel" , {
                id_table : DetailFarmer.id_table,
                password : RefOnType.DoctorPw.current.value,
            })
            console.log(status)

            setResultAction(result)
            if(result === "113") {
                setStatus(2)
                setText("ไม่ยืนยันบัญชี")
            } else if (result === "password") {
                setStatus(2)
                setText("รหัสเจ้าหน้าที่ไม่ถูกต้อง")
            } 
            // else session()
        } else {
            RefOnType.DoctorPw.current.style.outline = "2px solid red"
            RefOnType.DoctorPw.current.style.boxShadow = "0px 0px 8px red"
        }
    }
    const AfterReport = () => {
        if(ResultAction === "113" || ResultAction === "over") {
            close()
            setTimeout(async ()=>{
                await Fecth(countLoad)
            } , 500)
        } else if (ResultAction === "password") {
            setOpen(0)
            setStatus(0)
            setText("")
            RefOnType.DoctorPw.current.value = ""
        } else window.location.href = '/doctor'

        CheckEmply()
    }
    const CheckEmply = () => {
        const farmerID = RefOnType.FarmerID.current
        const pw = RefOnType.DoctorPw.current

        if(farmerID.value && pw.value) {
            RefOnType.ButtonRef.current.removeAttribute("not")
            return true
        }
        else {
            RefOnType.ButtonRef.current.setAttribute("not" , "")
            return false
        }
    }
    // account check

    // appove complete
    const [getSelectProfile , setSelectProfile] = useState(0)
    const SelectProfile = (keySelect , profile , onClickTap) => {
        if(onClickTap) {
            // RefTab.current.childNodes.forEach((val , key)=>{
            //     val.removeAttribute("select")
            // })
            // e.target.setAttribute("select" , "")
            setSelectProfile(keySelect)
        }
        setStateActionConfirm("")
        FetchData(profile)
    }

    // select doctor confirm
    const SelectDoctor = async (id_table_doctor) => {
        setLoad(true)
        const resultData = await clientMo.post("/api/doctor/farmer/get/account/confirm" , {id_table_doctor : id_table_doctor})

        try {
            const data = JSON.parse(resultData)
            if(data.length === 1) {
                const Detail = data[0]
                setDetailDoctor(Detail)
            } else {
                setDetailDoctor([])
            }
        } catch(e) {
            session()
        }
        setTypeDetail("doctor")
        setLoad(false)
    }


    // message
    const MessagePopup = async (id_table , link_user) => {
        setLoad(true)
        const resultData = await clientMo.post("/api/doctor/farmer/get/detail" , {id_table : id_table , link_user : link_user})

        try {
            const data = JSON.parse(resultData)
            if(data.length === 1) {
                const Detail = data[0]
                setDetailFarmer(Detail)
            } else {
                setDetailFarmer([])
            }
        } catch(e) {
            console.log(e)
            session()
        }
        setDetailDoctor([])
        setTypeDetail("msg")
        setLoad(false)
    }

    //close account
    const CloseAccount = async (Detail) => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) 
            setPopCancel(<PopupConfirmAction Ref={RefPopCancel} setPopup={setPopCancel} session={session} 
                DetailFarmer={Detail} id_table_convert={ProfileConvert.id_table_convert}
                setReload={setReload} FetchCountList={FetchCountList}
                FetData={Fecth} CountFetch={countLoad}/>)
        else session()
    }

    // edit
    const [DataEdit , setDataEdit] = useState("")
    const [LoadEdit , setLoadEdit] = useState(false)
    useEffect(()=>{
        setDataEdit("")
    } , [Load])

    const ChangeEditPage = async (type) => {
        setDataEdit([])
        setBtStateEdit(false)
        setLoad(true)
        setConvert({
            id_table_convert : "" ,
            id_farmer : "",
            fullname : "" ,
            img : ""
        })
        setStateActionConfirm("")
        const context = await clientMo.post('/api/doctor/check')
        setLoad(false)
        if(context) {
            type ? setStateEdit(true) : setStateEdit(false)
        }
        else session()
    }

    const CheckEdit = (DataEditIn = DataEdit) => {
        if(DataEditIn && RefPasswordEdit.current.value) {
            setBtStateEdit(true)
            setDataEdit(DataEditIn)
            return DataEditIn
        } else {
            setBtStateEdit(false)
            setDataEdit(DataEditIn)
            return false
        }
    }

    const SubmitEdit = async () => {
        const Data = CheckEdit()
        setBtStateEdit(false)
        if(Data) {
            Data.password = RefPasswordEdit.current.value
            Data.id_table = DetailFarmer.id_table

            setLoadEdit(true)
            const ResultEdit = await clientMo.postForm("/api/doctor/farmer/edit" , Data)
            
            if(ResultEdit === "password") {
                RefPasswordEdit.current.value = ""
                RefPasswordEdit.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
                setLoadEdit(false)
            } else if (ResultEdit === "1") {
                await FetchData(DetailFarmer)
                await Fecth(countLoad)
                setLoadEdit(false)
            } 
            else session()
        }
    }

    return(
        <div className="popup-manage">
            <div className="head-popup">
                { !StateEdit ? "ข้อมูลเกษตรกร" : "แก้ไขข้อมูล"}
                { !OpenReport ?
                    <div className="close" onClick={close}>
                        <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                        </svg>
                    </div> : <></>
                }
            </div>
            {
                !StateEdit ?
                    ReLoadAll ?
                        <></>
                        : 
                        status === "ap" ? 
                            resultDate.length !== 1 ?
                                <div className="tab-content" ref={RefTab}>
                                {
                                    resultDate.map((val , key)=>
                                        (key === 0) ?
                                            <div select={getSelectProfile === 0 ? "" : null} key={key} onClick={()=>SelectProfile(key , val , true)} className="tab-select-detail">ล่าสุด</div> :
                                            <div select={(getSelectProfile > 0 && getSelectProfile === key) ? "" : null} key={key} onClick={()=>SelectProfile(key , val , true)} className="tab-select-detail">{key + 1}</div>
                                    )
                                }
                                </div> : <></>
                            :
                            <></>
                : <></>
            }
            { !StateEdit ?
                <div className="option-account" top={resultDate.length !== 1 ? "n" : "y"}>
                    { TypeDetail === "doctor" || TypeDetail === "farmer" ?
                        <a title="พูดคุยกับเกษตรกร" className="list-type" onClick={()=>MessagePopup(DetailFarmer.id_table , DetailFarmer.link_user)}>
                            {   messageCount > 0 ?
                                <div className="count-msg">
                                {
                                    messageCount > 10 ? "10+" : messageCount
                                }
                                </div> : <></>
                            }
                            <svg viewBox="0 0 48 48">
                                <path d="M 23.007812 5 C 20.430604 5 17.955216 5.3826911 15.664062 6.0859375 A 1.50015 1.50015 0 1 0 16.544922 8.953125 C 18.547769 8.3383714 20.727023 8 23.007812 8 C 33.10213 8 41.005859 14.567511 41.005859 22.236328 C 41.005859 25.967632 39.339349 29.098942 36.613281 31.976562 A 1.50015 1.50015 0 1 0 38.791016 34.039062 C 41.856948 30.802683 44.005859 26.879024 44.005859 22.236328 C 44.005859 12.551146 34.415497 5 23.007812 5 z M 7.2363281 11.515625 A 1.50015 1.50015 0 0 0 6.0820312 12.03125 C 3.5472914 14.857327 2.0058594 18.403085 2.0058594 22.236328 C 2.0058594 30.874232 9.6073525 37.884555 19.505859 39.232422 C 19.733605 39.281857 19.977406 39.361175 20.132812 39.429688 C 20.118043 39.515147 20.153199 39.911316 20.105469 40.273438 C 20.105469 40.273438 20.105469 40.275391 20.105469 40.275391 C 20.092619 40.352451 19.881057 41.615404 19.835938 41.878906 L 19.837891 41.876953 C 19.762771 42.309977 19.521995 43.033546 20.193359 44.048828 C 20.529042 44.556469 21.285396 44.987587 21.962891 45 C 22.640385 45.01241 23.208997 44.789728 23.832031 44.447266 C 26.686076 42.87719 29.695889 41.176108 32.503906 39.255859 A 1.50015 1.50015 0 1 0 30.810547 36.779297 C 28.322739 38.480572 25.598464 40.016715 22.943359 41.484375 C 22.999979 41.145402 23.072266 40.71875 23.072266 40.71875 A 1.50015 1.50015 0 0 0 23.080078 40.671875 C 23.155098 40.109193 23.364983 39.264995 22.923828 38.162109 A 1.50015 1.50015 0 0 0 22.921875 38.158203 C 22.588283 37.333404 21.970623 36.974887 21.476562 36.738281 C 20.982502 36.501675 20.514934 36.37997 20.126953 36.296875 A 1.50015 1.50015 0 0 0 20.007812 36.277344 C 11.219455 35.120988 5.0058594 29.123568 5.0058594 22.236328 C 5.0058594 19.201571 6.2051462 16.387126 8.3164062 14.033203 A 1.50015 1.50015 0 0 0 7.2363281 11.515625 z M 18.333984 17.136719 C 17.769984 17.136719 17.310547 17.592344 17.310547 18.152344 L 17.310547 25.845703 C 17.310547 26.406703 17.768984 26.861328 18.333984 26.861328 C 18.897984 26.861328 19.357422 26.405703 19.357422 25.845703 L 19.357422 18.152344 C 19.357422 17.592344 18.898984 17.136719 18.333984 17.136719 z M 21.853516 17.136719 C 21.743516 17.136719 21.633344 17.154453 21.527344 17.189453 C 21.109344 17.328453 20.828125 17.715344 20.828125 18.152344 L 20.828125 25.845703 C 20.828125 26.406703 21.288516 26.861328 21.853516 26.861328 C 22.419516 26.861328 22.878906 26.405703 22.878906 25.845703 L 22.878906 21.087891 L 26.853516 26.455078 C 27.045516 26.709078 27.351875 26.861328 27.671875 26.861328 C 27.780875 26.861328 27.890094 26.843594 27.996094 26.808594 C 28.416094 26.671594 28.697266 26.284703 28.697266 25.845703 L 28.697266 18.150391 C 28.697266 17.590391 28.238828 17.136719 27.673828 17.136719 C 27.108828 17.136719 26.648438 17.590391 26.648438 18.150391 L 26.648438 22.912109 L 22.671875 17.542969 C 22.479875 17.288969 22.172516 17.136719 21.853516 17.136719 z M 11.466797 17.138672 C 10.902797 17.138672 10.443359 17.592344 10.443359 18.152344 L 10.443359 25.847656 C 10.443359 26.408656 10.901797 26.863281 11.466797 26.863281 L 15.345703 26.863281 C 15.910703 26.863281 16.368187 26.405703 16.367188 25.845703 C 16.367188 25.285703 15.910703 24.830078 15.345703 24.830078 L 12.488281 24.830078 L 12.488281 18.152344 C 12.488281 17.592344 12.031797 17.138672 11.466797 17.138672 z M 31.095703 17.138672 C 30.531703 17.138672 30.072266 17.594297 30.072266 18.154297 L 30.072266 18.15625 L 30.072266 21.998047 L 30.072266 22 L 30.072266 22.001953 L 30.072266 25.845703 C 30.072266 26.406703 30.532703 26.861328 31.095703 26.861328 L 34.974609 26.861328 C 35.539609 26.861328 36 26.405703 36 25.845703 C 36 25.285703 35.539609 24.830078 34.974609 24.830078 L 32.119141 24.830078 L 32.119141 23.013672 L 34.974609 23.013672 C 35.540609 23.013672 36 22.558047 36 21.998047 C 36 21.437047 35.539609 20.982422 34.974609 20.982422 L 34.974609 20.986328 L 32.119141 20.986328 L 32.119141 19.169922 L 34.974609 19.169922 C 35.540609 19.169922 36 18.714297 36 18.154297 C 36 17.594297 35.539609 17.138672 34.974609 17.138672 L 31.095703 17.138672 z"/>
                            </svg>
                        </a> : <></>
                    }
                    { TypeDetail === "doctor" || TypeDetail === "msg" ?
                        <a title="ข้อมูลเกษตรกร" className="list-type" onClick={(e)=>SelectProfile("" , DetailFarmer , false)}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 11h7v2h-7zm1 4h6v2h-6zm-2-8h8v2h-8zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2zm4-7c1.995 0 3.5-1.505 3.5-3.5S9.995 5 8 5 4.5 6.505 4.5 8.5 6.005 12 8 12z"/>
                            </svg>
                        </a>
                        : <></>
                    }
                    {
                        status === "ap" ? 
                            TypeDetail === "farmer" || TypeDetail === "msg" ?
                                <a title="ข้อมูลเจ้าหน้าที่" className="list-type" onClick={()=>SelectDoctor(DetailFarmer.id_doctor)}>
                                    <svg viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165Zm25-91.5-29,35L76,94c-4.5-3.5-10.5-2.5-14,2s-2.5,10.5,2,14c6,4.5,12.5,9,18.5,13.5,4.5,3,8.5,7.5,14,8,1.5,0,3.5,0,5-1l3-3,22.5-27c4-5,8-9.5,12-14.5,3-4,4-9,.5-13L138,71.5c-3.5-2.5-9.5-2-13,2Z"/>
                                    </svg>
                                </a>
                                : <></>
                            : <></>
                    }
                </div>
            : <></>
            }
            <div className="detail-content" type={status} style={{
                padding : Load ? "0px" : ""
            }}>
                { 
                    Load ? 
                        <div style={{
                            display : "flex",
                            justifyContent : "center",
                            alignItems : "center",
                            width : "100%",
                            height : "100%"
                        }}>
                            <Loading size={"10vw"} border={"1vw"} color="white" animetion={true}/>
                        </div>
                    : 
                        !StateEdit ?
                        <>
                        {
                            // detail
                            TypeDetail === "farmer" || TypeDetail === "doctor" ?
                            <div className="detail-account-data">
                                { TypeDetail === "farmer" ?
                                    <></> :
                                    <div className="appove-account-head">ผู้ยืนยัน</div>
                                }
                                <div className="img">
                                    <div className="frame-img">
                                        <img src={TypeDetail === "farmer" ? String.fromCharCode(...DetailFarmer.img.data) : DetailDoctor.img_doctor.data[0] ? String.fromCharCode(...DetailDoctor.img_doctor.data) : "/doctor-svgrepo-com.svg"}></img>
                                        <a className="download-pic" title="ดาวโหลดรูปภาพ" onClick={null}>
                                            <svg viewBox="0 0 24 24" fill="white">
                                                <path d="M5.25589 16C3.8899 15.0291 3 13.4422 3 11.6493C3 9.20008 4.8 6.9375 7.5 6.5C8.34694 4.48637 10.3514 3 12.6893 3C15.684 3 18.1317 5.32251 18.3 8.25C19.8893 8.94488 21 10.6503 21 12.4969C21 14.0582 20.206 15.4339 19 16.2417M12 21V11M12 21L9 18M12 21L15 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="text-detail">
                                    <span>{TypeDetail === "farmer" ? "รหัสประจำตัวเกษตรกร" : "รหัสประจำตัวเจ้าหน้าที่"}</span>
                                    <div className="frame-text">
                                        <input  onChange={status === "ap" ? null : CheckEmply} defaultValue={TypeDetail === "farmer" ? DetailFarmer.id_farmer : DetailDoctor.id_doctor} readOnly={status === "ap" ? true : false} ref={status === "ap" ? null : RefOnType.FarmerID} placeholder={status === "ap" ? null : "กรอกรหัสประจำตัว"}></input>
                                    </div>
                                </div>
                                {
                                    TypeDetail === "farmer" ? 
                                        <div className="text-detail">
                                            <span>วันที่สมัคร</span>
                                            <div className="frame-text">
                                                <DayJSX DATE={DetailFarmer.date_register} TYPE="small"/>
                                                <TimeJSX DATE={DetailFarmer.date_register} MAX={false}/>
                                            </div>
                                        </div> : <></>
                                }
                                <div className="text-detail">
                                    <span>{"ชื่อ - นามสกุล"}</span>
                                    <div className="frame-text">
                                        {TypeDetail === "farmer" ? DetailFarmer.fullname : DetailDoctor.fullname_doctor}
                                    </div>
                                </div>
                                {
                                    TypeDetail === "farmer" ?
                                        <div className="text-detail btm">
                                            <span>{"ที่อยู่"}</span>
                                            <div>
                                                <MapsJSX lat={DetailFarmer.location.x} lng={DetailFarmer.location.y} w={"100%"} h={"10%"}/>
                                            </div>
                                        </div> : <></>
                                }
                                {
                                    TypeDetail === "farmer" ? 
                                        <>
                                        {
                                            resultDate.length === 1 ?
                                                <div className="convert-user">
                                                    <div className="action-bt">
                                                        <span>เชื่อมต่อบัญชี</span>
                                                        <div className="bt-convert">
                                                            { LoadConvert ? 
                                                                <Loading size={25} border={4} color="#068863" animetion={true}/>
                                                                : <></>
                                                            }
                                                            <button onClick={()=>OpenListConvert(DetailFarmer.id_table)}>ค้นหาบัญชี</button>
                                                        </div>
                                                    </div>
                                                    {
                                                        ProfileConvert.id_table_convert ?
                                                            <div className="profile-preview">
                                                                <div className="image">
                                                                    <img src={ProfileConvert.img}></img>
                                                                </div> 
                                                                <div className="detail">
                                                                    <span>{ProfileConvert.id_farmer}</span>
                                                                    <div>{ProfileConvert.fullname}</div>
                                                                </div>
                                                                <div className="bt-cancel" onClick={DeleteConvert}>
                                                                    <svg version="1.1"
                                                                        viewBox="0 0 60.167 60.167" >
                                                                        <path d="M54.5,11.667H39.88V3.91c0-2.156-1.754-3.91-3.91-3.91H24.196c-2.156,0-3.91,1.754-3.91,3.91v7.756H5.667
                                                                        c-0.552,0-1,0.448-1,1s0.448,1,1,1h2.042v40.5c0,3.309,2.691,6,6,6h32.75c3.309,0,6-2.691,6-6v-40.5H54.5c0.552,0,1-0.448,1-1
                                                                        S55.052,11.667,54.5,11.667z M22.286,3.91c0-1.053,0.857-1.91,1.91-1.91H35.97c1.053,0,1.91,0.857,1.91,1.91v7.756H22.286V3.91z
                                                                        M50.458,54.167c0,2.206-1.794,4-4,4h-32.75c-2.206,0-4-1.794-4-4v-40.5h40.75V54.167z M38.255,46.153V22.847c0-0.552,0.448-1,1-1
                                                                        s1,0.448,1,1v23.306c0,0.552-0.448,1-1,1S38.255,46.706,38.255,46.153z M29.083,46.153V22.847c0-0.552,0.448-1,1-1s1,0.448,1,1
                                                                        v23.306c0,0.552-0.448,1-1,1S29.083,46.706,29.083,46.153z M19.911,46.153V22.847c0-0.552,0.448-1,1-1s1,0.448,1,1v23.306
                                                                        c0,0.552-0.448,1-1,1S19.911,46.706,19.911,46.153z"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            : <></>
                                                    }
                                                </div> : 
                                                !StateActionConfirm ? 
                                                    <div className="convert-user">
                                                        <div className="action-bt" >
                                                            <div className="bt-convert" style={{
                                                                width : "100%",
                                                                justifyContent : "center"
                                                            }}>
                                                                { LoadConvert ? 
                                                                    <Loading size={25} border={4} color="#068863" animetion={true}/>
                                                                    : <></>
                                                                }
                                                                <button style={{
                                                                    marginLeft : "0px"
                                                                }} onClick={()=>setStateActionConfirm("cancel-cvt")}>ยกเลิกเชื่อมบัญชี</button>   
                                                            </div>
                                                        </div>
                                                    </div> : <></>
                                        }
                                        {
                                            status === "ap" ? 
                                                <>
                                                <div className="edit-account">
                                                    <button onClick={()=>ChangeEditPage(1)}>แก้ไขข้อมูล</button>
                                                </div>
                                                <div className="close-account">
                                                    <button onClick={()=>CloseAccount(DetailFarmer)}>ปิดบัญชี</button>
                                                </div>
                                                </>
                                                : <></>
                                        }
                                        </>
                                        : <></>
                                }
                            </div> : 
                            <Messageing Data={DetailFarmer} FetData={()=>Fecth(countLoad)} session={session} socket={socket} is_change={newMessage}/>
                        }
                        </>
                        : <EditProfile setDataEdit={setDataEdit} DataProfile={DetailFarmer} session={session} CheckEditFun={CheckEdit}/>
                }
            </div>
            {
                status === "wt" || status === "not" ? 
                    <div className="action-box-bt">
                        <div className="password">
                            <input  onChange={CheckEmply} type="password" ref={RefOnType.DoctorPw} placeholder="รหัสผ่านเจ้าหน้าที่"></input>
                        </div>
                        <div className="bt">
                            {
                                status === "wt" ?
                                    <button className="cancel" onClick={CancelAppove}>ไม่ยืนยัน</button> : <></>
                            }
                            <button className="submit" onClick={ConfirmAppove} ref={RefOnType.ButtonRef} not="">ยืนยัน</button>
                        </div>
                    </div> : 
                ProfileConvert.id_table_convert && status === "ap" && resultDate.length === 1 ? 
                    <div className="action-box-bt submit-convert">
                        <div className="password">
                            <input  onChange={CheckEmplyPassword} type="password" ref={RefOnType.DoctorPw} placeholder="รหัสผ่านเจ้าหน้าที่"></input>
                        </div>
                        <div className="bt">
                            <button onClick={()=>ConfirmConvert(DetailFarmer , "convert")} className="submit" ref={RefOnType.ButtonRef} not="">เชื่อมต่อบัญชี</button>
                        </div>
                    </div> : 
                resultDate.length > 1 && status === "ap" && StateActionConfirm === "cancel-cvt" ?
                    <div className="action-box-bt submit-convert">
                        <div className="password">
                            <input  onChange={CheckEmplyPassword} type="password" ref={RefOnType.DoctorPw} placeholder="รหัสผ่านเจ้าหน้าที่"></input>
                        </div>
                        <div className="bt">
                            <button className="cancel" onClick={()=>setStateActionConfirm("")}>ไม่ยกเลิก</button>
                            <button onClick={()=>ConfirmConvert(DetailFarmer , "cancel")} className="submit" ref={RefOnType.ButtonRef} not="">ยกเลิกเชื่อมต่อ</button>
                        </div>
                    </div> : 
                StateEdit ?
                    <div className="action-box-bt">
                        <div className="password">
                            <input placeholder="รหัสผ่านเจ้าหน้าที่" onChange={()=>CheckEdit()} type="password" ref={RefPasswordEdit}></input>
                        </div>
                        <div className="bt">
                            <button className="cancel" onClick={()=>ChangeEditPage(0)}>ยกเลิก</button>
                            { LoadEdit ?
                                <div className="submit loading">
                                    <Loading size={22} border={4} color="white" animetion={true}/>
                                </div>
                                :
                                <button className="submit" not={BtStateEdit ? null : ""} onClick={SubmitEdit}>ยืนยัน</button>
                            }
                        </div>
                    </div>
                : <></>
            }
            <PopupDom Ref={PopRefConvert} Body={PopupConvert} zIndex={2}/>
            <PopupDom Ref={RefPopCancel} Body={PopupCancel} zIndex={2}/>
            <ReportAction Open={OpenReport} setOpen={setOpen}
                            Status={StatusReport} setStatus={setStatus}
                            Text={TextReport} setText={setText}
                            sizeLoad={70} BorderLoad={10} color={"rgb(25 102 80)"}
                            action={()=>AfterReport()}/>
        </div>
    )
}
const PopupConfirmAction = ({Ref , setPopup , session , DetailFarmer , id_table_convert , 
    setReload , FetchCountList , FetData , CountFetch}) => {

    const BtConfirm = useRef()
    const Password = useRef()
    
    useEffect(()=>{
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
    } , [])

    const Confirm = async () => {
        if(CheckEmply()) {
            const Data = {
                id_table : DetailFarmer.id_table,
                password : Password.current.value
            }
            const resultCloseConvert = await clientMo.post("/api/doctor/farmer/convert/cancel" , Data)
            const resultCloseAccount = await clientMo.post("/api/doctor/farmer/account/cancel" , Data)

            if (resultCloseAccount === "password" || resultCloseConvert === "password") {
                Password.current.value = ""
                Password.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
            } else if (resultCloseConvert && resultCloseAccount) {
                setReload(true)
                close()
                await FetchCountList(resultCloseConvert , id_table_convert)
                await FetData(CountFetch)
            } else session()
            // const result = (type === "cancel") ? 
            //                     await clientMo.post("/api/doctor/farmer/convert/cancel" , {
            //                         id_table : DetailFarmer.id_table,
            //                         password : Password.current.value
            //                     })
            //                     :
            //                     await clientMo.post("/api/doctor/farmer/convert/comfirm" , {
            //                         id_table : DetailFarmer.id_table,
            //                         uid_line : DetailFarmer.uid_line,
            //                         id_table_convert : id_table_convert,
            //                         password : Password.current.value
            //                     })
        }
    }

    const close = () => {
        Ref.current.style.opacity = "0"
        Ref.current.style.visibility = "hidden"

        setTimeout(()=>{
            setPopup(<></>)
        })
    }

    const CheckEmply = () => {
        const pw = Password.current

        if(pw.value) {
            BtConfirm.current.removeAttribute("not")
            return true
        }
        else {
            BtConfirm.current.setAttribute("not" , "")
            return false
        }
    }

    return (
        <div className="content-confirm-account">
            <span>ยืนยันการปิดบัญชี</span>
            <input onChange={CheckEmply} ref={Password} placeholder="รหัสผ่านเจ้าหน้าที่" type="password"></input>
            <div className="bt-content">
                <button style={{backgroundColor : "red"}} onClick={close}>ยกเลิก</button>
                <button ref={BtConfirm} not="" onClick={Confirm}>ยืนยัน</button>
            </div>
        </div>
    )
}

export default ManagePopup