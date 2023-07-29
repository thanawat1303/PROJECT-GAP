import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import { DayJSX, Loading, MapsJSX, PopupDom, ReportAction, TimeJSX } from "../../../../../src/assets/js/module";
import "../../assets/style/page/farmer/ManagePopup.scss"

import SelectConvert from "./SelectConvert";

const ManagePopup = ({setPopup , RefPop , resultPage = {
    id_table : "",
    link_user : ""
} , status , session , countLoad , Fecth , RefData}) => {
    const [DetailFarmer , setDetailFarmer] = useState(<></>)
    const [DetailDoctor , setDetailDoctor] = useState(<></>)
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

    useEffect(()=>{
        RefPop.current.style.opacity = "1"
        RefPop.current.style.visibility = "visible"

        FetchCountList(resultPage.link_user , resultPage.id_table)
    } , [])

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
    }

    const FetchData = async (result) => {
        if(result) {
            setLoad(true)
            const resultData = await clientMo.post("/api/doctor/farmer/get/detail" , {id_table : result.id_table , link_user : result.link_user})

            try {
                const data = JSON.parse(resultData)
                if(data.length === 1) {
                    const Detail = data[0]
                    setDetailFarmer(Detail)
                } else {
                    setDetailFarmer([])

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
    const SelectProfile = (e , profile , onClickTap) => {
        if(onClickTap) {
            RefTab.current.childNodes.forEach((val , key)=>{
                val.removeAttribute("select")
            })
            e.target.setAttribute("select" , "")
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

    return(
        <div className="popup-manage">
            <div className="head-popup">
                ข้อมูลเกษตรกร
                { !OpenReport ?
                    <div className="close" onClick={close}>
                        <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                        </svg>
                    </div> : <></>
                }
            </div>
            {
                ReLoadAll ?
                    <></>
                    : 
                    status === "ap" ? 
                        resultDate.length !== 1 ?
                            <div className="tab-content" ref={RefTab}>
                            {
                                resultDate.map((val , key)=>
                                    (key === 0) ?
                                        <div select="" key={key} onClick={(e)=>SelectProfile(e , val , true)} className="tab-select-detail">ล่าสุด</div> :
                                        <div key={key} onClick={(e)=>SelectProfile(e , val , true)} className="tab-select-detail">{key + 1}</div>
                                )
                            }
                            </div> : <></>
                        :
                        <></>
            }
            <div className="option-account" top={resultDate.length !== 1 ? "n" : "y"}>
                <a title="ข้อความจากเกษตรกร" className="list-type">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
                        <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke-width="1.5" stroke-miterlimit="10"/>
                    </svg>
                </a>
                {
                    status === "ap" ? 
                        <>
                        <a title="ข้อมูลเกษตรกร" className="list-type" onClick={(e)=>SelectProfile(e , DetailFarmer , false)}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 11h7v2h-7zm1 4h6v2h-6zm-2-8h8v2h-8zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2zm4-7c1.995 0 3.5-1.505 3.5-3.5S9.995 5 8 5 4.5 6.505 4.5 8.5 6.005 12 8 12z"/>
                            </svg>
                        </a>
                        <a title="ข้อมูลเจ้าหน้าที่" className="list-type" onClick={()=>SelectDoctor(DetailFarmer.id_doctor)}>
                            <svg viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165Zm25-91.5-29,35L76,94c-4.5-3.5-10.5-2.5-14,2s-2.5,10.5,2,14c6,4.5,12.5,9,18.5,13.5,4.5,3,8.5,7.5,14,8,1.5,0,3.5,0,5-1l3-3,22.5-27c4-5,8-9.5,12-14.5,3-4,4-9,.5-13L138,71.5c-3.5-2.5-9.5-2-13,2Z"/>
                            </svg>
                        </a>
                        </> : <></>
                }
            </div>
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
                    // detail
                    <div className="detail-account-data">
                        { TypeDetail === "farmer" ?
                            <></> :
                            <div className="appove-account-head">ผู้ยืนยัน</div>
                        }
                        <div className="img">
                            <img src={TypeDetail === "farmer" ? String.fromCharCode(...DetailFarmer.img.data) : DetailDoctor.img_doctor.data[0] ? String.fromCharCode(...DetailDoctor.img_doctor.data) : "/doctor-svgrepo-com.svg"}></img>
                        </div>
                        <div className="text-detail">
                            <span>{TypeDetail === "farmer" ? "รหัสประจำตัวเกษตรกร : " : "รหัสประจำตัวเจ้าหน้าที่ : "}</span>
                            <div className="frame-text">
                                <input  onChange={status === "ap" ? null : CheckEmply} defaultValue={TypeDetail === "farmer" ? DetailFarmer.id_farmer : DetailDoctor.id_doctor} readOnly={status === "ap" ? true : false} ref={status === "ap" ? null : RefOnType.FarmerID} placeholder={status === "ap" ? null : "กรอกรหัสประจำตัว"}></input>
                            </div>
                        </div>
                        {
                            TypeDetail === "farmer" ? 
                                <div className="text-detail">
                                    <span>วันที่สมัคร :</span>
                                    <div className="frame-text">
                                        <DayJSX DATE={DetailFarmer.date_register} TYPE="small"/>
                                        <TimeJSX DATE={DetailFarmer.date_register} MAX={false}/>
                                    </div>
                                </div> : <></>
                        }
                        <div className="text-detail">
                            <span>{"ชื่อ - นามสกุล : "}</span>
                            <div className="frame-text">
                                {TypeDetail === "farmer" ? DetailFarmer.fullname : DetailDoctor.fullname_doctor}
                            </div>
                        </div>
                        {
                            TypeDetail === "farmer" ?
                                <div className="text-detail">
                                    <span>{"ที่อยู่ :"}</span>
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
                                        <div className="close-account">
                                            <button onClick={()=>CloseAccount(DetailFarmer)}>ปิดบัญชี</button>
                                        </div> : <></>
                                }
                                </>
                                : <></>
                        }
                    </div>
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
                    </div> : <></>
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

// const PopupConfirmAction = ({Ref , setPopup , session , DetailFarmer , id_table_convert , 
//     setReload , FetchCountList , FetData , CountFetch , type}) => {

//     const BtConfirm = useRef()
//     const Password = useRef()
    
//     useEffect(()=>{
//         Ref.current.style.opacity = "1"
//         Ref.current.style.visibility = "visible"
//     } , [])

//     const Confirm = async () => {
//         if(CheckEmply()) {
//             const result = (type === "cancel") ? 
//                                 await clientMo.post("/api/doctor/farmer/convert/cancel" , {
//                                     id_table : DetailFarmer.id_table,
//                                     password : Password.current.value
//                                 })
//                                 :
//                                 await clientMo.post("/api/doctor/farmer/convert/comfirm" , {
//                                     id_table : DetailFarmer.id_table,
//                                     uid_line : DetailFarmer.uid_line,
//                                     id_table_convert : id_table_convert,
//                                     password : Password.current.value
//                                 })

//             if (result === "password") {
//                 Password.current.value = ""
//                 Password.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
//             } else if(result === "over") {

//             } else if (result) {
//                 setReload(true)
//                 close()
//                 await FetchCountList(result , id_table_convert)
//                 await FetData(CountFetch)
//             } else session()
//         }
//     }

//     const close = () => {
//         Ref.current.style.opacity = "0"
//         Ref.current.style.visibility = "hidden"

//         setTimeout(()=>{
//             setPopup(<></>)
//         })
//     }

//     const CheckEmply = () => {
//         const pw = Password.current

//         if(pw.value) {
//             BtConfirm.current.removeAttribute("not")
//             return true
//         }
//         else {
//             BtConfirm.current.setAttribute("not" , "")
//             return false
//         }
//     }

//     return (
//         <div className="content-confirm-account">
//             <span>ยืนยันการยกเลิก</span>
//             <input onChange={CheckEmply} ref={Password} placeholder="รหัสผ่านเจ้าหน้าที่" type="password"></input>
//             <div className="bt-content">
//                 <button style={{backgroundColor : "red"}} onClick={close}>ยกเลิก</button>
//                 <button ref={BtConfirm} not="" onClick={Confirm}>ยืนยัน</button>
//             </div>
//         </div>
//     )
// }

export default ManagePopup