import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/form/PageFormPlant.scss"
import "../../assets/style/TemplantList.scss"
import { DayJSX , LoadOtherDom, Loading, PopupDom } from "../../../../../src/assets/js/module";
import ManagePopup from "./ManagePopup";
import { ExportPDF } from "../../../../../src/assets/js/Export";

const PageFormPlant = ({setMain , session , socket , type = false , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    // const [Body , setBody] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    // const [statusPage , setStatus] = useState({
    //     status : LoadType.split(":")[0],
    //     open : type
    // })
    const [TypeSelectMenu , setTypeSelectMenu] = useState(0)
    const [DataProcess , setDataProcess] = useState(new Map([
        ["statusClick" , type]
    ]))

    const [DataIdPlant , setDataIdPlant] = useState([])
    const [DataPlantList , setDataPlantList] = useState([])

    const Search = useRef()

    const SearchInput = useRef()
    const TypePlant = useRef()
    const StatusForm = useRef()
    const StatusFarmer = useRef()
    const TypeDate = useRef()
    
    const [ShowDate , setShowDate] = useState(false)

    const [Mount , setMount] = useState([])
    const [OffsetMountStart , setOffsetMountStart] = useState(0)
    const [OffsetMountEnd , setOffsetMountEnd] = useState([0 , 12])

    const [Year , setYear] = useState([])
    const [YearContinue , setYearContinue] = useState([])

    const StartMount = useRef()
    const StartYear = useRef()
    const EndMount = useRef()
    const EndYear = useRef()

    const [defaultStartMount , setDefaultStartMount] = useState("")
    const [defaultStartYear , setDefaultStartYear] = useState("")
    const [defaultEndMount , setDefaultEndMount] = useState("")
    const [defaultEndYear , setDefaultEndYear] = useState("")
    let month = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]
    
    useEffect(()=>{
        eleImageCover.current.style.height = "30%"
        eleBody.current.style.height = "70%"
        setTextStatus(["หน้าหลัก" , "แบบบันทึกการปลูก" , "รายการแบบบันทึก"])
        clientMo.unLoadingPage()
        // FetchPlantList()
        GetDate()

        // if(LoadType.split(":")[1] === "pop") chkPath()

    } , [LoadType])

    // const FetchPlantList = async () => {
    //     const result = await clientMo.post("/api/doctor/plant/list")
    //     try {
    //         const Data = JSON.parse(result)
    //         setDataPlantList(Data)
    //         console.log(Data)
    //     } catch(e) {
    //         session()
    //     }
    // }

    // const chkPath = () => {
    //     if(LoadType.split(":")[0] === "ap") 
    //         setStatus({
    //             status : "ap",
    //             open : 0
    //         })
    //     else if(LoadType.split(":")[0] === "wt") 
    //         setStatus({
    //             status : "wt",
    //             open : 0
    //         })
    // }

    // const changeMenu = (typeClick) => {
    //     if(typeClick !== statusPage.status) {
    //         setStatus({
    //             status : typeClick,
    //             open : 1
    //         })
    //     }
    // }
    const GetDate = () => {
        let year = new Date().getUTCFullYear() + 543
        const yearArr = new Array()
        for( let i = year; i >= (year - 10) ; i-- ) yearArr.push(i)
        setYear(yearArr)

        // ต้องมีการแยกตาม url
        setMount(["เลือกเดือน", ...month])
        setOffsetMountStart(12)
    }

    const OpenOption = (Ref , option) => {
        setTypeSelectMenu(option)
        if(TypeSelectMenu == option) Ref.current.toggleAttribute("show")
        else if(Ref.current.getAttribute("show") == null) Ref.current.toggleAttribute("show")
    }

    const searchList = (e , keyMap) => {
        const setData = new Map([...DataProcess])
        if(e.target.value) {
            setData.set(keyMap , e.target.value)
            // if(StatusForm.current === e.target) 
            if(TypeDate.current === e.target) setShowDate(true)
        }
        else {
            setData.delete(keyMap)
            if(TypeDate.current === e.target) {
                if(ShowDate) {
                    EndMount.current.setAttribute("disabled" , "")
                    EndYear.current.setAttribute("disabled" , "")
                }
                setShowDate(false)
                setData.delete("StartDate")
                setData.delete("EndDate")
                setOffsetMountStart(12)
                setDefaultStartMount("")
                setDefaultStartYear("")
                setDefaultEndMount("")
                setDefaultEndYear("")
            }
        }

        if(e.target != TypePlant.current) {
            TypePlant.current.value = ""
            setData.delete("typePlant")
        }

        setDataProcess(new Map([...setData ,["statusClick" , true]]))
    }

    const ManageDateSelect = (e) => {
        if(ShowDate) {
            let checkMountEmply = true
            let CheckSetData = true

            if(e.target === StartMount.current) setDefaultStartMount(e.target.value)
            else if(e.target === StartYear.current) setDefaultStartYear(e.target.value)
            else if(e.target === EndMount.current) setDefaultEndMount(e.target.value)
            else if(e.target === EndYear.current) setDefaultEndYear(e.target.value)

            // set date offset select present
            if(parseInt(StartYear.current.value) === new Date().getUTCFullYear()) {
                setOffsetMountStart(new Date().getMonth() + 1)
                if(parseInt(StartMount.current.value) > new Date().getMonth() + 1) {
                    checkMountEmply = false
                    CheckSetData = false
                    setDefaultStartMount("")
                    setDefaultEndMount("")
                    setDefaultEndYear("")
                }
            }
            else setOffsetMountStart(12)

            // set use date end
            if(StartMount.current.value && StartYear.current.value && checkMountEmply) {
                EndMount.current.removeAttribute("disabled")
                EndYear.current.removeAttribute("disabled")

                const StartM = (e.target === StartMount.current) ? e.target.value : StartMount.current.value
                const StartY = (e.target === StartYear.current) ? e.target.value : StartYear.current.value

                // set year end < year start
                const YearCutinueArray = new Array
                for(let x = parseInt(StartY); x<=new Date().getFullYear(); x++) YearCutinueArray.push(x + 543);
                setYearContinue(YearCutinueArray)

                const endYear = (e.target === EndYear.current) ? e.target.value : EndYear.current.value ;

                if(parseInt(StartY) > parseInt(endYear)) {
                    if(e.target === StartYear.current) {
                        setDefaultEndMount("")
                        setDefaultEndYear("")
                        CheckSetData = false
                    }
                }
                // set check offset end date
                if(endYear === StartY && parseInt(endYear) === new Date().getUTCFullYear()) {
                    console.log([parseInt(StartM) , new Date().getMonth() + 1] , defaultEndMount)
                    setOffsetMountEnd([parseInt(StartM) , new Date().getMonth() + 1])
                    const endMount = parseInt(EndMount.current.value)
                    if(parseInt(StartM) > endMount || endMount > new Date().getMonth() + 1) {
                        setDefaultEndMount("")
                        CheckSetData = false
                    }
                }
                else if(endYear === StartY) {
                    setOffsetMountEnd([parseInt(StartM) , 12])
                    if(parseInt(EndMount.current.value) < parseInt(StartM)) {
                        setDefaultEndMount("")
                        CheckSetData = false
                    }
                } else if(parseInt(endYear) === new Date().getUTCFullYear()) {
                    setOffsetMountEnd([0 , new Date().getMonth() + 1])
                    if(parseInt(EndMount.current.value) > new Date().getMonth() + 1){
                        setDefaultEndMount("")
                        CheckSetData = false
                    }
                } else setOffsetMountEnd([0 , 12])

            } else {
                EndMount.current.setAttribute("disabled" , "")
                EndYear.current.setAttribute("disabled" , "")
            }

            if(StartMount.current.value && StartYear.current.value 
                && EndMount.current.value && EndYear.current.value
                && CheckSetData) {
                    setDataProcess(
                        new Map([
                            ...DataProcess ,
                            [ "StartDate" , new Date(`${StartMount.current.value}-01-${StartYear.current.value}`) ] ,
                            [ "EndDate" , new Date(`${EndMount.current.value}-${new Date(parseInt(EndYear.current.value) , parseInt(EndMount.current.value) , 0).getDate()}-${EndYear.current.value}`) ],
                            ["statusClick" , true]
                        ])
                    )
                } 
            else {
                const setData = new Map([...DataProcess])
                setData.delete("StartDate")
                setData.delete("EndDate")
                setDataProcess(
                    new Map([...setData] , ["statusClick" , true])
                )
            }
        }
    }

    // export
    const SelectMenuExport = async (type) => {
        let JsonData = {}
        DataProcess.forEach((data , key)=>{
            if(key != "statusClick") { 
                JsonData[key] = data 
            }
        })

        const ExportFetch = await clientMo.post('/api/doctor/form/export' , JsonData)
        if(ExportFetch) {
            const DataExport = JSON.parse(ExportFetch)
            if(type === "pdf") ExportPDF(DataExport)
            else {}
        } else session()
    }

    return(
        <section className="data-list-content-page form-page">
            <div className="search-form" ref={Search}>
                <div className="bt-select-option">
                    <a title="ค้นหา" className="bt-search-show" onClick={()=>OpenOption(Search , 0)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                                <path d="m11.25 11.25l3 3"/>
                                <circle cx="7.5" cy="7.5" r="4.75"/>
                            </g>
                        </svg>
                    </a>
                    <a title="ส่งออกข้อมูล" className="bt-export-show" onClick={()=>OpenOption(Search , 1)}>
                        <svg viewBox="0 0 24 24">
                            <path d="M20.92 15.62a1.15 1.15 0 0 0-.21-.33l-3-3a1 1 0 0 0-1.42 1.42l1.3 1.29H12a1 1 0 0 0 0 2h5.59l-1.3 1.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3-3a.93.93 0 0 0 .21-.33 1 1 0 0 0 0-.76ZM14 20H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h4a1 1 0 0 0 .92-.62 1 1 0 0 0-.21-1.09l-6-6a1.07 1.07 0 0 0-.28-.19h-.09l-.28-.1H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h8a1 1 0 0 0 0-2ZM13 5.41 15.59 8H14a1 1 0 0 1-1-1Z">
                            </path>
                        </svg>
                    </a>
                </div>
                <div className="content-option">
                    <div className="field-option">
                        { !TypeSelectMenu ?
                            <>
                            <div className="row">
                                <input onChange={(e)=>searchList(e , "textInput")} type="search" ref={SearchInput} placeholder="รหัสการเก็บเกี่ยว/รหัสแบบฟอร์ม" defaultValue={DataProcess.get("textInput")}></input>
                            </div>
                            <div className="row">
                                <label className="field-select">
                                    <span>ชนิดพืช :</span>
                                    <select onChange={(e)=>searchList(e , "typePlant")} defaultValue={DataProcess.get("typePlant")} className="width-100" ref={TypePlant}>
                                        <option value={""}>ทั้งหมด</option>
                                        { 
                                            DataPlantList.map((data , key)=>
                                                <option key={key} value={data.name}>{`${data.name} ${data.count}`}</option>
                                            )
                                        }
                                    </select>
                                </label>
                                <label className="field-select">
                                    <span>สถานะแบบฟอร์ม :</span>
                                    <select onChange={(e)=>searchList(e , "statusForm")} defaultValue={DataProcess.get("statusForm")} className="width-100" ref={StatusForm}>
                                        <option value={""}>ทั้งหมด</option>
                                        <option value={0}>กำลังปลูก</option>
                                        <option value={1}>ตรวจสอบผลผลิต</option>
                                        <option value={2}>เก็บเกี่ยวแล้ว</option>
                                    </select>
                                </label>
                            </div>
                            <div className="row">
                                <label className="field-select">
                                    <span>สถานะผู้บันทึก :</span>
                                    <select onChange={(e)=>searchList(e , "statusFarmer")} defaultValue={DataProcess.get("statusFarmer")} className="width-100" ref={StatusFarmer}>
                                        <option value={""}>ทั้งหมด</option>
                                        <option value={1}>ตรวจสอบแล้ว</option>
                                        <option value={0}>ยังไม่ตรวจสอบ</option>
                                    </select>
                                </label>
                                <label className="field-select">
                                    <span>ประเภทช่วงเวลา :</span>
                                    <select onChange={(e)=>searchList(e , "typeDate")} defaultValue={DataProcess.get("typeDate")} className="width-100" ref={TypeDate}>
                                        <option value={""}>ทั้งหมด</option>
                                        <option value={0}>วันที่เพาะปลูก</option>
                                        <option value={1}>วันที่เก็บเกี่ยวผลผลิต</option>
                                    </select>
                                </label>
                            </div>
                            {/* select date */}
                            {ShowDate ? 
                                <div className="row">
                                    <div className="field-select">
                                        <span>เลือกช่วงเวลา :</span>
                                        <div>
                                            <select value={defaultStartMount} ref={StartMount} onChange={ManageDateSelect}>
                                                {Mount.map((val , index)=>{
                                                    if(index === 0) return <option disabled key={index} value={""}>{val}</option>
                                                    else {
                                                        if(index <= OffsetMountStart) return <option className="on" key={index} value={(index >= 10) ? index : `0${index}`}>{val}</option>
                                                        else return <option key={index} disabled value={val}>{val}</option>
                                                    }
                                                })}
                                            </select>
                                            <select value={defaultStartYear} ref={StartYear} onChange={ManageDateSelect}>
                                                <option disabled value={""}>เลือกปี</option>
                                                {
                                                    Year.map((val , index)=>(
                                                        <option key={index} value={val - 543}>{val}</option>)
                                                    )
                                                }
                                            </select>
                                            ถึง
                                            <select value={defaultEndMount} ref={EndMount} disabled={DataProcess.get("EndDate") ? false : true} onChange={ManageDateSelect}>
                                                {Mount.map((val , index)=>{
                                                    if(index === 0) return <option disabled key={index} value={""}>{val}</option>
                                                    else {
                                                        if(OffsetMountEnd[0] <= index && index <= OffsetMountEnd[1]) 
                                                            return <option className="on" key={index} value={(index >= 10) ? index : `0${index}`}>{val}</option>
                                                        else return <option key={index} disabled value={val}>{val}</option>
                                                    }
                                                })}
                                            </select>
                                            <select value={defaultEndYear} ref={EndYear} disabled={DataProcess.get("EndDate") ? false : true} onChange={ManageDateSelect}>
                                                <option disabled value={""}>เลือกปี</option>
                                                {
                                                    YearContinue.map((val , index)=>(
                                                        <option key={index} value={val - 543}>{val}</option>)
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                : <></>
                            }
                            </>
                            : 
                            <div className="export">
                                <div className="head">
                                    <span>ส่งออกข้อมูล</span>
                                    <div className="quesion_mask">
                                        <div className="desciption">ส่งออกข้อมูลที่มีเงื่อนไขตรงกับการค้นหา <br></br> หากไม่กำหนดเงื่อนไข จะส่งออกข้อมูลทั้งหมด <br></br> ข้อมูลเฉพาะภายในศูนย์เท่านั้น</div>
                                        <svg viewBox="0 0 93.936 93.936">
                                            <g>
                                                <path d="M80.179,13.758c-18.342-18.342-48.08-18.342-66.422,0c-18.342,18.341-18.342,48.08,0,66.421   c18.342,18.342,48.08,18.342,66.422,0C98.521,61.837,98.521,32.099,80.179,13.758z M44.144,83.117   c-4.057,0-7.001-3.071-7.001-7.305c0-4.291,2.987-7.404,7.102-7.404c4.123,0,7.001,3.044,7.001,7.404   C51.246,80.113,48.326,83.117,44.144,83.117z M54.73,44.921c-4.15,4.905-5.796,9.117-5.503,14.088l0.097,2.495   c0.011,0.062,0.017,0.125,0.017,0.188c0,0.58-0.47,1.051-1.05,1.051c-0.004-0.001-0.008-0.001-0.012,0h-7.867   c-0.549,0-1.005-0.423-1.047-0.97l-0.202-2.623c-0.676-6.082,1.508-12.218,6.494-18.202c4.319-5.087,6.816-8.865,6.816-13.145   c0-4.829-3.036-7.536-8.548-7.624c-3.403,0-7.242,1.171-9.534,2.913c-0.264,0.201-0.607,0.264-0.925,0.173   s-0.575-0.327-0.693-0.636l-2.42-6.354c-0.169-0.442-0.02-0.943,0.364-1.224c3.538-2.573,9.441-4.235,15.041-4.235   c12.36,0,17.894,7.975,17.894,15.877C63.652,33.765,59.785,38.919,54.73,44.921z"/>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <a className="pdf" title="ส่งออก PDF" onClick={()=>SelectMenuExport("pdf")}>PDF</a>
                                <a className="excel" title="ส่งออก EXCEL" onClick={()=>SelectMenuExport("excel")}>EXCEL</a>
                                {/* <select defaultValue={"show"}>
                                    <option value={"show"}>ตามที่แสดง</option>
                                    <option value={"all"}>ทั้งหมดจากค้นหา</option>
                                </select> */}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="data-list-content">
                <List session={session} socket={socket} DataFillter={DataProcess} setDataPlant={setDataPlantList} setDataId={setDataIdPlant}/>
            </div>
        </section>
    )
}

const List = ({ session , socket , DataFillter , setDataPlant , setDataId}) => {
    const [Data , setData] = useState([])
    const [Count , setCount] = useState(20)
    const [timeOut , setTimeOut] = useState()
    const [LoadingList , setLoadList ] = useState(true)
    
    useEffect(()=>{
        setLoadList(true)

        clearTimeout(timeOut)
        setTimeOut(setTimeout(()=>{
            FetchList(3)
        } , 1500))

    } , [DataFillter])

    const FetchList = async (Limit) => {
        try {
            let JsonData = {}
            let stringUrl = new Array
            DataFillter.forEach((data , key)=>{
                if(key != "statusClick") { 
                    JsonData[key] = data 
                    stringUrl.push(`${key}=${data}`)
                }
            })
            stringUrl = stringUrl.join("&")
            if(DataFillter.get("statusClick")) window.history.pushState({} , "" , `/doctor/form${stringUrl ? `?${stringUrl}` : ""}`)

            JsonData["limit"] = Limit
            const list = await clientMo.post('/api/doctor/form/list' , JsonData)
            const data = JSON.parse(list)

            delete JsonData['typePlant']
            delete JsonData['limit']
            const listPlant = await clientMo.post('/api/doctor/form/list' , JsonData)
            const dataTypePlant = JSON.parse(listPlant)

            const MapPlant = new Map()
            const PlantList = new Array()
            for(let name of dataTypePlant.map((value , key)=>value.name_plant)) {
                MapPlant.set(name , MapPlant.get(name) ? MapPlant.get(name) + 1 : 1)
            }
            MapPlant.forEach((val , key)=>{
                PlantList.push({name : key , count : val})
            })
            setDataPlant(PlantList)

            setDataId(data.map(val=>val.id))
            setData(data)
            setLoadList(false)
            return data
        } catch(e) {
            session()
        }
    }

    return (LoadingList ?
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            }}>
            <Loading size={"45px"} border={"5px"} color="rgb(24 157 133)" animetion={true}/>
        </div> 
        :
        <ManageList Data={Data} status={status} session={session} fetch={FetchList} count={Count} setCount={setCount}/>)
}

const ManageList = ({Data , status , session , fetch , count , setCount}) => {
    const [Body , setBody] = useState(<></>)
    const RefPop = useRef()
    const [PopBody , setPop] = useState(<></>)
    
    let refData = Data.map(() => React.createRef());

    useEffect(()=>{
        refData = Data.map(() => React.createRef());
        ManageShow(Data)

        // window.addEventListener("resize" , Resize)

        // return () => {
        //     window.removeEventListener("resize" , Resize)
        // }
    } , [Data])

    // const Resize = () => ManageShow(Data)

    const ManageShow = (Data) => {
        if(Data.length !== 0) {
            // let Max = 0 , SizeFont = 0 , SizeFontDate = 0
            // // console.log(Data)
            // if(window.innerWidth >= 920) {
            //     Max = 4
            //     SizeFont = 1.8
            //     SizeFontDate = 1.2
            // }
            // else if (window.innerWidth < 920) {
            //     Max = 2
            //     SizeFont = 2.8
            //     SizeFontDate = 1.8
            // }

            // // const text = [ ...Data , ...Data , ...Data ]
            // const Row = new Array
            // for(let x = 0 ; x < Data.length ; x += Max) Row.push(Data.slice(x , Max + x))

            // let countKey = 0
            const body = Data.map((Data , keyRow)=>{
                const Ref = refData[keyRow]
                const DateHarvestDiff = ((new Date(Data.date_harvest) - new Date()) / (24 * 60 * 60 * 1000)).toString().split(".")[0]
                return (
                    <a key={keyRow} className="list-some-data-on-page" title="เปิดแบบฟอร์ม"
                        ref={Ref} status={Data.submit} onClick={()=>showPopup(Data.id , Ref)}
                        >
                        { Data.submit == 0 && (DateHarvestDiff <= 15 || DateHarvestDiff < 0) ?
                            <div className="report-list">
                                <div className="text">
                                {
                                    (DateHarvestDiff < 0) ?
                                        `เลยกำหนดเก็บเกี่ยว ${Math.abs(DateHarvestDiff)} วัน` :
                                    (DateHarvestDiff == 0) ? 
                                        "ครบกำหนดเก็บเกี่ยว" :
                                    (DateHarvestDiff <= 15) ?
                                        `เก็บเกี่ยวในอีก ${DateHarvestDiff} วัน`
                                        : <></>
                                }
                                </div>
                            </div> : <></>
                        }
                        <div className="frame-data-list">
                            <div className="inrow">
                                <div className="column">
                                    <div className="type-main">
                                        {Data.type_main}
                                    </div>
                                    <div className="type">
                                        {Data.name_plant}
                                    </div>
                                </div>
                                <div className="date">
                                    <span>ปลูก</span>
                                    <DayJSX DATE={Data.date_plant} TYPE="SMALL"/>
                                </div>
                            </div>
                            <div className="inrow">
                                <div className="system-glow">
                                    <span>ระบบการปลูก</span> 
                                    <div>{" "+Data.system_glow}</div>
                                </div>
                                <div className="factor">
                                    <div className="content">
                                        <span>ปุ๋ย</span> {Data.ctFer} ครั้ง
                                    </div>
                                    <div className="dot">|</div>
                                    <div className="content">
                                        <span>สารเคมี</span> {Data.ctChe} ครั้ง
                                    </div>
                                </div>
                            </div>
                            <div className="inrow">
                                <div className="insect">
                                    <span>ศัตรูพืช</span> {Data.insect}
                                </div>
                                <div className="factor">
                                    <div className="content">
                                        <span>รุ่น</span> {Data.generation}
                                    </div>
                                    <div className="content">
                                        <span>จำนวน</span> {Data.qty} ต้น
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                )
            })
            setBody(body)
        } else {
            setBody(
                <section>
                    <div>ไม่พบข้อมูล</div>
                </section>
            )
        }
    }

    const showPopup = async (id_form , Ref) => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) 
            setPop(<ManagePopup RefData={Ref} setPopup={setPop} RefPop={RefPop} 
                    id_form={id_form}
                    status={status.status} session={session} Fecth={()=>fetch(count)}/>)
        else session()
    }

    return(
        <>
        <div className="body-page-content">
            {Body}
        </div>
        <div className="footer">
            <LoadOtherDom Fetch={fetch} count={count} setCount={setCount} Limit={5}
                            style={{backgroundColor : "rgb(24 157 133)"}}/>
            <div id="popup-detail-form">
                <PopupDom Ref={RefPop} Body={PopBody} zIndex={2}/>
            </div>
        </div>
        </>
    )
} 

export default PageFormPlant