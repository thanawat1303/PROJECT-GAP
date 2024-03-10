import React, { useEffect, useRef , useState } from "react";

const SearchPlant = ({searchList , DataProcess}) => {
    const typePlant = useRef()

    useEffect(()=>{
        if(DataProcess.has("type_plant")) typePlant.current.value = DataProcess.get("type_plant")
    } , [])
    return(
        <div className="row">
            <label className="field-select">
                <span>ประเภทพืช</span>
                <select onChange={(e)=>searchList(e.target , e.target.value , "type_plant")} ref={typePlant} defaultValue={DataProcess.get("type_plant")}>
                    <option value={""}>ทั้งหมด</option>
                    <option value={"พืชผัก"}>พืชผัก</option>
                    <option value={"สมุนไพร"}>สมุนไพร</option>
                </select>
            </label>
        </div> 
    )
}

const SearchFertilizer = ({searchList , DataProcess}) => {
    const formulaFertilizer = [useRef() , useRef() , useRef()]
    const InputRef = useRef()
    const [InputSearch , setInputSearch] = useState("")

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

    const ConvertFormula = () => {
        let Formula = ""
        if(formulaFertilizer[0].current.value || 
            formulaFertilizer[1].current.value || 
            formulaFertilizer[2].current.value ) {
            Formula = [ 
                formulaFertilizer[0].current.value , 
                formulaFertilizer[1].current.value , 
                formulaFertilizer[2].current.value 
            ].map(val=>!val ? "%" : val).join("-")
        }
        console.log(Formula)
        setInputSearch(Formula)
        searchList(InputRef.current , Formula , "name_formula")
    }

    useEffect(()=>{
        if(DataProcess.has("name_formula")) {
            const Data = DataProcess.get("name_formula").split("-")
            formulaFertilizer[0].current.value = Data[0] && Data[0] != "%" ? Data[0] : ""
            formulaFertilizer[1].current.value = Data[1] && Data[1] != "%" ? Data[1] : ""
            formulaFertilizer[2].current.value = Data[2] && Data[2] != "%" ? Data[2] : ""
        }
    } , [])
    return(
        <div className="row">
            <label className="field-select">
                <span>สูตรปุ๋ย</span>
                <div className="box-input-number">
                    <input ref={formulaFertilizer[0]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[1].current)} onChange={ConvertFormula} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                    <span>-</span>
                    <input ref={formulaFertilizer[1]} onKeyDown={(e)=>InputKeyDownNext(e , formulaFertilizer[2].current , formulaFertilizer[0].current)} onChange={ConvertFormula} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                    <span>-</span>
                    <input ref={formulaFertilizer[2]} onKeyDown={(e)=>InputKeyDownNext(e , "" , formulaFertilizer[1].current)} onChange={ConvertFormula} placeholder="ตัวเลข" onInput={(e)=>setMaxText(e , 2 , "INPUT")} type="number"></input>
                </div>
            </label>
            <input ref={InputRef} hidden readOnly value={InputSearch}></input>
        </div> 
    )
}

const SearchChemical = ({searchList , DataProcess}) => {
    const formulaChemical = useRef()

    useEffect(()=>{
        if(DataProcess.has("name_formula")) formulaChemical.current.value = DataProcess.get("name_formula")
    } , [])
    return(
        <div className="row">
            <label className="field-select">
                <span>ชื่อสามัญสารเคมี</span>
                <input type="search" ref={formulaChemical} onChange={(e)=>searchList(e.target , e.target.value , "name_formula")} placeholder="เช่น "></input>
            </label>
        </div> 
    )
}

const InputKeyDownNext = (e , next = false , previous = false) => {
    if(e.keyCode === 13 && next) next.focus()
    else if(e.keyCode === 8 && previous && !e.target.value) {
        e.preventDefault();
        previous.focus()
    }
}

export {SearchPlant , SearchFertilizer , SearchChemical}