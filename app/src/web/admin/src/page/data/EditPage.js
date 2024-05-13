import React, { useContext, useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../assets/js/moduleClient";

import "../../assets/style/page/PopupManage.scss"
import { GetLinkUrlOfSearch, Loading, MapsJSX, ReportAction } from "../../../../../assets/js/module";
import { AdminProvider } from "../../main";
import Locals from "../../../../../locals";
const EditPage = ({RefOnPage , id_table , type , setBecause , TabOn , session , ReloadData}) => {
    const { lg } = useContext(AdminProvider)
    
    const [LoadingStatus , setLoading] = useState(true)

    const [ScreenW , setScreenW] = useState(window.innerWidth)
    const [ScreenH , setScreenH] = useState(window.innerHeight)

    const [getHide , setHide] = useState(true)
    const [getTime , setTime] = useState(0)

    const [getTimeOut , setTimeOut] = useState(0)
    const [getTimeOutChange , setTimeOutChange] = useState(0)
    const [getLag , setLag] = useState(0)
    const [getLng , setLng] = useState(0)

    const [Open , setOpen] = useState(0)
    const [Text , setText] = useState("")
    const [Status , setStatus] = useState(0)

    const NameRef = useRef()
    const OtherRef = useRef()
    const PasswordRef = useRef()

    const [Data , setData] = useState({
        id : "", 
        name : "",
        dataOther : null
    })

    useEffect(()=>{
        RefOnPage.current.style.opacity = "1"
        RefOnPage.current.style.visibility = "visible"

        TabOn.addTimeOut(TabOn.end())

        FecthData()

        window.removeEventListener("resize" , setSizeScreen)
        window.addEventListener("resize" , setSizeScreen)
        return()=>{
            clearTimeout(getTimeOut)
            clearTimeout(getTime)
            window.removeEventListener("resize" , setSizeScreen)
        }
    } , [])

    const FecthData = async () => {
        let data = await clientMo.post("/api/admin/data/get" , {id : id_table , type : type})
        data = JSON.parse(data).map((val)=>val)[0]
        setData({
            id : data.id,
            name : data.name,
            dataOther : type === "plant" ? data.type_plant : type === "station" ? data.location : ""
        })

        if(type === "station") {
            setLag(data.location.x)
            setLng(data.location.y)
        }

        setLoading(false)
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
        const Validate = validateValue()
        if(Validate) {
            setOpen(1)
            const result = await clientMo.post("/api/admin/data/edit" , Validate)
            if(result === "133") {
                setText(`${ lg === "th" ? Locals[lg]["edit"] : `${Locals[lg]["edit"]} ` }${type === "plant" ? Locals[lg]["plant_type"] : type === "station" ? Locals[lg]["__station"] : ""}${ lg === "th" ? Locals[lg]["success"] : ` ${Locals[lg]["success"]}` }`)
                setStatus(1)
            } else if(result === "over") {
                setText(`${type === "plant" ? Locals[lg]["plant_type"] : type === "station" ? Locals[lg]["__station"] : ""}${lg === "th" ? Locals[lg]["use"] : ` ${Locals[lg]["use"]}`}`)
                setStatus(3)
            } else if(result === "because") {
                setText(Locals[lg]["err_server"])
                setStatus(3)
            } else if(result === "password") {
                setText(Locals[lg]["err_password"])
                setStatus(3)
                PasswordRef.current.value = ""
            } else {
                setOpen(0)
                session()
            }
        }
    }

    const validateValue = () => {
        const name = NameRef.current
        const Location = OtherRef.current.value.split(":")
        const password = PasswordRef.current

        if(( ( name.value != Data.name ) || (Location[0] != Data.dataOther.x || Location[1] != Data.dataOther.y) ) && password.value) {
            setHide(false)
            const DataReturn = {
                id_table : Data.id,
                update : {
                    name : `"${name.value.trim()}"`,
                    location : `POINT(${getLag} , ${getLng})` ,
                },
                password : password.value,
                type : type
            }

            if(name.value == Data.name) delete DataReturn.update.name;
            if(Location[0] == Data.dataOther.x && Location[1] == Data.dataOther.y) {
                delete DataReturn.update.location;
            }
            return DataReturn
        } else {
            setHide(true)
            return false
        }
    }

    const GenerateMap = async (e) => {
        return await new Promise((resole , reject)=>{
            clearTimeout(getTimeOut)
            if(e.target.value) {
                setTimeOut(setTimeout( async ()=>{
                    let valueLocation = await GetLinkUrlOfSearch(e.target.value , "admin")
                    if(!isNaN(valueLocation[0]) && !isNaN(valueLocation[1])) {
                        setLag(valueLocation[0])
                        setLng(valueLocation[1])
                    }
                    resole()
                } , 2000))
            } else {
                setLag(Data.dataOther.x)
                setLng(Data.dataOther.y)
                resole()
            }
        })
    }

    const AfterConfirm = () => {
        if(Status === 1) {
            close()
            ReloadData()
        }
        else {
            if(Status != 0) {
                setOpen(0)
                setTime(setTimeout(()=>{
                    setText("")
                    setStatus(0)
                } , 500))
            }
        }
    }

    return (
        <>
        <ReportAction Open={Open} Text={Text} Status={Status} 
                        setOpen={setOpen} setText={setText} setStatus={setStatus}
                        sizeLoad={90}
                        BorderLoad={10}
                        color="#1CFFF1" action={AfterConfirm}/>
        <div className="manage-page">
            <div className="head-page">
                {`${ lg === "th" ? Locals[lg]["edit"] : `${Locals[lg]["edit"]} ` }${type === "plant" ? Locals[lg]["plant_type"] : type === "station" ? Locals[lg]["__station"] : ""}`}
            </div>
            <div className="detail-content">
                {LoadingStatus ? 
                    <div className="Loading">
                        <Loading size={4/100 * ScreenW >= 41 ? 4/100 * ScreenW : 41} border={0.5/100 * ScreenW >= 5 ? 0.5/100 * ScreenW : 5} color="#1CFFF1" animetion={LoadingStatus}/>
                        <span>{lg === "th" ? Locals[lg]["loadingData"] : `${Locals[lg]["loadingData"]} `}{type === "plant" ? Locals[lg]["plant_type"] : type === "station" ? Locals[lg]["__station"] : ""}</span>
                    </div>
                    : <></>
                }
                <div className="detail-data-report">
                    <div className="data-popup" maxsize="" flex={type}>
                        <div className="name column">
                            {type === "plant" ? <span className={type}>{Locals[lg]["plant_name"]}</span> : <span className={type}>{Locals[lg]["ชื่อศูนย์ส่งเสริม"]}</span>}
                            <input onChange={()=>validateValue()} className="input-value" ref={NameRef} placeholder="กรอกข้อมูล" defaultValue={Data.name}></input>
                        </div>
                        <div className={type === "plant" ? "type_plant" : "location column"}>
                            {
                                type === "plant" ? <span>{Locals[lg]["plant_type"]}</span> : <></>
                            }
                            {
                                type === "plant" ? <div>{Data.dataOther}</div> :
                                Data.dataOther ? 
                                    <>
                                    <div className="flied-location-edit" w={type}>
                                        <span className="head-flied">{Locals[lg]["map_local"]}</span>
                                        <input onChange={ async (e)=>{
                                            clearTimeout(getTimeOutChange)
                                            await GenerateMap(e)
                                            setTimeOutChange(setTimeout(()=>{
                                                validateValue()
                                            } , 1))
                                        }} className="input-value" placeholder={Locals[lg]["link_google_map"]}></input>
                                        <input ref={OtherRef} hidden value={`${getLag}:${getLng}`} readOnly></input>
                                    </div>
                                    <MapsJSX lat={getLag} lng={getLng} w={"300vw"} h={"80vw"}/>
                                    </>
                                    : 
                                    <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-manage">
                <label className="column">
                    <span>{Locals[lg]["admin_password_short"]}</span>
                    <input onChange={()=>validateValue()} placeholder={Locals[lg]["please_password"]} ref={PasswordRef} type="password" className="input-text input-pw"></input>
                </label>
                <div className="bt-manage">
                    <button onClick={close} className="close">{Locals[lg]["cancel"]}</button>
                    { Data.id ?
                        <button onClick={Submit} h={getHide ? "" : null} className="submit">{Locals[lg]["confirm"]}</button> : <></>
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default EditPage