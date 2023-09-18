import React, { useEffect, useRef, useState } from "react";
import { GetLinkUrlOfSearch, MapsJSX } from "../../../../../../src/assets/js/module";

const InsertPlant = ({nameInsert , typeInsert , DateQtyInsert , ErrReport , CheckInsert , stateOn}) => {
    useEffect(()=>{
        nameInsert.current.value = ""
        typeInsert.current.value = ""
        DateQtyInsert.current.value = ""
    } , [stateOn])
    
    const SelectElementNext = (next = false) => {
        if(next) next.focus()
    }

    return (
        <>
        <div className="row">
            <label className="field-select">
                <span>
                    <span className="important">ชื่อชนิดพืช</span>
                    { ErrReport ? 
                        <span className="err-text-overlape">พืชซ้ำ</span>
                        : <></>
                    }
                </span>
                <input ref={nameInsert} onChange={CheckInsert} 
                    onKeyDown={(e)=>InputKeyDownNext(e , typeInsert.current)}
                    placeholder="เช่น เมล่อน"></input>
            </label>
            <label className="field-select">
                <span className="important">ประเภท</span>
                <select ref={typeInsert} onChange={()=>{
                        CheckInsert()
                        SelectElementNext(DateQtyInsert.current)
                    }
                } defaultValue={""}>
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
                        ref={DateQtyInsert} 
                        onChange={CheckInsert} placeholder="เช่น 10 30" type="number"></input>
            </label>
        </div>
        </>
    )
}

const InsertFertilizer = ({nameInsert , formulaFertilizer , UseText , ErrReport , CheckInsert , stateOn}) => {
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
            } 
            // else if(e.target.value.length === 0) {
            //     let next = e.target.previousElementSibling
            //     if(next){
            //         while(next.tagName != typeElementNext){
            //             next = next.previousElementSibling
            //         }
            //         next.focus()
            //     }
            // }
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
                <input ref={nameInsert} onChange={CheckInsert} 
                    onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[0].current)}
                    placeholder="เช่น กระต่าย"></input>
            </label>
        </div>
        <div className="row">
            <label className="field-select">
                <span className="important">สูตรปุ๋ย</span>
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
                <span className="important">วิธีการใช้</span>
                <input ref={UseText} onChange={CheckInsert} placeholder="เช่น หว่านโคนต้น"></input>
            </label>
        </div> 
        </>
    )
}

const InsertChemical = ({nameInsert , formulaChemical , UseText , DateQtyInsert , ErrReport , CheckInsert , stateOn}) => {
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
                <input ref={nameInsert} onChange={CheckInsert} 
                    onKeyDown={(e)=>InputKeyDownNext(e , formulaChemical.current)}
                    placeholder="เช่น พรีวาธอน"></input>
            </label>
        </div>
        <div className="row">
            <label className="field-select">
                <span className="important">ชื่อสามัญสารเคมี</span>
                <input ref={formulaChemical} onChange={CheckInsert} onKeyDown={(e)=>InputKeyDownNext(e , UseText.current)} placeholder="เช่น แมนโคเซบ"></input>
            </label>
        </div> 
        <div className="row">
            <label className="field-select not1">
                <span className="important">วิธีการใช้</span>
                <input ref={UseText} onChange={CheckInsert} onKeyDown={(e)=>InputKeyDownNext(e , DateQtyInsert.current)} placeholder="เช่น ฉีดพ้น"></input>
            </label>
            <label className="field-select not1">
                <span className="important ab">จำนวนวันปลอดภัย</span>
                <input onInput={(e)=>parseInt(e.target.value) <= 0 ? e.target.value = "" : null} 
                        ref={DateQtyInsert} 
                        onChange={CheckInsert} placeholder="เช่น 10 30" type="number"></input>
            </label>
        </div>
        </>
    )
}

const InsertSource = ({nameInsert , position , ErrReport , CheckInsert , stateOn}) => {
    const [Lag , setLag] = useState(0)
    const [Lng , setLng] = useState(0)

    const InputUrl = useRef()

    useEffect(()=>{
        nameInsert.current.value  = ""
        InputUrl.current.value = ""
        setLag(0)
        setLng(0)
    } , [stateOn])

    const GenerateMap = async (e) => {
        let valueLocation = await GetLinkUrlOfSearch(e.target.value , "doctor")

        if(!isNaN(valueLocation[2]) && !isNaN(valueLocation[1])) {
            setLag(valueLocation[2])
            setLng(valueLocation[1])
        } else {
            setLag(0)
            setLng(0)
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
        // } else {
        //     setLag(0)
        //     setLng(0)
        // }
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
                <input ref={nameInsert} onChange={CheckInsert} 
                    onKeyDown={(e)=>InputKeyDownNext(e , "")}
                    placeholder="เช่น สหกรณ์แม่เตียน"></input>
            </label>
        </div>
        <div className="row">
            <label className="field-select">
                <span>ตำแหน่งใน Google Map</span>
                <input ref={InputUrl} placeholder="url/แชร์จาก google map" onInput={GenerateMap} type="search"></input>
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

export {InsertFertilizer , InsertChemical , InsertSource , InsertPlant}