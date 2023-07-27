import React, { useEffect, useRef, useState } from "react";
import "../../assets/style/page/data/ManageData.scss"
import { MapsJSX } from "../../../../../src/assets/js/module";
import { clientMo } from "../../../../../src/assets/js/moduleClient";

const ManageData = ({Ref , setPopup , Data , Type , Fetch , RowPresent , session}) => {
    const StatusRef = useRef()
    const Password = useRef()
    
    const [StateEdit , setStateEdit] = useState(false)
    const [DataEdit , setDataEdit] = useState([])
    const [Status , setStatus] = useState(Data.is_use)
    const [BtSubmit , setBtSubmit] = useState(true)

    useEffect(()=>{
        Ref.current.style.opacity = 1
        Ref.current.style.visibility = "visible"
    } , [])

    const CheckEdit = (data = {}) => {
        if(data.type) {
            const checkChange = data.check.filter(val=>(Data[val[0]] != val[1] && val[1]))
            data.password = Password.current.value
            setDataEdit(data)
            if(checkChange.length != 0 && Password.current.value) {
                setBtSubmit(false)
                return(true)
            } else {
                setBtSubmit(true)
                return(false)
            }
        } else return(false)
    }

    const Submit = () => {
        if(CheckEdit(DataEdit)) {
            const DataTo = DataEdit
            delete DataTo.check
        }
    }

    //state list
    const ChangeStatusUSE = async (state) => {
        const DataIN = {
            type : Type,
            id_list : Data.id,
            state : state ? 0 : 1
        }
        const fetchChange = await clientMo.post("/api/doctor/data/change" , DataIN)
        if(fetchChange === "113") {
            setStatus(DataIN.state)
            Fetch(0 , RowPresent)
        } else if(fetchChange === "error") {}
        else session()
        
    }

    const close = () => {
        Ref.current.style.opacity = 0
        Ref.current.style.visibility = "hidden"
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const ResetDataEdit = () => {
        setBtSubmit(true)
        setDataEdit([])
    }

    return (
        <section className="manage-data-popup">
            <a onClick={close} className="close">
                {/* <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                </svg> */}
                ปิด
            </a>
            <div className="head-form">
                <div className="head-text">
                    <span>
                        {
                            !StateEdit ? 
                                "ข้อมูล" : "แก้ไข"
                        }
                        {
                            Type === "plant" ? "พืช" :
                            Type === "fertilizer" ? "ปุ๋ย" :
                            Type === "chemical" ? "สารเคมี" :
                            Type === "source" ? "แหล่งที่ซื้อ" : ""
                        }
                    </span>
                </div>
                {
                    !StateEdit ?
                        <div className="manage-menu">
                            <a className="edit" onClick={()=>{
                                setStateEdit(1)
                                ResetDataEdit()
                            }}>แก้ไข</a>
                            <a className="status-frame" onClick={()=>ChangeStatusUSE(Status)} status={Status}>
                                <div ref={StatusRef} className="status">
                                    <span>เปิด</span>
                                    <div className="dot-status"></div>
                                    <span>ปิด</span>
                                </div>
                            </a>
                        </div> : <></>
                }
            </div>
            <div className="detail" state={StateEdit ? "1" : "0"}>
                { 
                    Type === 'plant' ?
                        !StateEdit ?
                            <DetailPlant Data={Data}/> : 
                            <EditPlant CheckEdit={CheckEdit} Data={Data}/>
                    : <></>
                }
            </div>
            { StateEdit ?
                <div className="bt-manage">
                    <div className="password">
                        <input type="password" ref={Password} onChange={()=>CheckEdit(DataEdit)}></input>
                    </div>
                    <button onClick={()=>{
                        setStateEdit(0)
                        ResetDataEdit()
                    }}>ยกเลิก</button>
                    <button onClick={Submit} on={BtSubmit}>ยืนยัน</button>
                </div>
                : <></>
            }
        </section>
    )
}

const DetailPlant = ({Data}) => {
    return(
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span>ชื่อชนิดพืช</span>
                    </span>
                    <input readOnly defaultValue={Data.name}></input>
                </label>
                <label className="field-select">
                    <span>ประเภท</span>
                    <select disabled defaultValue={Data.type_plant}>
                        <option disabled value={""}>เลือกประเภท</option>
                        <option value={"พืชผัก"}>พืชผัก</option>
                        <option value={"สมุนไพร"}>สมุนไพร</option>
                    </select>
                </label>
            </div>
            <div className="row">
                <label>
                    <span className="important">จำนวนวันที่คาดว่าจะเก็บเกี่ยว</span>
                    <input readOnly defaultValue={Data.qty_harvest}></input>
                </label>
            </div>
        </div>
    )
}
const EditPlant = ({CheckEdit , Data}) => {
    const nameInsert = useRef()
    const typeInsert = useRef()
    const DateQtyInsert = useRef()
    
    const [ErrReport , setErrReport] = useState(false)
    
    const SelectElementNext = (next = false) => {
        if(next) next.focus()
    }

    const SetData = () => {
        const data = {
            data : {
                name : nameInsert.current.value,
                type_plant : typeInsert.current.value,
                qty_harvest : DateQtyInsert.current.value
            },
            check : [
                ["name" , nameInsert.current.value],
                ["type_plant" , typeInsert.current.value],
                ["qty_harvest" , DateQtyInsert.current.value]
            ],
            checkDB : {
                name : nameInsert.current.value
            },
            type : "plant"
        }

        CheckEdit(data)
    }

    return (
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span className="important">ชื่อชนิดพืช</span>
                        { ErrReport ? 
                            <span className="err-text-overlape">พืชซ้ำ</span>
                            : <></>
                        }
                    </span>
                    <input ref={nameInsert} onChange={()=>SetData()} 
                        onKeyDown={(e)=>InputKeyDownNext(e , typeInsert.current)}
                        placeholder="เช่น เมล่อน" defaultValue={Data.name}></input>
                </label>
                <label className="field-select">
                    <span className="important">ประเภท</span>
                    <select ref={typeInsert} onChange={()=>{
                            SetData()
                            SelectElementNext(DateQtyInsert.current)
                        }
                    } defaultValue={Data.type_plant}>
                        <option disabled value={""}>เลือกประเภท</option>
                        <option value={"พืชผัก"}>พืชผัก</option>
                        <option value={"สมุนไพร"}>สมุนไพร</option>
                    </select>
                </label>
            </div>
            <div className="row">
                <label className="field-select">
                    <span className="important">จำนวนวันที่คาดว่าจะเก็บเกี่ยว</span>
                    <input onInput={(e)=>parseInt(e.target.value) <= 0 ? e.target.value = "" : null} 
                            ref={DateQtyInsert} defaultValue={Data.qty_harvest}
                            onChange={()=>SetData()} placeholder="เช่น 10 30" type="number"></input>
                </label>
            </div>
        </div>
    )
}

const EditFertilizer = ({nameInsert , formulaFertilizer , UseText , ErrReport , CheckEdit , stateOn}) => {
    useEffect(()=>{
        nameInsert.current.value  = "" 
        formulaFertilizer[0].current.value = ""
        formulaFertilizer[1].current.value = ""
        formulaFertilizer[2].current.value = ""
        UseText.current.value = ""
    } , [stateOn])
    
    const setMaxText = (e , max , typeElementNext = "") => {
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

    return (
        <>
        <div className="row">
            <label className="field-select">
                <span>
                    <span className="important">ชื่อปัจจัยการผลิต/ตรา</span>
                    { ErrReport ? 
                        <span className="err-text-overlape">ปุ๋ยซ้ำ</span>
                        : <></>
                    }
                </span>
                <input ref={nameInsert} onChange={CheckEdit} 
                    onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[0].current)}
                    placeholder="เช่น กระต่าย"></input>
            </label>
        </div>
        <div className="row">
            <label className="field-select">
                <span className="important">สูตรปุ๋ย</span>
                <div className="box-input-number">
                    <input ref={formulaFertilizer[0]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[1].current)} onChange={CheckEdit} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                    <span>-</span>
                    <input ref={formulaFertilizer[1]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[2].current , formulaFertilizer[0].current)} onChange={CheckEdit} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                    <span>-</span>
                    <input ref={formulaFertilizer[2]} onKeyDown={(e)=>InputKeyDownNext(e , UseText.current , formulaFertilizer[1].current)} onChange={CheckEdit} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                </div>
            </label>
        </div> 
        <div className="row">
            <label className="field-select">
                <span className="important">วิธีการใช้</span>
                <input ref={UseText} onChange={CheckEdit} placeholder="เช่น หว่านโคนต้น"></input>
            </label>
        </div> 
        </>
    )
}

const EditChemical = ({nameInsert , formulaChemical , UseText , DateQtyInsert , ErrReport , CheckEdit , stateOn}) => {
    useEffect(()=>{
        nameInsert.current.value  = "" 
        formulaChemical.current.value = ""
        UseText.current.value = ""
        DateQtyInsert.current.value = ""
    } , [stateOn])
    
    return (
        <>
        <div className="row">
            <label className="field-select">
                <span>
                    <span className="important">ชื่อสารเคมี</span>
                    { ErrReport ? 
                        <span className="err-text-overlape">สารเคมีซ้ำ</span>
                        : <></>
                    }
                </span>
                <input ref={nameInsert} onChange={CheckEdit} 
                    onKeyDown={(e)=>InputKeyDownNext(e , formulaChemical.current)}
                    placeholder="เช่น พรีวาธอน"></input>
            </label>
        </div>
        <div className="row">
            <label className="field-select">
                <span className="important">ชื่อสามัญสารเคมี</span>
                <input ref={formulaChemical} onChange={CheckEdit} onKeyDown={(e)=>InputKeyDownNext(e , UseText.current)} placeholder="เช่น "></input>
            </label>
        </div> 
        <div className="row">
            <label className="field-select not1">
                <span className="important">วิธีการใช้</span>
                <input ref={UseText} onChange={CheckEdit} onKeyDown={(e)=>InputKeyDownNext(e , DateQtyInsert.current)} placeholder="เช่น ฉีดพ้น"></input>
            </label>
            <label className="field-select not1">
                <span className="important ab">จำนวนวันปลอดภัย</span>
                <input onInput={(e)=>parseInt(e.target.value) <= 0 ? e.target.value = "" : null} 
                        ref={DateQtyInsert} 
                        onChange={CheckEdit} placeholder="เช่น 10 30" type="number"></input>
            </label>
        </div>
        </>
    )
}

const EditSource = ({nameInsert , position , ErrReport , CheckEdit , stateOn}) => {
    const [Lag , setLag] = useState(0)
    const [Lng , setLng] = useState(0)

    const InputUrl = useRef()

    useEffect(()=>{
        nameInsert.current.value  = ""
        InputUrl.current.value = ""
        setLag(0)
        setLng(0)
    } , [stateOn])

    const GenerateMap = (e) => {
        let Location = e.target.value.split("/").filter((val)=>val.indexOf("data") >= 0)
        if(Location[0]) {
            Location = Location[0].split("!").filter((val)=>val.indexOf("3d") >= 0 || val.indexOf("4d") >= 0).reverse().slice(0 , 2)
        }
        if(Location.length == 2) {
            let lag = Location[1].split(".")
            lag[0] = lag[0].replace("3d" , "")
            for(let x=7; x>=4 ; x--) {
                lag[1] = lag[1].slice(0 , x)
                if(!isNaN(lag[1])) break
            }
    
            let lng = Location[0].split(".")
            lng[0] = lng[0].replace("4d" , "")
            for(let x=7; x>=4 ; x--) {
                lng[1] = lng[1].slice(0 , x)
                if(!isNaN(lng[1])) break
            }
    
            const Lagitude = lag.join(".")
            const Longitude = lng.join(".")
            if(!isNaN(Lagitude) && !isNaN(Longitude)) {
                setLag(Lagitude)
                setLng(Longitude)
            }
        } else {
            setLag(0)
            setLng(0)
        }
    }

    return (
        <>
        <div className="row">
            <label className="field-select">
                <span>
                    <span className="important">ชื่อแหล่งที่ซื้อ</span>
                    { ErrReport ? 
                        <span className="err-text-overlape">แหล่งซื้อซ้ำ</span>
                        : <></>
                    }
                </span>
                <input ref={nameInsert} onChange={CheckEdit} 
                    onKeyDown={(e)=>InputKeyDownNext(e , "")}
                    placeholder="เช่น สหกรณ์แม่เตียน"></input>
            </label>
        </div>
        <div className="row">
            <label className="field-select">
                <span>ตำแหน่งใน Google Map</span>
                <input ref={InputUrl} placeholder="URL ปักหมุดแดง" onInput={GenerateMap} type="search"></input>
            </label>
        </div>
        { Lag && Lng ?
            <div className="row">
                <label className="field-select">
                    <MapsJSX lat={Lag} lng={Lng} w={"100%"} h={"60px"}/>
                </label>
            </div> : <></>
        }
        <input hidden ref={position[0]} readOnly value={Lag}></input>
        <input hidden ref={position[1]} readOnly value={Lng}></input>
        </>
    )
}

const InputKeyDownNext = (e , next = false , previous = false) => {
    if(e.keyCode === 13 && next && e.target.value) next.focus()
    else if(e.keyCode === 8 && previous && !e.target.value) {
        e.preventDefault();
        previous.focus()
    }
}

export default ManageData