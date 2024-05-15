import React, { useContext, useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../assets/js/moduleClient";

import { GetLinkUrlOfSearch, LoadOtherOffset, MapsJSX, ReportAction, TimeDiff } from "../../../../assets/js/module";

import ShowBecause from "./doctor/ShowBecause";

import ManageDoctorPage from "./doctor/ManagePage";
import ManageDataPage from "./data/ManagePage";
import EditPage from "./data/EditPage";
import Locals from "../../../../locals";
import { AdminProvider } from "../main";

const ListData = ({socket , status , PageAddRef , auth , session , TabOn , HrefPage , setStateOnPage , modify , textSearch}) => {
    // const [Body , setBody] = useState(<></>)
    // const [List , setList] = useState(<></>)

    const { lg } = useContext(AdminProvider)

    const [DataFetch , setDataFetch] = useState([])
    const [Because , setBecause] = useState(<></>)
    // const [ShBecause , setShBecause] = useState(<></>)

    const [ListCount , setListCount] = useState(0)
    const [getVerifyStart , setVerifyStart] = useState(false)
    const [RowList , setRowList] = useState(5)
    const [getInterval , setIntervalTime] = useState(0)

    const RefBe = useRef()
    // const ShowBecause = useRef()

    useEffect(()=>{
        if(status.changePath) window.history.pushState({} , "" , `/admin/${HrefPage.get().split("?")[0]}?${status.status}`)

        removePopup()
        fetchDataList(0 , 5)
        setVerifyStart(true)

        return(()=>{
            socket.emit("unconnect-doctor-list")
            socket.removeListener("update-online")
        })
    } , [status])

    useEffect(()=>{
        if(getVerifyStart) { fetchDataList( 0 , RowList , textSearch) }
    } , [textSearch])

    const removePopup = () => {
        if(RefBe.current) {
            RefBe.current.removeAttribute("style")
            setTimeout(()=>{
                setBecause(<></>)
            } , 500)
        }
    }

    const fetchDataList = async (StartRow , Limit , textSearch = "") => {
        socket.emit("unconnect-doctor-list")
        socket.removeListener("update-online")
        clearInterval(getInterval)

        const ObjectData = 
                HrefPage.get().split("?")[0] === "list" ? await clientMo.post("/api/admin/doctor/list" , {
                    typeDelete : (status.status === "default" ? 0 : status.status === "delete" ? 1 : -1) , 
                    limit : Limit ? Limit : 10,
                    startRow : StartRow,
                    textSearch : textSearch
                }) :
                HrefPage.get().split("?")[0] === "data" ? await clientMo.post("/api/admin/data/list" , {
                    type : status.status,
                    limit : Limit ? Limit : 10,
                    startRow : StartRow,
                    textSearch : textSearch
                }) : null

        if(ObjectData) {
            const List = JSON.parse(ObjectData)
            let DataSocket = []
            // console.log(List)
            if(StartRow != 0) {
                setDataFetch([...DataFetch , ...List])
                setRowList([...DataFetch , ...List].length)
                DataSocket = [...DataFetch , ...List]
            } else {
                setDataFetch(List)
                DataSocket = List
            }
            
            modify(70 , 30 , 
                [Locals[lg]["home"] , 
                    (HrefPage.get().split("?")[0] === "list") ? Locals[lg]["account_doctor"] : 
                    (HrefPage.get().split("?")[0] === "data") ? Locals[lg]["information"] : "" 
                    ,
                    (HrefPage.get().indexOf("delete") >= 0) ? Locals[lg]["account_delete"] : 
                    (HrefPage.get().indexOf("plant") >= 0) ? Locals[lg]["plant_list"] :
                    (HrefPage.get().indexOf("station") >= 0) ? Locals[lg]["station_list"] : ""
                ])
            setStateOnPage({status : status.status})

            if(HrefPage.get().split("?")[0] === "list" && status.status === "default") {
                socket.emit("connect-doctor-list")
                socket.on("update-online" , (id_table , newTimeSocket)=>{
                    const newList = DataSocket.map((DataList)=>{
                        if(DataList.id_table_doctor == id_table) {
                            DataList.time_online = isNaN(newTimeSocket) ? newTimeSocket : "offline"
                        }
                        return DataList
                    })
                    setDataFetch(newList)
                })

                // setInterval(()=>{
                //     setDataFetch(DataSocket.map((DataList)=>{
                //         DataList.timeStamp = new Date().getTime()
                //         return DataList
                //     }))
                // } , 2000)
            }
            return List
        } else {
            session()
            return 0
        }
    }

    useEffect(()=>{
        modify(70 , 30 , 
            [Locals[lg]["home"] , 
                (HrefPage.get().split("?")[0] === "list") ? Locals[lg]["account_doctor"] : 
                (HrefPage.get().split("?")[0] === "data") ? Locals[lg]["information"] : "" 
                ,
                (HrefPage.get().indexOf("delete") >= 0) ? Locals[lg]["account_delete"] : 
                (HrefPage.get().indexOf("plant") >= 0) ? Locals[lg]["plant_list"] :
                (HrefPage.get().indexOf("station") >= 0) ? Locals[lg]["station_list"] : ""
            ])
    } , [lg])

    return(
        <section className="body-list-manage">
            {
                status.status === "default" || status.status === "plant" || status.status === "station" ? 
                <InsertPage PageAddRef={PageAddRef} ReloadAccount={()=>fetchDataList(0 , DataFetch.length)} type={status.status}/> : <></>
            }
            <div className="List-data">
                <ManageList socket={socket} Data={DataFetch} setBecause={setBecause} ListCount={ListCount} setListCount={setListCount} 
                                    TabOn={TabOn} HrefPage={HrefPage} status={status} 
                                    auth={auth} session={session} RefBe={RefBe} Fetch={()=>fetchDataList(0 , DataFetch.length)}/>
            </div>
            <div className="load-other" style={{
                padding : "5px 0px"
            }}>
                <LoadOtherOffset Fetch={fetchDataList} Data={DataFetch} setRow={setRowList} Limit={5} style={{
                    backgroundColor : "#22C7A9" 
                }}/>
            </div>
            <div ref={RefBe} className="page-because-popup">
                {Because}
            </div>
        </section>
    )
}

const ManageList = ({socket , Data , setBecause , ListCount , setListCount , TabOn , HrefPage , status , auth , RefBe , session , Fetch}) => {
    const [List , setList] = useState(<></>)
    const { lg } = useContext(AdminProvider)

    useEffect(()=>{
        setList(<></>)

        manageList()
        // LoadPageData()

        window.removeEventListener("resize" , sizeScreen)
        window.addEventListener("resize" , sizeScreen)

        return() => {
            window.removeEventListener("resize" , sizeScreen)
        }
    } , [Data])

    useEffect(()=>{
        manageList()
    } , [lg])

    const sizeScreen = () => {
        if(window.innerWidth < 820) {
            setBodyFromData(1)
        } else if(window.innerWidth < 1100) {
            setBodyFromData(2)
        } else if (window.innerWidth >= 1100) {
            setBodyFromData(3)
        }
    }

    const setBodyFromData = async (maxC) => {
        TabOn.addTimeOut(TabOn.end())
        manageList(maxC)
    }

    const OpenConfirmDoctor = async (id_table_doctor , typeStatus) => {
        if(await auth(true)) {
            const status = parseInt(document.querySelector(`#data-list-content-${id_table_doctor} action-bt bt-status .frame`).getAttribute("status"))
            setBecause(<ManageDoctorPage RefOnPage={RefBe} id_table={id_table_doctor} type={typeStatus} status={status} 
                        setBecause={setBecause} TabOn={TabOn} session={session} ReloadFetch={Fetch}/>)
        }
    }

    const OpenConfirmData = async (id , typeStatus) => {
        if(await auth(true)) {
            const status = parseInt(document.querySelector(`#data-list-content-${id} action-bt bt-status .frame`).getAttribute("status"))
            setBecause(<ManageDataPage RefOnPage={RefBe} id_table={id} type={typeStatus} status={status} setBecause={setBecause} TabOn={TabOn} session={session} ReloadData={Fetch}/>)
        }
    }

    const OpenEditData = async (id , typeStatus) => {
        if(await auth(true)) {
            const status = parseInt(document.querySelector(`#data-list-content-${id} action-bt bt-status .frame`).getAttribute("status"))
            setBecause(<EditPage RefOnPage={RefBe} id_table={id} type={typeStatus} setBecause={setBecause} TabOn={TabOn} session={session} ReloadData={Fetch}/>)
        }
    }

    const OpenDetailManage = async (id_table_doctor , typeStatus) => {
        if(await auth(true)) {
            setBecause(<ShowBecause RefOnPage={RefBe} id_table={id_table_doctor} type={typeStatus} TabOn={TabOn} setBecause={setBecause}/>)
        }
    }

    const manageList = () => {
        const doctorList = Data.map((data , key)=>
            <list-data-body key={key} 
                id={`data-list-content-${
                    HrefPage.get().split("?")[0] === "list" ? data.id_table_doctor :
                    HrefPage.get().split("?")[0] === "data" ? data.id : ""
                }`} 
                status={status.status}>
                {
                    HrefPage.get().split("?")[0] === "list" ?
                    <>
                        {
                            status.status === "default" ? 
                                <div className="status-online">
                                    <div className="text-online" style={ data.time_online === "online" ? {backgroundColor : "#00ff3c"} : {}}>
                                        {
                                            data.time_online ? 
                                            data.time_online === "online" ? Locals[lg]["online"]
                                            : data.time_online === "offline" ? Locals[lg]["offline"]
                                            : <TimeDiff DATE={parseInt(data.time_online)} DivInput={false} textPresent={`${Locals[lg]["use_after"]} `}/>
                                            : Locals[lg]["not_login"]
                                        }
                                    </div>
                                </div> : <></>
                        }
                        <detail-data-main>
                            <detail-Image>
                                <img src={data.img_doctor ? data.img_doctor : "/doctor-svgrepo-com.svg"}></img>
                            </detail-Image>
                            <detail-data>
                                <detail-in-fullname>
                                    <span>{data.fullname_doctor ? data.fullname_doctor : Locals[lg]["not_name"]}</span>
                                </detail-in-fullname>
                                <detail-in>
                                    <span className="head-data">{Locals[lg]["id"]}</span>
                                    <div className="text-data">{data.id_doctor}</div>
                                </detail-in>
                                <detail-in>
                                    <span className="head-data">{Locals[lg]["stationing"]}</span>
                                    <div className="text-data">{data.station ? data.station : Locals[lg]["station_anonymous"]}</div>
                                </detail-in>
                            </detail-data>
                        </detail-data-main>
                        <action-bt>
                            { status.status === "default" ? 
                                <>
                                <content-status because={1}>
                                    <bt-because>
                                        <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_account")}>{Locals[lg]["reason"]}</button>
                                    </bt-because>
                                    <bt-status onClick={()=>OpenConfirmDoctor(data.id_table_doctor , "status_account")}>
                                        <div className="frame" status={data.status_account ? "1" : "0"}>
                                            <span>ON</span>
                                            <span className="dot"></span>
                                            <span>OFF</span>
                                        </div>
                                    </bt-status>
                                </content-status>
                                <bt-delete>
                                    <button onClick={()=>OpenConfirmDoctor(data.id_table_doctor , "status_delete")}>{Locals[lg]["delete_account"]}</button>  
                                </bt-delete>
                                </> : 
                                status.status === "delete" ?
                                <content-status because={0} delete="">
                                    <bt-because>
                                        <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_delete")}>{Locals[lg]["reason"]}</button>
                                    </bt-because>
                                </content-status> : <></>
                            }
                        </action-bt>
                    </> :
                    HrefPage.get().split("?")[0] === "data" ?
                    <>
                        <detail-data-main column="">
                            <detail-data maxsize="" flex={status.status}>
                                <div className="name" w={status.status}>
                                    { status.status === "plant" ?
                                        <span className={status.status}>{Locals[lg]["plant_name"]}</span> : <></>

                                    }
                                    <div className={`text-data ${status.status}`}>{data.name}</div>
                                </div>
                                <div className={status.status === "plant" ? "type_plant" : "location"}>
                                    {
                                        status.status === "plant" ? <span>{Locals[lg]["plant_category"]}</span> : <></>
                                    }
                                    {
                                        status.status === "plant" ? <div className="text-data">{data.type_plant}</div> :
                                        status.status === "station" ? 
                                            <MapsJSX lat={data.location.x} lng={data.location.y} w={"300vw"} h={"100vw"}/> : ""
                                    }
                                </div>
                            </detail-data>
                            { status.status === "plant" ?
                                <detail-data maxsize="">
                                    <div className="name">
                                        <span className={status.status}>{Locals[lg]["count_day_success"]}</span>
                                        <div className={`text-data`}>{`${data.qty_harvest} ${Locals[lg]["day"]}`}</div>
                                    </div>
                                </detail-data>
                                : <></>
                            }
                        </detail-data-main>
                        <action-bt>
                            <content-status because={0}>
                                { status.status === "station" ? 
                                    <div className="edit-bt" onClick={()=>OpenEditData(data.id , status.status)}>
                                        {Locals[lg]["edit"]}
                                    </div> 
                                : <></>
                                }
                                <bt-status 
                                    onClick={()=>OpenConfirmData(data.id , status.status)}
                                    >
                                    <div className="frame" status={data.is_use}>
                                        <span>ON</span>
                                        <span className="dot"></span>
                                        <span>OFF</span>
                                    </div>
                                </bt-status>
                            </content-status>
                        </action-bt>
                    </> : <></>
                }
                
            </list-data-body>
        )
        
        TabOn.addTimeOut(TabOn.end())
        setList(doctorList.length ? doctorList : <div style={{font : "900 18px Sans-font"}}>{Locals[lg]["not_data"]}</div>)
    }

    return (List)
}

const InsertPage = ({PageAddRef , ReloadAccount , type}) => {

    const { lg } = useContext(AdminProvider)

    const [Open , setOpen] = useState(0)
    const [Text , setText] = useState("")
    const [Status , setStatus] = useState(0)

    const [sizeReport , setSize] = useState(0)

    const pwAdmin = useRef()

    const [Lag , setLag] = useState(0)
    const [Lng , setLng] = useState(0)
    const InputMap = useRef()

    const RefData = {
        Data1 : useRef(),
        Data2 : useRef(),
        Data3 : useRef()
    }
    const QtyDate = useRef()
    const [stateOnBt , setstateOnBt] = useState(true)

    useEffect(()=>{
        // setSize(PageAddRef.current.clientHeight * 0.3)

        if(type === "station") GenerateMapAuto()
    } , [])

    const CheckEmply = () => {
        const RefIsCheck = type === "default" ?
                            [
                                RefData.Data1.current.value,
                                RefData.Data2.current.value,
                            ] : 
                            type === "station" ? 
                            [
                                RefData.Data1.current.value,
                                RefData.Data2.current.value,
                                RefData.Data3.current.value,
                            ] : 
                            type === "plant" ? 
                            [
                                QtyDate.current.value,
                                RefData.Data1.current.value,
                                RefData.Data2.current.value,
                            ] : []

        if(RefIsCheck.filter(val=>!val).length == 0 && pwAdmin.current.value) {
            setstateOnBt(false)
            return (
                type === "station" ? {
                    name : RefData.Data1.current.value,
                    lat : RefData.Data2.current.value,
                    lng : RefData.Data3.current.value,
                    type : type,
                    passwordAd : pwAdmin.current.value
                } : 
                type === "default" ? {
                    id_doctor : RefData.Data1.current.value,
                    passwordDT : RefData.Data2.current.value,
                    passwordAd : pwAdmin.current.value
                } : 
                type === "plant" ? {
                    name : RefData.Data1.current.value,
                    type_plant : RefData.Data2.current.value,
                    qtyDate : QtyDate.current.value,
                    type : type ,
                    passwordAd : pwAdmin.current.value
                } : {}
            )
        } else {
            setstateOnBt(true)
            return false
        }
        
    }

    const ClickAdd = async (e) => {
        const Data = CheckEmply()
        if(Data) {
            setOpen(1)
            setText("")
            setStatus(0)
            let result = 
                    type === "default" ? await clientMo.post("/api/admin/add" , Data) :
                    type === "plant" || type === "station" ? await clientMo.post("/api/admin/data/insert" , Data) : ""
            if(result === "1") {
                setText(`${lg === "th" ? Locals[lg]["add"] : `${Locals[lg]["add"]} `}${
                            type === "default" ? Locals[lg]["__account_doctor"] : 
                            type === "plant" ? Locals[lg]["plant_type"] : 
                            type === "station" ? Locals[lg]["__station"] : ""
                        }${lg === "th" ? Locals[lg]["success"] : ` ${Locals[lg]["success"]}`}`)
                setStatus(1)
                Cancel()
                setTimeout(()=>{
                    ReloadAccount()
                } , 100)
            }
            else if(result === "incorrect") {
                setText(Locals[lg]["admin_password_incorrect"])
                setStatus(2)
                pwAdmin.current.value = ""
            } else if (result === "overflow") {
                setText(`${ lg === "th" ? Locals[lg]["found"] : `${Locals[lg]["found"]} ` }${
                            type === "default" ? Locals[lg]["__account_doctor"] : 
                            type === "plant" ? Locals[lg]["plant_type"] : 
                            type === "station" ? Locals[lg]["__station"] : ""
                        }`)
                setStatus(2)
                Cancel()
                setTimeout(()=>{
                    ReloadAccount()
                } , 100)
            }
            else {
                setText(Locals[lg]["error_add_data"])
                setStatus(2)
            }
        }
        setstateOnBt(true)
        e.preventDefault()
    }

    const Cancel = (e) => {
        let Data1 = RefData.Data1.current
        let Data2 = RefData.Data2.current
        let Data3 = RefData.Data3.current
        let Qty = QtyDate.current
        let PWadmin = pwAdmin.current

        Data1 && (Data1.value = "");
        Data2 && (Data2.value = "");
        Data3 && (Data3.value = "");
        Qty && (Qty.value = "");
        PWadmin.value = ""
        if(type === "station") {
            InputMap.current.value = ""
            setLag(0)
            setLng(0)
        }

        if(e) PageAddRef.current.toggleAttribute("show")
    }

    const GenerateMap = async (e) => {

        let valueLocation = await GetLinkUrlOfSearch(e.target.value , "admin")
        if(!isNaN(valueLocation[0]) && !isNaN(valueLocation[1])) {
            setLag(valueLocation[0])
            setLng(valueLocation[1])
        }
    }

    const GenerateMapAuto = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                setLag(0)
                setLng(0)
                setTimeout(()=>{
                    setLag(position.coords.latitude)
                    setLng(position.coords.longitude)
                } , 1000)
            })
        }
    }

    return(
        <section ref={PageAddRef} className="page-insert">
            <div className="Load-insert">
                <ReportAction Open={Open} Text={Text} Status={Status}
                    setOpen={setOpen} setStatus={setStatus} setText={setText}
                    sizeLoad={73} BorderLoad={8} color={"white"}/>
            </div>
            <div className="body-page">
                <span className="head">
                    {   
                        type === "default" ? Locals[lg]["add_doctor"] :
                        type === "plant" ? Locals[lg]["add_plant"] :
                        type === "station" ? Locals[lg]["add_station"] : ""
                    }
                </span>
                <div className="detail-data">
                    <label className={type === "plant" ? "two-box" : null}>
                        <div className="field-text">
                            <span className="head-text">
                                { 
                                    type === "default" ?
                                        Locals[lg]["doctor_id"] :
                                    type === "plant" ?
                                        Locals[lg]["plant_name"] :
                                    type === "station" ?
                                        Locals[lg]["station_name"] 
                                    : <></>
                                }
                            </span>
                            <input onChange={CheckEmply} ref={RefData.Data1} 
                                    placeholder={
                                        type === "default" ? Locals[lg]["please_id"] : 
                                        type === "plant" ? Locals[lg]["exam_tomato"] :
                                        type === "station" ? Locals[lg]["exam_royal"] : ""
                                    }></input>
                        </div>
                        { type === "plant" ?
                            <div className="field-text">
                                <span className="head-text">{Locals[lg]["__plant_category"]}</span>
                                <select onChange={CheckEmply} ref={RefData.Data2} defaultValue={""} style={{width : "100%"}}>
                                    <option value={""} disabled>{Locals[lg]["select_plant_category"]}</option>
                                    <option value={"พืชผัก"}>พืชผัก</option>
                                    <option value={"สมุนไพร"}>สมุนไพร</option>
                                </select>
                            </div>
                            : <></>
                        }
                    </label>
                    {
                        type === "default" ?
                            <>
                                <label>
                                    <div className="field-text">
                                        <span className="head-text">{Locals[lg]["doctor_password"]}</span>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/></svg> */}
                                        <input onChange={CheckEmply} ref={RefData.Data2} placeholder={Locals[lg]["please_password"]} type="password"></input>
                                    </div>
                                </label>
                            </> :
                        type === "plant" ?
                            <label>
                                <div className="field-text">
                                    <span className="head-text">{Locals[lg]["count_day_success"]}</span>
                                    <input onChange={CheckEmply} ref={QtyDate} placeholder={`${Locals[lg]["ex"]} 10 , 30`} type="number"></input>
                                </div>
                            </label> : 
                        type === "station" ?
                            <>
                                <label>
                                    {/* <svg fill="white" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
                                        width="1em" height="1em" viewBox="0 0 395.71 395.71"
                                        >
                                        <g>
                                            <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738
                                                c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388
                                                C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191
                                                c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
                                        </g>
                                    </svg> */}
                                    <div className="field-text">
                                        <span className="head-text">{Locals[lg]["link_google_map"]}</span>
                                        <input ref={InputMap} placeholder={Locals[lg]["url_red_marker"]} type="text" onChange={CheckEmply} onInput={GenerateMap}></input>
                                    </div>
                                </label>
                                <label className="station">
                                    <div className="field-text">
                                        <input style={{display : "none"}} readOnly ref={RefData.Data2} value={Lag}></input>
                                        <input style={{display : "none"}} readOnly ref={RefData.Data3} value={Lng}></input>
                                        <MapsJSX lat={Lag} lng={Lng} w={"100%"}/>
                                        <button onClick={GenerateMapAuto}>{Locals[lg]["reload_map"]}</button>
                                    </div>
                                </label>
                            </> :
                            <></>
                    }
                </div>
                <label className="admin-confirm">
                    <input ref={pwAdmin} onChange={CheckEmply} placeholder={Locals[lg]["admin_password"]} type="password"></input>
                </label>
                <div className="bt-submit">
                    <button className="cancel" onClick={Cancel}>{Locals[lg]["cancel"]}</button>
                    <button className="submit" onClick={ClickAdd} no={stateOnBt ? "" : null}>{Locals[lg]["add_data"]}</button>
                </div>
            </div>
        </section>
    )
}

export default ListData