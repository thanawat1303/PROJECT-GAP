import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/form/PageFormPlant.scss"
import "../../assets/style/TemplantList.scss"
import { DayJSX, LoadOtherDom, Loading, PopupDom } from "../../../../../src/assets/js/module";
import ManagePopup from "./ManagePopup";

const PageFormPlant = ({setMain , session , socket , type = false , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    // const [Body , setBody] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    // const [statusPage , setStatus] = useState({
    //     status : LoadType.split(":")[0],
    //     open : type
    // })
    const [DataProcess , setDataProcess] = useState(new Map([
        ["statusClick" , type]
    ]))

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
        FetchPlantList()
        GetDate()

        // if(LoadType.split(":")[1] === "pop") chkPath()

    } , [LoadType])

    const FetchPlantList = async () => {
        const result = await clientMo.post("/api/doctor/plant/list")
        try {
            const Data = JSON.parse(result)
            setDataPlantList(Data)
        } catch(e) {
            session()
        }
    }

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

    const OpenOption = (Ref) => {
        Ref.current.toggleAttribute("show")
    }

    const searchList = (e , keyMap) => {
        if(e.target.value) {
            setDataProcess(
                new Map([ 
                    ...DataProcess ,
                    [keyMap , e.target.value],
                    ["statusClick" , true]
                ])
            )

            // if(StatusForm.current === e.target) 
            if(TypeDate.current === e.target) setShowDate(true)
        }
        else {
            const setData = new Map([...DataProcess])
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

            setDataProcess(new Map([...setData , ["statusClick" , true]]))
        }
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

    return(
        <section className="data-list-content-page form-page">
            <div className="search-form" ref={Search}>
                <a title="ค้นหา" className="bt-search-show" onClick={()=>OpenOption(Search)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                            <path d="m11.25 11.25l3 3"/>
                            <circle cx="7.5" cy="7.5" r="4.75"/>
                        </g>
                    </svg>
                </a>
                <div className="content-option">
                    <div className="field-option">
                        <div className="row">
                            <input onChange={(e)=>searchList(e , "textInput")} type="search" ref={SearchInput} placeholder="รหัสการเก็บเกี่ยว/รหัสแบบฟอร์ม"></input>
                        </div>
                        <div className="row">
                            <label className="field-select">
                                <span>ชนิดพืช :</span>
                                <select onChange={(e)=>searchList(e , "typePlant")} defaultValue={""} className="width-100" ref={TypePlant}>
                                    <option value={""}>ทั้งหมด</option>
                                    { 
                                        DataPlantList.map((data , key)=>
                                            <option key={key} value={data.name}>{`${data.name} ${data.countPlant}`}</option>
                                        )
                                    }
                                </select>
                            </label>
                            <label className="field-select">
                                <span>สถานะแบบฟอร์ม :</span>
                                <select onChange={(e)=>searchList(e , "statusForm")} defaultValue={""} className="width-100" ref={StatusForm}>
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
                                <select onChange={(e)=>searchList(e , "statusFarmer")} defaultValue={""} className="width-100" ref={StatusFarmer}>
                                    <option value={""}>ทั้งหมด</option>
                                    <option value={1}>ตรวจสอบแล้ว</option>
                                    <option value={0}>ยังไม่ตรวจสอบ</option>
                                </select>
                            </label>
                            <label className="field-select">
                                <span>ประเภทช่วงเวลา :</span>
                                <select onChange={(e)=>searchList(e , "typeDate")} defaultValue={""} className="width-100" ref={TypeDate}>
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
                                        <select value={defaultEndMount} ref={EndMount} disabled onChange={ManageDateSelect}>
                                            {Mount.map((val , index)=>{
                                                if(index === 0) return <option disabled key={index} value={""}>{val}</option>
                                                else {
                                                    if(OffsetMountEnd[0] <= index && index <= OffsetMountEnd[1]) 
                                                        return <option className="on" key={index} value={(index >= 10) ? index : `0${index}`}>{val}</option>
                                                    else return <option key={index} disabled value={val}>{val}</option>
                                                }
                                            })}
                                        </select>
                                        <select value={defaultEndYear} ref={EndYear} disabled onChange={ManageDateSelect}>
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
                    </div>
                </div>
            </div>
            <div className="data-list-content">
                <List session={session} socket={socket} DataFillter={DataProcess}/>
            </div>
        </section>
    )
}

const List = ({ session , socket , DataFillter}) => {
    const [Data , setData] = useState([])
    const [Count , setCount] = useState(10)
    const [timeOut , setTimeOut] = useState()
    const [LoadingList , setLoadList ] = useState(true)
    
    useEffect(()=>{
        setLoadList(true)

        clearTimeout(timeOut)
        setTimeOut(setTimeout(()=>{
            FetchList(10)
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
                return (
                    <a key={keyRow} className="list-some-data-on-page" title="เปิดแบบฟอร์ม"
                        ref={Ref} status={Data.submit} onClick={()=>showPopup(Data.id , Ref)}
                        >
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
                                    {" "+Data.system_glow}
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
                    // <section className={`row ${keyRow}`} key={keyRow}>
                    //     <div className="row-content" style={{
                    //         '--item-in-row-doctor' : `${Max}`,
                    //         '--margin-in-row-doctor' : '10px',
                    //         '--font-size-in-row-doctor' : `${SizeFont}vw`,
                    //         '--font-size-date-in-row-doctor' : `${SizeFontDate}vw`,
                    //         }}>
                    //         {
                    //             Data.map((val , key)=>{
                    //                 const Ref = refData[countKey]
                    //                 countKey++
                    //                 return (
                    //                     <section key={key} className="list-some-data-on-page"
                    //                         ref={Ref}
                    //                         >
                    //                         <div className="frame-data-list">
                    //                             <div className="inrow">
                    //                                 <div className="type-main">
                    //                                     {val.type_main}
                    //                                 </div>
                    //                                 <div className="type">
                    //                                     {val.name_plant}
                    //                                 </div>
                    //                                 <div className="date">
                    //                                     <span>ปลูก</span>
                    //                                     <DayJSX DATE={val.date_plant} TYPE="SMALL"/>
                    //                                 </div>
                    //                             </div>
                    //                             <div className="inrow">
                    //                                 <div className="system-glow">
                    //                                     ระบบการปลูก {val.system_glow}
                    //                                 </div>
                    //                                 <div className="factor">
                    //                                     <span>
                    //                                         ปุ๋ย {val.ctFer} ครั้ง
                    //                                     </span>
                    //                                     <span className="dot">|</span>
                    //                                     <span>
                    //                                         สารเคมี {val.ctChe} ครั้ง
                    //                                     </span>
                    //                                 </div>
                    //                             </div>
                    //                             <div className="inrow">
                    //                                 <div className="insect">
                    //                                     ศัตรูพืช {val.insect}
                    //                                 </div>
                    //                                 <div className="factor">
                    //                                     <span className="generation">
                    //                                         รุ่น {val.generation}
                    //                                     </span>
                    //                                     <span className="qty">
                    //                                         จำนวน {val.qty} ต้น
                    //                                     </span>
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                     </section>
                    //                 )
                    //             })
                    //         }
                    //     </div>
                    // </section>
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
                    status={status.status} session={session} countLoad={count} Fecth={fetch}/>)
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