import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/TemplantList.scss"
import "../../assets/style/page/data/PageData.scss"
import { DayJSX , LoadOtherDom, LoadOtherOffset, Loading, MapsJSX, PopupDom } from "../../../../../src/assets/js/module";
import { InsertChemical, InsertFertilizer, InsertPlant, InsertSource } from "./Insert/InsertPage";
import { SearchChemical, SearchFertilizer, SearchPlant } from "./search/SearchPage";
import PopupConfirm from "./Insert/ConfirmInsert";

const MaxLimit = 5
const PageData = ({setMain , session , socket , type = false , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    // const [Body , setBody] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    // const [statusPage , setStatus] = useState({
    //     status : LoadType.split(":")[0],
    //     open : type
    // })
    const [TypeSelectMenu , setTypeSelectMenu] = useState(0)
    const [DataProcess , setDataProcess] = useState(new Map([
        ["type" , LoadType] , //Loadtype 0 : plant , 1 : ferti , 2 : chemi , 3 : source
        // ["search" , ""] ,
        ["statusClick" , type]
    ]))
    const [ErrReport , setErrReport] = useState(false)
    const [StateOnInsert , setStateOnInsert] = useState(false)

    const [StartData , setStartData] = useState(0)
    const [Limit , setLimit] = useState(MaxLimit)
    const [Reload , setReload] = useState(2)


    const Search = useRef()
    const SearchInput = useRef()
    const SelectType = useRef()
    const Other = useRef()

    const nameInsert = useRef()
    const typeInsert = useRef()
    const DateQtyInsert = useRef()

    const formulaFertilizer = [useRef() , useRef() , useRef()]
    const formulaChemical = useRef()

    const position = [useRef() , useRef()]

    const UseText = useRef()
    const SubmitInsert = useRef()

    //popup
    const RefPopup = useRef()
    const [BodyPopup , setBodyPopup] = useState(<></>)
    
    useEffect(()=>{
        eleImageCover.current.style.height = "30%"
        eleBody.current.style.height = "70%"
        clientMo.unLoadingPage()

    } , [LoadType])

    const OpenOption = (Ref , option) => {
        setTypeSelectMenu(option)
        if(TypeSelectMenu == option) Ref.current.toggleAttribute("show")
        else if(Ref.current.getAttribute("show") == null) Ref.current.toggleAttribute("show")
    }

    const searchList = (target , value , keyMap) => {
        const DataSelect = new Map([...DataProcess])
        // if(target === SelectType.current) SelectType.current.value = 
        DataSelect.set(keyMap , value)
        if(!value) DataSelect.delete(keyMap)

        if(target === SelectType.current) {
            DataSelect.set("statusClick" , true)
            if(!TypeSelectMenu) {
                SearchInput.current.value = ""
            }
            else {
                SubmitInsert.current.setAttribute("no" , "")
            }
            setStartData(0)
            setErrReport(false)
            DataSelect.forEach((val , key)=>{
                if(key != "statusClick" && key != "type") DataSelect.delete(key)
            })
        }
        else DataSelect.set("statusClick" , false)
        console.log(DataSelect)
        setDataProcess(new Map([
            ...DataSelect
        ]))
    }

    // insert
    const CheckInsert = () => {
        const value = DataProcess.get("type") === "plant"  ? 
                            [ nameInsert.current.value , typeInsert.current.value , DateQtyInsert.current.value ] :
                        DataProcess.get("type") === "fertilizer"  ? 
                            [ 
                                nameInsert.current.value , 
                                formulaFertilizer[0].current.value,
                                formulaFertilizer[1].current.value,
                                formulaFertilizer[2].current.value,
                                UseText.current.value
                            ] : 
                        DataProcess.get("type") === "chemical"  ? 
                            [
                                nameInsert.current.value , 
                                formulaChemical.current.value,
                                UseText.current.value,
                                DateQtyInsert.current.value
                            ] : 
                        DataProcess.get("type") === "source"  ? 
                            [
                                nameInsert.current.value
                            ] : []

        if(value.filter(val=>!val).length == 0) {
            SubmitInsert.current.removeAttribute("no")
            return (
                DataProcess.get("type") === "plant"  ? 
                    {
                        data : 
                        {
                            name : nameInsert.current.value ,
                            type_plant : typeInsert.current.value , 
                            qty_harvest : parseInt(DateQtyInsert.current.value)
                        },
                        check : {name : nameInsert.current.value},
                        type : "plant"
                    } :
                DataProcess.get("type") === "fertilizer"  ? 
                    {
                        data : 
                        {
                            name : nameInsert.current.value ,
                            name_formula : `${formulaFertilizer[0].current.value}-${formulaFertilizer[1].current.value}-${formulaFertilizer[2].current.value}` , 
                            how_use : UseText.current.value
                        },
                        check : {
                            name : nameInsert.current.value ,
                            name_formula : `${formulaFertilizer[0].current.value}-${formulaFertilizer[1].current.value}-${formulaFertilizer[2].current.value}`
                        },
                        type : "fertilizer"
                    } : 
                DataProcess.get("type") === "chemical"  ? 
                    {
                        data : 
                        {
                            name : nameInsert.current.value ,
                            name_formula : formulaChemical.current.value , 
                            how_use : UseText.current.value,
                            date_sefe : DateQtyInsert.current.value
                        },
                        check : {
                            name : nameInsert.current.value ,
                            name_formula : formulaChemical.current.value
                        },
                        type : "chemical"
                    } : 
                DataProcess.get("type") === "source"  ? 
                {
                    data : 
                    {
                        name : nameInsert.current.value,
                        location : position[0].current.value != 0 && position[1].current.value != 0 ? `POINT(${position[0].current.value} ${position[1].current.value})` : null
                    },
                    check : {
                        name : nameInsert.current.value
                    },
                    type : "source"
                } : []
            )
        } else {
            SubmitInsert.current.setAttribute("no" , "")
            return false
        }
    }

    const SubmitConfirmInsert = async () => {
        const Data = CheckInsert()
        if(Data) {
            const result = await clientMo.post(`/api/doctor/data/check/overlape` , Data)
            if(!parseInt(result)) {
                setBodyPopup(<PopupConfirm Ref={RefPopup} setPopup={setBodyPopup} session={session} Data={Data} RowPresent={StartData} setLimit={setLimit} Reload={Reload} setReload={setReload}/>)
                setErrReport(false)
            } else {
                setStateOnInsert(!StateOnInsert)
                setErrReport(true)
            }
        }
    }

    const CancelInsert = () => {
        setStateOnInsert(!StateOnInsert)
        SubmitInsert.current.setAttribute("no" , "")
        Search.current.removeAttribute("show")
    }

    return(
        <section className="data-list-content-page data-page">
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
                    <a style={{padding : "0"}} title="เพิ่มข้อมูล" className="bt-search-show" onClick={()=>OpenOption(Search , 1)}>
                        <svg viewBox="0 0 32 32"><path fill="currentColor" d="M16 2A14.172 14.172 0 0 0 2 16a14.172 14.172 0 0 0 14 14a14.172 14.172 0 0 0 14-14A14.172 14.172 0 0 0 16 2Zm8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z"/><path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7v2z"/></svg>
                    </a>
                </div>
                <div className="content-option">
                    <div className="field-option">
                        <div className="row head-row">
                            <label className="field-select">
                                <span>ชนิดข้อมูล</span>
                                <select onChange={(e)=>searchList(e.target , e.target.value , "type")} ref={SelectType} defaultValue={DataProcess.get("type")}>
                                    <option value={"plant"}>ขนิดพืช</option>
                                    <option value={"fertilizer"}>ปัจจัยการผลิต</option>
                                    <option value={"chemical"}>สารเคมี</option>
                                    <option value={"source"}>แหล่งที่ซื้อ</option>
                                </select>
                            </label>
                        </div>
                        { !TypeSelectMenu ? 
                            <>
                                <span className="head">
                                ค้นหา{
                                    DataProcess.get("type") === "plant" ? "พืช" : 
                                    DataProcess.get("type") === "fertilizer" ? "ปัจจัยการผลิต" : 
                                    DataProcess.get("type") === "chemical" ? "สารเคมี" :
                                    DataProcess.get("type") === "source" ? "แหล่งที่ซื้อ" : ""
                                }</span>
                                <div className="row">
                                    <input onChange={(e)=>searchList(e.target , e.target.value , "name")} type="search" ref={SearchInput} placeholder={
                                                DataProcess.get("type") === "plant" ? "ชื่อพืช เช่น เมล่อน" : 
                                                DataProcess.get("type") === "fertilizer" ? "ชื่อปุ๋ย/ตรา เช่น กระต่าย" : 
                                                DataProcess.get("type") === "chemical" ? "ชื่อสารเคมี เช่น พรีวาธอน" :
                                                DataProcess.get("type") === "source" ? "แหล่งที่ซื่อ เช่น สหกรณ์แม่เตียน" : ""
                                            } defaultValue={DataProcess.get("name")}></input>
                                </div>
                                { 
                                    DataProcess.get("type") === "plant" ?
                                        <SearchPlant searchList={searchList} DataProcess={DataProcess}/> :
                                    DataProcess.get("type") === "fertilizer" ? 
                                        <SearchFertilizer searchList={searchList} DataProcess={DataProcess}/>
                                    :
                                    DataProcess.get("type") === "chemical" ? 
                                        <SearchChemical searchList={searchList} DataProcess={DataProcess}/>
                                    : <></>
                                }
                            </>
                            :
                            <>
                                <span className="head">
                                เพิ่ม{
                                    DataProcess.get("type") === "plant" ? "ชนิดพืช" : 
                                    DataProcess.get("type") === "fertilizer" ? "ปัจจัยการผลิต" : 
                                    DataProcess.get("type") === "chemical" ? "สารเคมี" :
                                    DataProcess.get("type") === "source" ? "แหล่งที่ซื้อ" : ""
                                }
                                </span>
                                { 
                                    DataProcess.get("type") === "plant" ?
                                        <InsertPlant nameInsert={nameInsert} typeInsert={typeInsert} DateQtyInsert={DateQtyInsert} ErrReport={ErrReport} CheckInsert={CheckInsert} stateOn={StateOnInsert}/>
                                    : 
                                    DataProcess.get("type") === "fertilizer" ?
                                        <InsertFertilizer nameInsert={nameInsert} formulaFertilizer={formulaFertilizer} UseText={UseText} ErrReport={ErrReport} CheckInsert={CheckInsert} stateOn={StateOnInsert}/>
                                    : 
                                    DataProcess.get("type") === "chemical" ?
                                        <InsertChemical nameInsert={nameInsert} formulaChemical={formulaChemical} UseText={UseText} DateQtyInsert={DateQtyInsert} ErrReport={ErrReport} CheckInsert={CheckInsert} stateOn={StateOnInsert}/>
                                    :  
                                    DataProcess.get("type") === "source" ?
                                        <InsertSource nameInsert={nameInsert} position={position} ErrReport={ErrReport} CheckInsert={CheckInsert} stateOn={StateOnInsert}/>
                                    :
                                        <></>
                                }
                                <div className="bt-insert">
                                    <button className="cancel" onClick={CancelInsert}>ยกเลิก</button>
                                    <button className="submit" no="" ref={SubmitInsert} onClick={SubmitConfirmInsert}>ยืนยัน</button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className="data-list-content">
                <List session={session} socket={socket} DataFillter={DataProcess} setTextStatus={setTextStatus} StartData={StartData} setStartData={setStartData} Limit={Limit} setLimit={setLimit} Reload={Reload}/>
                {
                    TypeSelectMenu ? <PopupDom Ref={RefPopup} Body={BodyPopup} zIndex={2}/> : <></>
                }
            </div>
        </section>
    )
}

const List = ({ session , socket , DataFillter , setTextStatus , StartData , setStartData , Limit , setLimit , Reload}) => {
    const [Data , setData] = useState([])
    const [timeOut , setTimeOut] = useState()
    const [LoadingList , setLoadList ] = useState(true)
    
    useEffect(()=>{
        setLoadList(true)
        clearTimeout(timeOut)
        setTimeOut(setTimeout(()=>{
            FetchList(0 , Limit)
            setLimit(MaxLimit)
        } , 1500))
    } , [DataFillter , Reload])

    const FetchList = async (StartRow , Limit) => {
        try {
            let JsonData = {}
            let JsonCheck = {}
            DataFillter.forEach((data , key)=>{
                if(key != "statusClick") { 
                    if(key != "type") JsonCheck[key] = data
                    else JsonData[key] = data
                }
            })
            JsonData["check"] = JsonCheck
            JsonData["StartRow"] = StartRow
            JsonData["Limit"] = Limit ? Limit : MaxLimit;

            if(DataFillter.get("statusClick")) window.history.pushState({} , "" , `/doctor/form${JsonData["type"] ? `?type=${JsonData["type"]}` : ""}`)

            const list = await clientMo.post(`/api/doctor/data/get` , JsonData)
            const data = JSON.parse(list)
            console.log(data , StartRow , Limit)

            if(StartRow !== 0) { 
                setData([...Data , ...data])
                setStartData([...Data , ...data].length)
            } else {
                setData(data)
            }

            setLoadList(false)
            setTextStatus(["หน้าหลัก" , "ข้อมูล" , 
                DataFillter.get("type") === "plant" ? "รายการชนิดพืช" : 
                DataFillter.get("type") === "fertilizer" ? "รายการปุ๋ย" : 
                DataFillter.get("type") === "chemical" ? "รายการสารเคมี" :
                DataFillter.get("type") === "source" ? "รายการแหล่งที่ซื้อ" : ""
            ])
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
        <ManageList Data={Data} session={session} fetch={FetchList} setRow={setStartData} Limit={Limit} Type={DataFillter.get("type")}/>)
}

const ManageList = ({Data , session , fetch , setRow , Limit , Type}) => {
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

            // let StartDataKey = 0
            const body = Data.map((DataIn , keyRow)=>{
                const Ref = refData[keyRow]
                return (
                    <a key={keyRow} className="list-some-data-on-page"
                        ref={Ref} status={DataIn.is_use}
                        >
                        <div className="frame-data-list">
                            <div className="row">
                                <div className="field-text">
                                    <span>
                                        {
                                            Type === "plant" ? "ชนิดพืช" :
                                            Type === "fertilizer" ? "ชื่อปุ๋ย" :
                                            Type === "chemical" ? "ชื่อสารเคมี" :
                                            Type === "source" ? "แหล่งที่ซื้อ" : ""
                                        }
                                    </span>
                                    <div className="data-text">{DataIn.name}</div>
                                </div>
                                {
                                    Type === "plant" ?
                                        <div className="field-text">
                                            <span>ประเภท</span>
                                            <div className="data-text">{DataIn.type_plant}</div>
                                        </div> :
                                    Type === "fertilizer" ? 
                                        <div className="field-text">
                                            <span>สูตรปุ๋ย</span>
                                            <div className="data-text">{DataIn.name_formula}</div>
                                        </div> :
                                    Type === "chemical" ? 
                                        <div className="field-text">
                                            <span>วิธีการใช้</span>
                                            <div className="data-text">{DataIn.how_use}</div>
                                        </div>  : <></> 
                                }
                            </div>
                            { 
                                Type === "plant" ?
                                    <div className="row">
                                        <div className="field-text max-box">
                                            <span>จำนวนวันที่คาดว่าจะเก็บเกี่ยว</span>
                                            <div className="data-text">{DataIn.qty_harvest} วัน</div>
                                        </div> 
                                    </div> :
                                Type === "fertilizer" ?
                                    <div className="row">
                                        <div className="field-text">
                                            <span>สูตรปุ๋ย</span>
                                            <div className="data-text">{DataIn.name_formula}</div>
                                        </div>
                                    </div> :
                                Type === "chemical" ?
                                    <>
                                    <div className="row">
                                        <div className="field-text">
                                            <span>ชื่อสามัญสารเคมี</span>
                                            <div className="data-text">{DataIn.name_formula}</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="field-text">
                                            <span>จำนวนวันปลอดภัย</span>
                                            <div className="data-text">{DataIn.date_sefe} วัน</div>
                                        </div>
                                    </div>
                                    </>
                                     :
                                Type === "source" ?
                                    DataIn.location ?
                                    <div className="row">
                                        <div className="field-text">
                                            <MapsJSX lat={DataIn.location.x} lng={DataIn.location.y} w={"100%"} h={"80px"}/>
                                        </div>
                                    </div> : <></> : <></>
                            }
                        </div>
                        <div className="frame-manage-list">
                            <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H608zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H608z"/></svg>
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
                    //                 const Ref = refData[StartDataKey]
                    //                 StartDataKey++
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

    return(
        <>
        <div className="body-page-content">
            {Body}
        </div>
        <div className="footer">
            <LoadOtherOffset Fetch={fetch} Data={Data} setRow={setRow} Limit={Limit}
                            style={{backgroundColor : "rgb(24 157 133)"}}/>
            <div id="popup-detail-form">
                <PopupDom Ref={RefPop} Body={PopBody} zIndex={2}/>
            </div>
        </div>
        </>
    )
} 

export default PageData