import React, { useEffect, useRef, useState } from "react";
import "../../assets/style/page/data/ManageData.scss"
import { GetLinkUrlOfSearch, MapsJSX } from "../../../../../src/assets/js/module";
import { clientMo } from "../../../../../src/assets/js/moduleClient";

const ManageData = ({Ref , setPopup , DataOfPage , Type , Fetch , RowPresent , session}) => {
    const StatusRef = useRef()
    const Password = useRef()
    
    const [Data , setData] = useState(DataOfPage)
    const [StateEdit , setStateEdit] = useState(false)
    const [DataEdit , setDataEdit] = useState(new Map())
    const [Status , setStatus] = useState(Data.is_use)
    const [BtSubmit , setBtSubmit] = useState("")

    const [ErrReport , setErrReport] = useState(false)

    useEffect(()=>{
        Ref.current.style.opacity = 1
        Ref.current.style.visibility = "visible"
    } , [])

    const CheckEdit = (value , key) => {
        const data = new Map([...DataEdit])

        if(Data[key] != value && value) data.set(key , value)
        else data.delete(key)

        if(data.size > 1 && data.has("password")) setBtSubmit(null)
        else setBtSubmit("")
        setDataEdit(data)
    }

    const Submit = async () => {
        if(DataEdit.size > 1 && DataEdit.has("password")) {
            console.log(DataEdit)
            const JsonData = {}
            JsonData.check = {}
            JsonData.data = {}
            const check = Type === "plant" ? ["name"] : 
                            Type === "fertilizer" ? ["name" , "name_formula"] :
                            Type === "chemical" ? ["name" , "name_formula"] :
                            Type === "source" ? ["name"] : [];

            Array.from(DataEdit).forEach(val=>{
                if(check.filter(valfilter=>valfilter == val[0]).length) 
                    JsonData.check[val[0]] = val[1]

                if(val[0] != "password")
                    JsonData.data[val[0]] = val[1]
                else JsonData["password"] = val[1]
            })

            JsonData["type"] = Type
            JsonData["id_list"] = Data.id

            const newData = await clientMo.post("/api/doctor/data/edit" , JsonData)
            
            Password.current.value = ""
            const setdata = new Map([...DataEdit])
            setdata.delete("password")
            setDataEdit(setdata)
            try {
                const dataJson = JSON.parse(newData)
                if(dataJson.result === "pass") {
                    setData(dataJson.data[0])
                    setStateEdit(0)
                    ResetDataEdit()
                    Fetch(0 , RowPresent)
                } else if(dataJson.result === "over") {
                    setErrReport(true)
                    setBtSubmit("")
                } else if(dataJson.result === "password") {
                    Password.current.setAttribute("placeholder" , "รหัสผ่านไม่ถูกต้อง")
                } else session()
            } catch(e) {
                console.log(e)
                session()
            }
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
        setBtSubmit("")
        setErrReport(false)
        setDataEdit(new Map())
    }

    return (
        <section className="manage-data-popup">
            <a onClick={close} className="close">
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
                            <EditPlant CheckEdit={CheckEdit} Data={Data} ErrReport={ErrReport}/> :
                    Type === 'fertilizer' ?   
                        !StateEdit ?
                            <DetailFertilizer Data={Data}/> : 
                            <EditFertilizer CheckEdit={CheckEdit} Data={Data} ErrReport={ErrReport}/> :
                    Type === 'chemical' ?   
                        !StateEdit ?
                            <DetailChemical Data={Data}/> : 
                            <EditChemical CheckEdit={CheckEdit} Data={Data} ErrReport={ErrReport}/> :
                    Type === 'source' ?   
                        !StateEdit ?
                            <DetailSource Data={Data}/> : 
                            <EditSource CheckEdit={CheckEdit} Data={Data} ErrReport={ErrReport}/>     
                    : <></>
                }
            </div>
            { StateEdit ?
                <div className="bt-manage">
                    <div className="password">
                        <input placeholder="รหัสผ่านเจ้าหน้าที่" type="password" ref={Password} onChange={(e)=>CheckEdit(e.target.value , "password")}></input>
                    </div>
                    <div className="bt">
                        <button onClick={()=>{
                            setStateEdit(0)
                            ResetDataEdit()
                        }} className="cancel">ยกเลิก</button>
                        <button onClick={Submit} className="submit" on={BtSubmit}>ยืนยัน</button>
                    </div>
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
const EditPlant = ({CheckEdit , Data , ErrReport}) => {
    const typeInsert = useRef()
    const DateQtyInsert = useRef()
    
    const SelectElementNext = (next = false) => {
        if(next) next.focus()
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
                    <input onChange={(e)=>CheckEdit(e.target.value , "name")} 
                        onKeyDown={(e)=>InputKeyDownNext(e , typeInsert.current)}
                        placeholder="เช่น เมล่อน" defaultValue={Data.name}></input>
                </label>
                <label className="field-select">
                    <span className="important">ประเภท</span>
                    <select ref={typeInsert} onChange={(e)=>{
                            CheckEdit(e.target.value , "type_plant")
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
                            onChange={(e)=>CheckEdit(e.target.value , "qty_harvest")} placeholder="เช่น 10 30" type="number"></input>
                </label>
            </div>
        </div>
    )
}

//
const DetailFertilizer = ({Data}) => {
    return(
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span>ชื่อปัจจัยการผลิต/ตรา</span>
                    </span>
                    <input readOnly defaultValue={Data.name}></input>
                </label>
            </div>
            <div className="row">
                <label className="field-select">
                    <span>สูตรปุ๋ย</span>
                    <div className="box-input-number">
                        <input readOnly defaultValue={Data.name_formula.split("-")[0]}></input>
                        <span>-</span>
                        <input readOnly defaultValue={Data.name_formula.split("-")[1]}></input>
                        <span>-</span>
                        <input readOnly defaultValue={Data.name_formula.split("-")[2]}></input>
                    </div>
                </label>
            </div> 
            <div className="row">
                <label className="field-select">
                    <span>วิธีการใช้</span>
                    <input readOnly defaultValue={Data.how_use}></input>
                </label>
            </div> 
        </div>
    )
} 
const EditFertilizer = ({CheckEdit , Data , ErrReport}) => {
    const formulaFertilizer = [useRef() , useRef() , useRef() ]
    const UseText = useRef()
    
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
            }
        }
    }

    const ConvertFormula = () => {
        const formula = `${formulaFertilizer[0].current.value}-${formulaFertilizer[1].current.value}-${formulaFertilizer[2].current.value}`
        if(formulaFertilizer[0].current.value && formulaFertilizer[1].current.value && formulaFertilizer[2].current.value)
            CheckEdit(formula , "name_formula")
        else CheckEdit("" , "name_formula")
    }

    return (
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span className="important">ชื่อปัจจัยการผลิต/ตรา</span>
                        { ErrReport ? 
                            <span className="err-text-overlape">ปุ๋ยซ้ำ</span>
                            : <></>
                        }
                    </span>
                    <input onChange={(e)=>CheckEdit(e.target.value , "name")} 
                        onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[0].current)}
                        placeholder="เช่น กระต่าย" defaultValue={Data.name}></input>
                </label>
            </div>
            <div className="row">
                <label className="field-select">
                    <span className="important">สูตรปุ๋ย</span>
                    <div className="box-input-number">
                        <input ref={formulaFertilizer[0]} defaultValue={Data.name_formula.split("-")[0]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[1].current)} onChange={ConvertFormula} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                        <span>-</span>
                        <input ref={formulaFertilizer[1]} defaultValue={Data.name_formula.split("-")[1]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[2].current , formulaFertilizer[0].current)} onChange={ConvertFormula} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                        <span>-</span>
                        <input ref={formulaFertilizer[2]} defaultValue={Data.name_formula.split("-")[2]} onKeyDown={(e)=>InputKeyDownNext(e , UseText.current , formulaFertilizer[1].current)} onChange={ConvertFormula} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                    </div>
                </label>
            </div> 
            <div className="row">
                <label className="field-select">
                    <span className="important">วิธีการใช้</span>
                    <input ref={UseText} onChange={(e)=>CheckEdit(e.target.value , "how_use")} placeholder="เช่น หว่านโคนต้น" defaultValue={Data.how_use}></input>
                </label>
            </div> 
        </div>
    )
}

const DetailChemical = ({Data}) => {
    return(
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span>ชื่อสารเคมี</span>
                    </span>
                    <input readOnly defaultValue={Data.name}></input>
                </label>
            </div>
            <div className="row">
                <label className="field-select">
                    <span>ชื่อสามัญสารเคมี</span>
                    <input readOnly defaultValue={Data.name_formula}></input>
                </label>
            </div> 
            <div className="row">
                <label className="field-select not1">
                    <span>วิธีการใช้</span>
                    <input readOnly defaultValue={Data.how_use}></input>
                </label>
                <label className="field-select not1">
                    <span className="important ab">จำนวนวันปลอดภัย</span>
                    <input readOnly defaultValue={Data.date_sefe}></input>
                </label>
            </div>
        </div>
    )
} 
const EditChemical = ({CheckEdit , Data , ErrReport}) => {
    const formulaChemical = useRef()
    const UseText = useRef()
    const DateQtyInsert = useRef()
    
    return (
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span className="important">ชื่อสารเคมี</span>
                        { ErrReport ? 
                            <span className="err-text-overlape">สารเคมีซ้ำ</span>
                            : <></>
                        }
                    </span>
                    <input onChange={(e)=>CheckEdit(e.target.value , "name")}
                        onKeyDown={(e)=>InputKeyDownNext(e , formulaChemical.current)}
                        placeholder="เช่น พรีวาธอน" defaultValue={Data.name}></input>
                </label>
            </div>
            <div className="row">
                <label className="field-select">
                    <span className="important">ชื่อสามัญสารเคมี</span>
                    <input ref={formulaChemical} onChange={(e)=>CheckEdit(e.target.value , "name_formula")} onKeyDown={(e)=>InputKeyDownNext(e , UseText.current)} placeholder="เช่น " defaultValue={Data.name_formula}></input>
                </label>
            </div> 
            <div className="row">
                <label className="field-select not1">
                    <span className="important">วิธีการใช้</span>
                    <input ref={UseText} onChange={(e)=>CheckEdit(e.target.value , "how_use")} onKeyDown={(e)=>InputKeyDownNext(e , DateQtyInsert.current)} placeholder="เช่น ฉีดพ้น" defaultValue={Data.how_use}></input>
                </label>
                <label className="field-select not1">
                    <span className="important ab">จำนวนวันปลอดภัย</span>
                    <input onInput={(e)=>parseInt(e.target.value) <= 0 ? e.target.value = "" : null} 
                            ref={DateQtyInsert} 
                            onChange={(e)=>CheckEdit(e.target.value , "date_sefe")} placeholder="เช่น 10 30" type="number" defaultValue={Data.date_sefe}></input>
                </label>
            </div>
        </div>
    )
}


const DetailSource = ({Data}) => {
    return(
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span>ชื่อแหล่งที่ซื้อ</span>
                    </span>
                    <input readOnly defaultValue={Data.name}></input>
                </label>
            </div>
            { Data.location != null ?
                <div className="row">
                    <label className="field-select">
                        <MapsJSX lat={Data.location.x} lng={Data.location.y} w={"100%"} h={"150px"}/>
                    </label>
                </div> : <></>
            }
        </div>
    )
} 
const EditSource = ({CheckEdit , Data , ErrReport}) => {
    const [Lag , setLag] = useState(Data.location ? Data.location.x : 0)
    const [Lng , setLng] = useState(Data.location ? Data.location.y : 0)

    const nameInsert = useRef()
    const InputUrl = useRef()

    const GenerateMap = async (e) => {
        let valueLocation = await GetLinkUrlOfSearch(e.target.value , "doctor")

        let Location = valueLocation.split("/").filter((val)=>val.indexOf("data") >= 0)
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
                ConvertLocation(Lagitude , Longitude)
            }
        } else {
            setLag(0)
            setLng(0)
            ConvertLocation(0 , 0)
        }
    }

    const ConvertLocation = (lag , lng) => {
        if(lag && lng)
            CheckEdit(`POINT(${lag} ${lng})` , "location")
        else CheckEdit("0" , "location")
    }

    return (
        <div className="body">
            <div className="row">
                <label className="field-select">
                    <span>
                        <span className="important">ชื่อแหล่งที่ซื้อ</span>
                        { ErrReport ? 
                            <span className="err-text-overlape">แหล่งซื้อซ้ำ</span>
                            : <></>
                        }
                    </span>
                    <input ref={nameInsert} onChange={(e)=>CheckEdit(e.target.value , "name")} 
                        onKeyDown={(e)=>InputKeyDownNext(e , "")}
                        placeholder="เช่น สหกรณ์แม่เตียน" defaultValue={Data.name}></input>
                </label>
            </div>
            <div className="row">
                <label className="field-select">
                    <span>ตำแหน่งใน Google Map</span>
                    <input ref={InputUrl} placeholder="url/แชร์จาก google map" onInput={GenerateMap} type="search" 
                        defaultValue={Lag && Lng ? `https://www.google.co.th/maps/place/${Lag.toString().split(".")[0]}%C2%B002'14.2%22N+${Lng.toString().split(".")[0]}%C2%B043'36.0%22E/@${Lag},${Lng},17z/data=!3m1!4b1!4m4!3m3!8m2!3d${Lag}!4d${Lng}?entry=ttu` : ""}></input>
                </label>
            </div>
            { Lag && Lng ?
                <div className="row">
                    <label className="field-select">
                        <MapsJSX lat={Lag} lng={Lng} w={"100%"} h={"150px"}/>
                    </label>
                </div> : <></>
            }
        </div>
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