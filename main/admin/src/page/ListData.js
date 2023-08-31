import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import { GetLinkUrlOfSearch, LoadOtherOffset, MapsJSX, ReportAction } from "../../../../src/assets/js/module";

import ShowBecause from "./doctor/ShowBecause";

import ManageDoctorPage from "./doctor/ManagePage";
import ManageDataPage from "./data/ManagePage";

const ListData = ({status , PageAddRef , auth , session , TabOn , HrefPage , setStateOnPage , modify}) => {
    // const [Body , setBody] = useState(<></>)
    // const [List , setList] = useState(<></>)

    const [DataFetch , setDataFetch] = useState([])
    const [Because , setBecause] = useState(<></>)
    // const [ShBecause , setShBecause] = useState(<></>)

    const [ListCount , setListCount] = useState(0)
    const [RowStart , setRowStart] = useState(0)
    const RefBe = useRef()
    // const ShowBecause = useRef()

    useEffect(()=>{
        if(status.changePath) window.history.pushState({} , "" , `/admin/${HrefPage.get().split("?")[0]}?${status.status}`)

        removePopup()
        fetchDataList(0 , 5)

    } , [status])

    const removePopup = () => {
        if(RefBe.current) {
            RefBe.current.removeAttribute("style")
            setTimeout(()=>{
                setBecause(<></>)
            } , 500)
        }
    }

    const fetchDataList = async (StartRow , Limit) => {
        const ObjectData = 
                HrefPage.get().split("?")[0] === "list" ? await clientMo.post("/api/admin/doctor/list" , {
                    typeDelete : (status.status === "default" ? 0 : status.status === "delete" ? 1 : -1) , 
                    limit : Limit,
                    startRow : StartRow
                }) :
                HrefPage.get().split("?")[0] === "data" ? await clientMo.post("/api/admin/data/list" , {
                    type : status.status,
                    limit : Limit,
                    startRow : StartRow
                }) : null

        if(ObjectData) {
            const List = JSON.parse(ObjectData)
            if(StartRow != 0) {
                setDataFetch([...DataFetch , ...List])
                setRowStart([...DataFetch , ...List].length)
            } else
                setDataFetch(List)
            
            modify(70 , 30 , 
                ["หน้าแรก" , 
                    (HrefPage.get().split("?")[0] === "list") ? "บัญชีเจ้าหน้าที่ส่งเสริม" : 
                    (HrefPage.get().split("?")[0] === "data") ? "ข้อมูลเพิ่มเติม" : "" 
                    ,
                    (HrefPage.get().indexOf("delete") >= 0) ? "บัญชีที่ถูกลบ" : 
                    (HrefPage.get().indexOf("plant") >= 0) ? "ชนิดพืช" :
                    (HrefPage.get().indexOf("station") >= 0) ? "ศูนย์ส่งเสริม" : ""
                ])
            setStateOnPage({status : status.status})
            return List
        } else {
            session()
            return 0
        }
    }

    return(
        <section className="body-list-manage">
            {
                status.status === "default" || status.status === "plant" || status.status === "station" ? 
                <InsertPage PageAddRef={PageAddRef} ReloadAccount={()=>fetchDataList(0 , DataFetch.length)} type={status.status}/> : <></>
            }
            <div className="List-data">
                <ManageList Data={DataFetch} setBecause={setBecause} ListCount={ListCount} setListCount={setListCount} 
                                    TabOn={TabOn} HrefPage={HrefPage} status={status} 
                                    auth={auth} session={session} RefBe={RefBe} Fetch={()=>fetchDataList(0 , DataFetch.length)}/>
            </div>
            <div className="load-other" style={{
                padding : "5px 0px"
            }}>
                <LoadOtherOffset Fetch={fetchDataList} Data={DataFetch} setRow={setRowStart} Limit={5} style={{
                    backgroundColor : "#22C7A9" 
                }}/>
            </div>
            <div ref={RefBe} className="page-because-popup">
                {Because}
            </div>
        </section>
    )
}

const ManageList = ({Data , setBecause , ListCount , setListCount , TabOn , HrefPage , status , auth , RefBe , session , Fetch}) => {
    const [List , setList] = useState(<></>)

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

    const sizeScreen = () => {
        if(window.innerWidth < 820) {
            setBodyFromData(1)
        } else if(window.innerWidth < 1100) {
            setBodyFromData(2)
        } else if (window.innerWidth >= 1100) {
            setBodyFromData(3)
        }
    }
    const LoadPageData = () => {
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
            const status = parseInt(document.querySelector(`#data-list-content-${id_table_doctor} Action-bt Bt-status .frame`).getAttribute("status"))
            setBecause(<ManageDoctorPage RefOnPage={RefBe} id_table={id_table_doctor} type={typeStatus} status={status} 
                        setBecause={setBecause} TabOn={TabOn} session={session} ReloadFetch={Fetch}/>)
        }
    }

    const OpenConfirmData = async (id , typeStatus) => {
        if(await auth(true)) {
            const status = parseInt(document.querySelector(`#data-list-content-${id} Action-bt Bt-status .frame`).getAttribute("status"))
            setBecause(<ManageDataPage RefOnPage={RefBe} id_table={id} type={typeStatus} status={status} setBecause={setBecause} TabOn={TabOn} session={session} ReloadData={Fetch}/>)
        }
    }

    const OpenDetailManage = async (id_table_doctor , typeStatus) => {
        if(await auth(true)) {
            setBecause(<ShowBecause RefOnPage={RefBe} id_table={id_table_doctor} type={typeStatus} TabOn={TabOn} setBecause={setBecause}/>)
        }
    }

    const manageList = (maxColumn) => {
        const ListExport = new Array()
        const max = maxColumn

        // setListCount(max)

        // for(let x=0;x<Data.length;x += max) {
        //     const account = Data
        //     ListExport.push(account.slice(x , max + x))
        // }

        const doctorList = Data.map((data , key)=>
            <List-data-body key={key} 
                id={`data-list-content-${
                    HrefPage.get().split("?")[0] === "list" ? data.id_table_doctor :
                    HrefPage.get().split("?")[0] === "data" ? data.id : ""
                }`} 
                status={status.status}>
                {
                    HrefPage.get().split("?")[0] === "list" ?
                    <>
                        <Detail-Data-main>
                            <Detail-Image>
                                <img src={data.img_doctor ? data.img_doctor : "/doctor-svgrepo-com.svg"}></img>
                            </Detail-Image>
                            <Detail-data>
                                <Detail-in-fullname>
                                    <span>{data.fullname_doctor ? data.fullname_doctor : "เจ้าหน้าที่ส่งเสริมยังไม่ทำการระบุชื่อ"}</span>
                                </Detail-in-fullname>
                                <Detail-in>
                                    <span className="head-data">รหัสประจำตัว</span>
                                    <div className="text-data">{data.id_doctor}</div>
                                </Detail-in>
                                <Detail-in>
                                    <span className="head-data">ศูนย์</span>
                                    <div className="text-data">{data.station ? data.station : "เจ้าหน้าที่ส่งเสริมยังไม่ระบุ"}</div>
                                </Detail-in>
                            </Detail-data>
                        </Detail-Data-main>
                        <Action-bt>
                            { status.status === "default" ? 
                                <>
                                <content-status because={1}>
                                    <bt-because>
                                        <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_account")}>เหตุผล</button>
                                    </bt-because>
                                    <Bt-status onClick={()=>OpenConfirmDoctor(data.id_table_doctor , "status_account")}>
                                        <div className="frame" status={data.status_account ? "1" : "0"}>
                                            <span>ON</span>
                                            <span className="dot"></span>
                                            <span>OFF</span>
                                        </div>
                                    </Bt-status>
                                </content-status>
                                <bt-delete>
                                    <button onClick={()=>OpenConfirmDoctor(data.id_table_doctor , "status_delete")}>ลบบัญชี</button>  
                                </bt-delete>
                                </> : 
                                status.status === "delete" ?
                                <content-status because={0} delete="">
                                    <bt-because>
                                        <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_delete")}>เหตุผล</button>
                                    </bt-because>
                                </content-status> : <></>
                            }
                        </Action-bt>
                    </> :
                    HrefPage.get().split("?")[0] === "data" ?
                    <>
                        <Detail-Data-main column="">
                            <Detail-Data maxsize="" flex={status.status}>
                                <div className="name" w={status.status}>
                                    { status.status === "plant" ?
                                        <span className={status.status}>ชื่อพืช</span> : <></>

                                    }
                                    <div className={`text-data ${status.status}`}>{data.name}</div>
                                </div>
                                <div className={status.status === "plant" ? "type_plant" : "location"}>
                                    {
                                        status.status === "plant" ? <span>ประเภท</span> : <></>
                                    }
                                    {
                                        status.status === "plant" ? <div className="text-data">{data.type_plant}</div> :
                                        status.status === "station" ? 
                                            <MapsJSX lat={data.location.x} lng={data.location.y} w={"300vw"} h={"100vw"}/> : ""
                                    }
                                </div>
                            </Detail-Data>
                            { status.status === "plant" ?
                                <Detail-Data maxsize="">
                                    <div className="name">
                                        <span className={status.status}>จำนวนวันที่จะเก็บเกี่ยว</span>
                                        <div className={`text-data`}>{`${data.qty_harvest} วัน`}</div>
                                    </div>
                                </Detail-Data>
                                : <></>
                            }
                        </Detail-Data-main>
                        <Action-bt>
                            <content-status because={0}>
                                <Bt-status 
                                    onClick={()=>OpenConfirmData(data.id , status.status)}
                                    >
                                    <div className="frame" status={data.is_use}>
                                        <span>ON</span>
                                        <span className="dot"></span>
                                        <span>OFF</span>
                                    </div>
                                </Bt-status>
                            </content-status>
                        </Action-bt>
                    </> : <></>
                }
                
            </List-data-body>
        )
        // const doctorList = 
        //     ListExport.map((row , key)=>{
        //         while(row.length < max) row.push({data : "null"})
        //         return (
        //         <Row-List className={`row-${key}`} key={key}>
        //             {
        //                 row.map((data , key)=>{
        //                     if(!data.data) 
        //                         return(
        //                         <List-data-body key={key} 
        //                             id={`data-list-content-${
        //                                 HrefPage.get().split("?")[0] === "list" ? data.id_table_doctor :
        //                                 HrefPage.get().split("?")[0] === "data" ? data.id : ""
        //                             }`} 
        //                             status={status.status}>
        //                             {
        //                                 HrefPage.get().split("?")[0] === "list" ?
        //                                 <>
        //                                     <Detail-Data-main>
        //                                         <Detail-Image>
        //                                             <img src="/doctor-svgrepo-com.svg"></img>
        //                                         </Detail-Image>
        //                                         <Detail-data>
        //                                             <Detail-in-fullname>
        //                                                 <span>{data.fullname_doctor ? data.fullname_doctor : "เจ้าหน้าที่ส่งเสริมยังไม่ทำการระบุชื่อ"}</span>
        //                                             </Detail-in-fullname>
        //                                             <Detail-in>
        //                                                 <span className="head-data">รหัสประจำตัว</span>
        //                                                 <div className="text-data">{data.id_doctor}</div>
        //                                             </Detail-in>
        //                                             <Detail-in>
        //                                                 <span className="head-data">ศูนย์</span>
        //                                                 <div className="text-data">{data.station ? data.station : "เจ้าหน้าที่ส่งเสริมยังไม่ระบุ"}</div>
        //                                             </Detail-in>
        //                                         </Detail-data>
        //                                     </Detail-Data-main>
        //                                     <Action-bt>
        //                                         { status.status === "default" ? 
        //                                             <>
        //                                             <content-status because={1}>
        //                                                 <bt-because>
        //                                                     <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_account")}>เหตุผล</button>
        //                                                 </bt-because>
        //                                                 <Bt-status onClick={()=>OpenConfirmDoctor(data.id_table_doctor , "status_account")}>
        //                                                     <div className="frame" status={data.status_account ? "1" : "0"}>
        //                                                         <span>ON</span>
        //                                                         <span className="dot"></span>
        //                                                         <span>OFF</span>
        //                                                     </div>
        //                                                 </Bt-status>
        //                                             </content-status>
        //                                             <bt-delete>
        //                                                 <button onClick={()=>OpenConfirmDoctor(data.id_table_doctor , "status_delete")}>ลบบัญชี</button>  
        //                                             </bt-delete>
        //                                             </> : 
        //                                             status.status === "delete" ?
        //                                             <content-status because={0} delete="">
        //                                                 <bt-because>
        //                                                     <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_delete")}>เหตุผล</button>
        //                                                 </bt-because>
        //                                             </content-status> : <></>
        //                                         }
        //                                     </Action-bt>
        //                                 </> :
        //                                 HrefPage.get().split("?")[0] === "data" ?
        //                                 <>
        //                                     <Detail-Data-main column="">
        //                                         <Detail-Data maxsize="" flex={status.status}>
        //                                             <div className="name" w={status.status}>
        //                                                 { status.status === "plant" ?
        //                                                     <span className={status.status}>ชื่อพืช</span> : <></>

        //                                                 }
        //                                                 <div className={`text-data ${status.status}`}>{data.name}</div>
        //                                             </div>
        //                                             <div className={status.status === "plant" ? "type_plant" : "location"}>
        //                                                 {
        //                                                     status.status === "plant" ? <span>ประเภท</span> : <></>
        //                                                 }
        //                                                 {
        //                                                     status.status === "plant" ? <div className="text-data">{data.type_plant}</div> :
        //                                                     status.status === "station" ? 
        //                                                         <MapsJSX lat={data.location.x} lng={data.location.y} w={"300vw"} h={"100vw"}/> : ""
        //                                                 }
        //                                             </div>
        //                                         </Detail-Data>
        //                                         { status.status === "plant" ?
        //                                             <Detail-Data maxsize="">
        //                                                 <div className="name">
        //                                                     <span className={status.status}>จำนวนวันที่จะเก็บเกี่ยว</span>
        //                                                     <div className={`text-data`}>{`${data.qty_harvest} วัน`}</div>
        //                                                 </div>
        //                                             </Detail-Data>
        //                                             : <></>
        //                                         }
        //                                     </Detail-Data-main>
        //                                     <Action-bt>
        //                                         <content-status because={0}>
        //                                             <Bt-status 
        //                                                 onClick={()=>OpenConfirmData(data.id , status.status)}
        //                                                 >
        //                                                 <div className="frame" status={data.is_use}>
        //                                                     <span>ON</span>
        //                                                     <span className="dot"></span>
        //                                                     <span>OFF</span>
        //                                                 </div>
        //                                             </Bt-status>
        //                                         </content-status>
        //                                     </Action-bt>
        //                                 </> : <></>
        //                             }
                                    
        //                         </List-data-body>
        //                         )
        //                     else 
        //                         return(
        //                         <List-Data-null key={key}>
        //                         </List-Data-null>
        //                         )
        //                 })
        //             }
        //         </Row-List>
        //         )
        //     })
        TabOn.addTimeOut(TabOn.end())
        setList(doctorList)
    }

    return (List)
}

const InsertPage = ({PageAddRef , ReloadAccount , type}) => {
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
        setSize(PageAddRef.current.clientHeight * 0.3)

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
                setText(`เพิ่ม${
                            type === "default" ? "บัญชีผู้ส่งเสริม" : 
                            type === "plant" ? "ชนิดพืช" : 
                            type === "station" ? "ศูนย์ส่งเสริม" : ""
                        }สำเร็จ`)
                setStatus(1)
                Cancel()
                setTimeout(()=>{
                    ReloadAccount()
                } , 100)
            }
            else if(result === "incorrect") {
                setText("รหัสผู้ดูแลไม่ถูกต้อง")
                setStatus(2)
                pwAdmin.current.value = ""
            } else if (result === "overflow") {
                setText(`มี${
                            type === "default" ? "บัญชีผู้ส่งเสริม" : 
                            type === "plant" ? "ชนิดพืช" : 
                            type === "station" ? "ศูนย์ส่งเสริม" : ""
                        }นี้แล้ว`)
                setStatus(2)
                Cancel()
                setTimeout(()=>{
                    ReloadAccount()
                } , 100)
            }
            else {
                setText(`มีปัญหาในการเพิ่มข้อมูล`)
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

        Data1 ? Data1.value = "" : null;
        Data2 ? Data2.value = "" : null;
        Data3 ? Data3.value = "" : null;
        Qty ? Qty.value = "" : null;
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
        if(!isNaN(valueLocation[2]) && !isNaN(valueLocation[1])) {
            setLag(valueLocation[2])
            setLng(valueLocation[1])
        }
        // let Location = valueLocation.split("/").filter((val)=>val.indexOf("data") >= 0)
        // if(Location[0]) {
        //     Location = Location[0].split("!").filter((val)=>val.indexOf("3d") >= 0 || val.indexOf("4d") >= 0).reverse().slice(0 , 2)
        // }
        // if(Location.length == 2) {
        //     let lag = Location[1].split(".")
        //     lag[0] = lag[0].replace("3d" , "")
        //     for(let x=7; x>=4 ; x--) {
        //         lag[1] = lag[1].slice(0 , x)
        //         if(!isNaN(lag[1])) break
        //     }

        //     let lng = Location[0].split(".")
        //     lng[0] = lng[0].replace("4d" , "")
        //     for(let x=7; x>=4 ; x--) {
        //         lng[1] = lng[1].slice(0 , x)
        //         if(!isNaN(lng[1])) break
        //     }

        //     const Lagitude = lag.join(".")
        //     const Longitude = lng.join(".")
        //     if(!isNaN(Lagitude) && !isNaN(Longitude)) {
        //         setLag(Lagitude)
        //         setLng(Longitude)
        //     }
        // }
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
                    sizeLoad={sizeReport} BorderLoad={8} color={"white"}/>
            </div>
            <div className="body-page">
                <span className="head">
                    {   
                        type === "default" ? "เพิ่มบัญชีเจ้าหน้าที่ส่งเสริม" :
                        type === "plant" ? "เพิ่มรายการชนิดพืช" :
                        type === "station" ? "เพิ่มรายการศูนย์" : ""
                    }
                </span>
                <div className="detail-data">
                    <label className={type === "plant" ? "two-box" : null}>
                        <div className="field-text">
                            <span className="head-text">
                                { 
                                    type === "default" ?
                                        "รหัสประจำตัวผู้ส่งเสริม" :
                                    type === "plant" ?
                                        "ชื่อพืช" :
                                    type === "station" ?
                                        "ชื่อศูนย์ส่งเสริม" 
                                    // <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/></svg>
                                    : <></>
                                }
                            </span>
                            <input onChange={CheckEmply} ref={RefData.Data1} 
                                    placeholder={
                                        type === "default" ? "กรอกรหัสประจำตัว" : 
                                        type === "plant" ? "เช่น มะเขือเทศ" :
                                        type === "station" ? "เช่น ศูนย์โครงการหลวง" : ""
                                    }></input>
                        </div>
                        { type === "plant" ?
                            <div className="field-text">
                                <span className="head-text">ประเภทพืช</span>
                                <select onChange={CheckEmply} ref={RefData.Data2} defaultValue={""} style={{width : "100%"}}>
                                    <option value={""} disabled>เลือกชนิดพืช</option>
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
                                    <span className="head-text">รหัสผ่านบัญชีผู้ส่งเสริม</span>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/></svg> */}
                                    <input onChange={CheckEmply} ref={RefData.Data2} placeholder="กรอกรหัสผ่าน" type="password"></input>
                                </div>
                            </label>
                            </> :
                        type === "plant" ?
                            <label>
                                <div className="field-text">
                                    <span className="head-text">จำนวนวันที่จะเก็บเกี่ยว</span>
                                    <input onChange={CheckEmply} ref={QtyDate} placeholder="เช่น 10 , 30" type="number"></input>
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
                                    <span className="head-text">ลิ้งค์ปักหมุดจาก Google Map</span>
                                    <input ref={InputMap} placeholder="URL ที่ทำการปักหมุดสีแดง" type="text" onChange={CheckEmply} onInput={GenerateMap}></input>
                                </div>
                            </label>
                            <label className="station">
                                <div className="field-text">
                                    <input style={{display : "none"}} readOnly ref={RefData.Data2} value={Lag}></input>
                                    <input style={{display : "none"}} readOnly ref={RefData.Data3} value={Lng}></input>
                                    <MapsJSX lat={Lag} lng={Lng} w={"100%"}/>
                                    <button onClick={GenerateMapAuto}>รีโหลดพิกัด</button>
                                </div>
                            </label>
                            </> :
                            <></>
                    }
                </div>
                <label className="admin-confirm">
                    <input ref={pwAdmin} onChange={CheckEmply} placeholder="รหัสผ่านผู้ดูแลระบบ" type="password"></input>
                </label>
                <div className="bt-submit">
                    <button className="cancel" onClick={Cancel}>ยกเลิก</button>
                    <button className="submit" onClick={ClickAdd} no={stateOnBt ? "" : null}>เพิ่มข้อมูล</button>
                </div>
            </div>
        </section>
    )
}

export default ListData