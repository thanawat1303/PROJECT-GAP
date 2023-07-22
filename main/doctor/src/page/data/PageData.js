import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/TemplantList.scss"
import "../../assets/style/page/data/PageData.scss"
import { DayJSX , LoadOtherDom, Loading, PopupDom } from "../../../../../src/assets/js/module";

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


    const Search = useRef()
    const SearchInput = useRef()
    const SelectType = useRef()
    const Other = useRef()

    const nameInsert = useRef()
    const typeInsert = useRef()
    const DateQtyInsert = useRef()

    const formulaFertilizer = [useRef() , useRef() , useRef()]
    const formulaChemical = useRef()

    const UseText = useRef()
    const SubmitInsert = useRef()
    
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

    const searchList = (e , keyMap) => {
        const DataSelect = new Map([...DataProcess])
        // if(e.target === SelectType.current) SelectType.current.value = 
        DataSelect.set(keyMap , e.target.value)
        if(!e.target.value) DataSelect.delete(keyMap)

        if(e.target === SelectType.current) {
            DataSelect.set("statusClick" , true)
            DataSelect.delete("textInput")
            if(!TypeSelectMenu) {
                SearchInput.current.value = ""
            }
            else {
                nameInsert.current.value = ""
                if(UseText.current) UseText.current.value = ""
                SubmitInsert.current.setAttribute("no" , "")
            }
            if(e.target.value !== "plant") DataSelect.delete("other")
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
                            [] : []

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
                        type : "fertilizer"
                    } : 
                DataProcess.get("type") === "source"  ? 
                    [] : []
            )
        } else {
            SubmitInsert.current.setAttribute("no" , "")
            return false
        }
    }

    const SubmitConfirmInsert = async () => {
        const Data = CheckInsert()
        if(Data) {
            console.log(Data)
            // const result = await clientMo.post(`/api/doctor/data/check/overlape` , Data)
            // if(!parseInt(result)) {
            //     setErrReport(false)
            // } else {
            //     const Element = DataProcess.get("type") === "plant"  ? 
            //                 [ nameInsert.current ] :
            //             DataProcess.get("type") === "fertilizer"  ? 
            //                 [] : 
            //             DataProcess.get("type") === "chemical"  ? 
            //                 [] : 
            //             DataProcess.get("type") === "source"  ? 
            //                 [] : 
            //                 []
            //     Element.forEach((val)=>val.value = "")
            //     setErrReport(true)
            // }
        }
    }

    const CancelInsert = () => {
        const value = DataProcess.get("type") === "plant"  ? 
                            [ nameInsert.current , typeInsert.current , DateQtyInsert.current ] :
                        DataProcess.get("type") === "fertilizer"  ? 
                            [] : 
                        DataProcess.get("type") === "chemical"  ? 
                            [] : 
                        DataProcess.get("type") === "source"  ? 
                            [] : []
        value.forEach((val)=>val.value = "")
        Search.current.removeAttribute("show")
    }

    const setMaxText = (e , max , typeElementNext = "") => {
        // const text = e.target.value.slice(0 , max)
        e.target.value = e.target.value.slice(0 , max)
        if(typeElementNext) {
            if(e.target.value.length === max) {
                let next = e.target.nextElementSibling
                if(next){
                    while(next.tagName != typeElementNext){
                        next = next.nextElementSibling
                    }
                    next.focus()
                }
            } else if(e.target.value.length === 0) {
                let next = e.target.previousElementSibling
                if(next){
                    while(next.tagName != typeElementNext){
                        next = next.previousElementSibling
                    }
                    next.focus()
                }
            }
        }
    }

    const InputKeyDownNext = (e , next = false , previous = false) => {
        if(e.keyCode === 13 && next && e.target.value) next.focus()
        else if(e.keyCode === 8 && previous && !e.target.value) {
            e.preventDefault();
            previous.focus()
        }
    }

    const SelectElementNext = (next = false) => {
        if(next) next.focus()
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
                                <select onChange={(e)=>searchList(e , "type")} ref={SelectType} defaultValue={DataProcess.get("type")}>
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
                                <input onChange={(e)=>searchList(e , "textInput")} type="search" ref={SearchInput} placeholder={
                                            DataProcess.get("type") === "plant" ? "กรอกชื่อพืช เช่น เมล่อน" : 
                                            DataProcess.get("type") === "fertilizer" ? "กรอกชื่อปุ๋ย/ตรา เช่น กระต่าย" : 
                                            DataProcess.get("type") === "chemical" ? "กรอกชื่อสารเคมี เช่น พรีวาธอน" :
                                            DataProcess.get("type") === "source" ? "กรอกแหล่งที่ซื่อ เช่น สหกรณ์แม่เตียน" : ""
                                        } defaultValue={DataProcess.get("textInput")}></input>
                            </div>
                            { DataProcess.get("type") === "plant" ?
                                <>
                                {/* <div className="line-area"></div> */}
                                <div className="row">
                                    <label className="field-select">
                                        <span>ประเภทพืช</span>
                                        <select onChange={(e)=>searchList(e , "other")} ref={Other} defaultValue={DataProcess.get("other")}>
                                            <option value={""}>ทั้งหมด</option>
                                            <option value={"พืชผัก"}>พืชผัก</option>
                                            <option value={"สมุนไพร"}>สมุนไพร</option>
                                        </select>
                                    </label>
                                </div> 
                                </>
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
                            <>
                            {/* <div className="row">
                                <input onChange={(e)=>searchList(e , "textInput")} type="search" ref={SearchInput} placeholder="รหัสการเก็บเกี่ยว/รหัสแบบฟอร์ม" defaultValue={DataProcess.get("textInput")}></input>
                            </div> */}
                            <div className="row">
                                <label className="field-select">
                                    <span>
                                        <span>
                                        {
                                            DataProcess.get("type") === "plant" ? "ชื่อชนิดพืช" : 
                                            DataProcess.get("type") === "fertilizer" ? "ชื่อปัจจัยการผลิต/ตรา" : 
                                            DataProcess.get("type") === "chemical" ? "ชื่อสารเคมี" :
                                            DataProcess.get("type") === "source" ? "ชื่อแหล่งที่ซื้อ" : ""
                                        }
                                        </span>
                                        { ErrReport ? 
                                            <span className="err-text-overlape">
                                            {
                                                DataProcess.get("type") === "plant" ? "ชนิดพืชซ้ำ" : 
                                                DataProcess.get("type") === "fertilizer" ? "ปัจจัยการผลิตซ้ำ" : 
                                                DataProcess.get("type") === "chemical" ? "สารเคมีซ้ำ" :
                                                DataProcess.get("type") === "source" ? "แหล่งที่ซื้อซ้ำ" : ""
                                            }
                                            </span>
                                            : <></>
                                        }
                                    </span>
                                    <input ref={nameInsert} onChange={CheckInsert} 
                                        onKeyDown={(e)=>InputKeyDownNext(e , 
                                            DataProcess.get("type") === "plant" ? typeInsert.current : 
                                            DataProcess.get("type") === "fertilizer" ? formulaFertilizer[0].current : 
                                            DataProcess.get("type") === "chemical" ? formulaChemical.current :
                                            DataProcess.get("type") === "source" ? "" : "")
                                        }
                                        placeholder={
                                            DataProcess.get("type") === "plant" ? "เช่น เมล่อน" : 
                                            DataProcess.get("type") === "fertilizer" ? "เช่น กระต่าย" : 
                                            DataProcess.get("type") === "chemical" ? "เช่น พรีวาธอน" :
                                            DataProcess.get("type") === "source" ? "เช่น สหกรณ์แม่เตียน" : ""
                                        }></input>
                                </label>
                                { DataProcess.get("type") === "plant" ?
                                    <label className="field-select">
                                        <span>ประเภท</span>
                                        <select ref={typeInsert} onChange={()=>{
                                                CheckInsert()
                                                SelectElementNext(DateQtyInsert.current)
                                            }
                                        } defaultValue={""}>
                                            <option disabled value={""}>เลือกประเภท</option>
                                            <option value={"พืชผัก"}>พืชผัก</option>
                                            <option value={"สมุนไพร"}>สมุนไพร</option>
                                        </select>
                                    </label> : <></>
                                }
                            </div>
                            { 
                            DataProcess.get("type") === "plant" ?
                                <div className="row">
                                    <label className="field-select">
                                        <span>จำนวนวันที่คาดว่าจะเก็บเกี่ยว</span>
                                        <input onInput={(e)=>parseInt(e.target.value) <= 0 ? e.target.value = "" : null} 
                                                ref={DateQtyInsert} 
                                                onChange={CheckInsert} placeholder="เช่น 10 30" type="number"></input>
                                    </label>
                                </div>
                            : 
                            DataProcess.get("type") === "fertilizer" ?
                                <>
                                <div className="row">
                                    <label className="field-select">
                                        <span>สูตรปุ๋ย</span>
                                        <div className="box-input-number">
                                            <input ref={formulaFertilizer[0]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[1].current)} onChange={CheckInsert} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                                            <span>-</span>
                                            <input ref={formulaFertilizer[1]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[2].current , formulaFertilizer[0].current)} onChange={CheckInsert} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                                            <span>-</span>
                                            <input ref={formulaFertilizer[2]} onKeyDown={(e)=>InputKeyDownNext(e , UseText.current , formulaFertilizer[1].current)} onChange={CheckInsert} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                                        </div>
                                    </label>
                                </div> 
                                <div className="row">
                                    <label className="field-select">
                                        <span>วิธีการใช้</span>
                                        <input ref={UseText} onChange={CheckInsert} placeholder="เช่น หว่านโคนต้น"></input>
                                    </label>
                                </div> 
                                </>
                            : 
                            DataProcess.get("type") === "chemical" ?
                                <>
                                <div className="row">
                                    <label className="field-select">
                                        <span>ชื่อสามัญสารเคมี</span>
                                        <input ref={formulaChemical} onChange={CheckInsert} onKeyDown={(e)=>InputKeyDownNext(e , UseText.current)} placeholder="เช่น "></input>
                                    </label>
                                </div> 
                                <div className="row">
                                    <label className="field-select not1">
                                        <span>วิธีการใช้</span>
                                        <input ref={UseText} onChange={CheckInsert} onKeyDown={(e)=>InputKeyDownNext(e , DateQtyInsert.current)} placeholder="เช่น ฉีดพ้น"></input>
                                    </label>
                                    <label className="field-select not1">
                                        <span>จำนวนวันปลอดภัย</span>
                                        <input onInput={(e)=>parseInt(e.target.value) <= 0 ? e.target.value = "" : null} 
                                                ref={DateQtyInsert} 
                                                onChange={CheckInsert} placeholder="เช่น 10 30" type="number"></input>
                                    </label>
                                </div>
                                </>
                            :  
                                <></>
                            }
                            </>
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
                <List session={session} socket={socket} DataFillter={DataProcess} setTextStatus={setTextStatus}/>
            </div>
        </section>
    )
}

const List = ({ session , socket , DataFillter , setTextStatus}) => {
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
            const stringUrl = new Array
            DataFillter.forEach((data , key)=>{
                if(key != "statusClick") { 
                    JsonData[key] = data 
                    stringUrl.push(`${key}=${data}`)
                }
            })

            if(DataFillter.get("statusClick")) window.history.pushState({} , "" , `/doctor/form${stringUrl.join("&") ? `?${stringUrl.join("&")}` : ""}`)

            const list = await clientMo.get(`/api/doctor/data/get?${stringUrl.join("&")}&limit=${Limit}`)
            const data = JSON.parse(list)
            console.log(data)

            setData(data)
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
        <ManageList Data={Data} session={session} fetch={FetchList} count={Count} setCount={setCount}/>)
}

const ManageList = ({Data , session , fetch , count , setCount}) => {
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
                    <a key={keyRow} className="list-some-data-on-page"
                        ref={Ref} status={Data.is_use}
                        >
                        <div className="frame-data-list">
                            
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

export default PageData