import React, { useRef , useEffect, useState} from "react";
import "./assets/ListFertilizer.scss"
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";
import { Loading } from "../../../../src/assets/js/module";

const EditFactorPopup = ({setPopup , setPage , RefPop , id_house , id_form_plant , type_path , ReloadData , 
ObjectData}) => {
    const Because = useRef()
    // same
    const DateUse = useRef()
    const NameMainFactor = useRef()
    const NameFactor = useRef()
    const Use = useRef()
    const Volume = useRef()
    const Unit = useRef()
    const Source = useRef()

    // chemical
    const NameInsect = useRef()
    const Rate = useRef()
    const DateSafe = useRef()

    const [DataFactor , setDataFactor] = useState([])
    const [DataSource , setSource] = useState([])

    const ListSearchName = useRef()
    const [ListSelectName , setListName] = useState(<></>)

    const ListSearchFactorNameMain = useRef()
    const [ListSelectNameMain , setListOther] = useState(<></>)

    const BTConfirm = useRef()

    const [LoadSearchName , setLoadName] = useState(false) 
    const [LoadSearchNameMain , setLoadNameMain] = useState(false) 

    const [getWait , setWait] = useState(false)
    useEffect(()=>{
        RefPop.current.setAttribute("show" , "");
        FetchSource()
        // (type_path === "z") ? FetchFactor("fertilizer") : FetchFactor("chemical")
    } , [])

    const FetchFactor = async (type) => {
        const Data = await clientMo.post("/api/farmer/factor/get/auto" , {type : type})
        if(await CloseAccount(Data , setPage)) {
            const LIST = JSON.parse(Data)
            setDataFactor(LIST)
            return LIST
        }
    }

    const FetchSource = async () => {
        const Data = await clientMo.post("/api/farmer/source/get")
        if(await CloseAccount(Data , setPage)) {
            const LIST = JSON.parse(Data)
            setSource(LIST)
        }
    }

    const ConfirmFerti = async () => {
        if(BTConfirm.current.getAttribute("no") == null) {
            const dateUse = DateUse.current
            const formula_name = NameMainFactor.current
            const Name = NameFactor.current
            const use = Use.current
            const volume = Volume.current
            const unit = Unit.current
            const source = Source.current

            const because = Because.current

            const Check = [
                dateUse.value != ObjectData.date.split(" ")[0], 
                formula_name.value != ObjectData.formula_name, 
                Name.value != ObjectData.name, 
                use.value != ObjectData.use_is, 
                volume.value+ " " + unit.value != ObjectData.volume, 
                source.value != ObjectData.source
            ]

            if( (dateUse.value && formula_name.value && Name.value && use.value && volume.value && source.value 
                    && because.value)
                    && (
                        Check.filter(val => val)[0]
                    )
                ) {
                    const Key = [ "date" , "formula_name" , "name" , "use_is" , "volume" , "source" ]
                    const Value = [
                                    dateUse.value , 
                                    formula_name.value, 
                                    Name.value, 
                                    use.value,
                                    volume.value+ " " + unit.value,
                                    source.value
                                ]

                    const foundChange = Check.map((val , index) => (val) ? [ Key[index] , Value[index] ] : "").filter(val => val !== "")
                    const data = {
                        id_farmhouse : id_house,
                        id_plant : id_form_plant ,
                        id_form : ObjectData.id,
                        type_form : "fertilizer",
                        because : because.value,
                        dataChange : Object.fromEntries(new Map([...foundChange])),
                        num : foundChange.length
                    }

                    setWait(true)
                    const result = await clientMo.post("/api/farmer/factor/edit" , data)
                    if(await CloseAccount(result , setPage)) {
                        if(result === "133") {
                            cancel()
                            ReloadData()
                        } else if (result === "submit") {
                            cancel()
                            ReloadData()
                        }
                        setWait(false)
                    }
            } else {
                let RefObject = [
                            dateUse ,
                            formula_name ,
                            Name ,
                            use ,
                            volume ,
                            source ,
                            because
                            // , seft
                        ]
                RefObject.forEach((ele , index)=>{
                    if(!ele.value && ele) ele.style.border = "2px solid red"
                    else if (ele.value && ele) ele.style.border = "2px solid transparent"
                })
            }
        }
    }

    const ConfirmChemi = async () => {
        if(BTConfirm.current.getAttribute("no") == null) {
            const dateUse = DateUse.current
            const formula_name = NameMainFactor.current
            const Name = NameFactor.current
            const insect = NameInsect.current
            const use = Use.current
            const rate = Rate.current
            const volume = Volume.current
            const unit = Unit.current
            const dateSafe = DateSafe.current
            const source = Source.current

            const because = Because.current

            const Check = [
                dateUse.value != ObjectData.date.split(" ")[0] , 
                formula_name.value != ObjectData.formula_name , 
                Name.value != ObjectData.name , 
                insect.value != ObjectData.insect , 
                use.value != ObjectData.use_is , 
                rate.value != ObjectData.rate , 
                volume.value+ " " + unit.value != ObjectData.volume , 
                dateSafe.value != ObjectData.date_safe.split(" ")[0] , 
                source.value != ObjectData.source
            ]

            if( (dateUse.value && formula_name.value && Name.value 
                    && insect.value && use.value && rate.value
                    && volume.value && dateSafe.value && source.value 
                    && because.value) 
                    && 
                    (
                        Check.filter(val => val)[0]
                    )
                ) {
                    const Key = [ "date" , "formula_name" , "name" , "insect" , "use_is" , "rate" , "volume" , "date_safe" , "source" ]
                    const Value = [
                                    dateUse.value, 
                                    formula_name.value, 
                                    Name.value,
                                    insect.value, 
                                    use.value,
                                    rate.value, 
                                    volume.value+ " " + unit.value,
                                    dateSafe.value,
                                    source.value
                                ]

                    const foundChange = Check.map((val , index) => (val) ? [ Key[index] , Value[index] ] : "").filter(val => val !== "")
                    const data = {
                        id_farmhouse : id_house,
                        id_plant : id_form_plant ,
                        id_form : ObjectData.id,
                        type_form : "chemical",
                        because : because.value,
                        dataChange : Object.fromEntries(new Map([...foundChange])),
                        num : foundChange.length
                    }

                    setWait(true)
                    const result = await clientMo.post("/api/farmer/factor/edit" , data)
                    if(await CloseAccount(result , setPage)) {
                        if(result === "133") {
                            cancel()
                            ReloadData()
                        } else if (result === "submit") {
                            cancel()
                            ReloadData()
                        }
                        setWait(false)
                    }      
            } else {
                let RefObject = [
                            dateUse ,
                            formula_name ,
                            Name ,
                            insect,
                            use ,
                            rate,
                            volume ,
                            dateSafe,
                            source ,
                            because
                            // , seft
                        ]
                RefObject.forEach((ele , index)=>{
                    if(!ele.value && ele) ele.style.border = "2px solid red"
                    else if (ele.value && ele) ele.style.border = "2px solid transparent"
                })
            }
        }
    }

    const cancel = () => {
        RefPop.current.removeAttribute("show")
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const clickDate = (ele) => {
        ele.current.focus()
    }

    const ChangeFerti = (e) => {
        const dateUse = DateUse.current
        const formula_name = NameMainFactor.current
        const Name = NameFactor.current
        const use = Use.current
        const volume = Volume.current
        const unit = Unit.current
        const source = Source.current

        const because = Because.current

        if(!e) {
            if(Name.value && formula_name.value) {
                setHowUse()
            }
        }
        
        if( (dateUse.value && formula_name.value && Name.value && use.value && volume.value && source.value 
                && because.value)
                && (
                    dateUse.value != ObjectData.date.split(" ")[0] || 
                    formula_name.value != ObjectData.formula_name || 
                    Name.value != ObjectData.name || 
                    use.value != ObjectData.use_is || 
                    volume.value+ " " + unit.value != ObjectData.volume || 
                    source.value != ObjectData.source
                )
            ) {
                BTConfirm.current.removeAttribute("no")
        } else {
            BTConfirm.current.setAttribute("no" , "")
        }
    }

    const ChangeChemi = (e) => {
        const dateUse = DateUse.current
        const formula_name = NameMainFactor.current
        const Name = NameFactor.current
        const insect = NameInsect.current
        const use = Use.current
        const rate = Rate.current
        const volume = Volume.current
        const unit = Unit.current
        const dateSafe = DateSafe.current
        const source = Source.current

        const because = Because.current

        if(!e) {
            if(formula_name.value != ObjectData.formula_name || 
                Name.value != ObjectData.name) {
                    dateSafe.value = ""
                }

            if(Name.value && formula_name.value) {
                setHowUse()
                setDateSafe() 
            }
        }

        if( (dateUse.value && formula_name.value && Name.value 
                && insect.value && use.value && rate.value
                && volume.value && dateSafe.value && source.value 
                && because.value) 
                && 
                (
                    dateUse.value != ObjectData.date.split(" ")[0] || 
                    formula_name.value != ObjectData.formula_name || 
                    Name.value != ObjectData.name || 
                    insect.value != ObjectData.insect || 
                    use.value != ObjectData.use_is || 
                    rate.value != ObjectData.rate || 
                    volume.value+ " " + unit.value != ObjectData.volume || 
                    dateSafe.value != ObjectData.date_safe.split(" ")[0] || 
                    source.value != ObjectData.source
                )
            ) {
                BTConfirm.current.removeAttribute("no")
        } else {
            BTConfirm.current.setAttribute("no" , "")
        }
    }

    // name
    const SearchNameFactor = async (e) => {
        const type_search = (type_path === "z") ? "fertilizer" : "chemical";
        ListSearchName.current.removeAttribute("remove")
        setLoadName(false);
        let search = await FetchFactor(type_search)
        search = search.filter((val)=>
                            val.name.indexOf(e.target.value) >= 0 && val.name_formula.indexOf(NameMainFactor.current.value) >= 0)
                                .map((val)=>val.name)
        const setSearch = ChangeData(search)
        if(setSearch.length !== 0) 
            setListName(setSearch.map((val)=>
                <span search_name="" onClick={()=>SetTextInputName(val)} key={val.id}>{val}</span>
            ))
        else ResetListNamePopup()
        setLoadName(true);

        (type_path === "z") ? ChangeFerti() : ChangeChemi();
    }

    const SetTextInputName = (name) => {
        NameFactor.current.value = name;
        (type_path === "z") ? ChangeFerti() : ChangeChemi();
        ResetListNamePopup()
    }

    const ResetListNamePopup = () => {
        setListName(<></>)
        ListSearchName.current.setAttribute("remove" , "")
    }

    // other
    const SearchFactorNameOther = async (e) => {
        const type_search = (type_path === "z") ? "fertilizer" : "chemical";
        ListSearchFactorNameMain.current.removeAttribute("remove")
        setLoadNameMain(false);
        let search = await FetchFactor(type_search)
        search = search.filter((val)=>
                            val.name_formula.indexOf(e.target.value) >= 0 && val.name.indexOf(NameFactor.current.value) >= 0)
                                .map((val)=>val.name_formula)
        const setSearch = ChangeData(search)
        if(setSearch.length !== 0) 
            setListOther(setSearch.map((val)=>
                <span search_other="" onClick={()=>SetTextInputOrther(val)} key={val.id}>{val}</span>
            ))
        else ResetListOtherPopup()
        setLoadNameMain(true);

        (type_path === "z") ? ChangeFerti() : ChangeChemi();
    }

    const SetTextInputOrther = (name) => {
        NameMainFactor.current.value = name;
        (type_path === "z") ? ChangeFerti() : ChangeChemi();
        ResetListOtherPopup()
    }

    const ResetListOtherPopup = () => {
        setListOther(<></>)
        ListSearchFactorNameMain.current.setAttribute("remove" , "")
    }

    // change how use 
    const setHowUse = () => {
        if(Use.current.value === "") {
            console.log(DataFactor)
            Use.current.value = DataFactor.filter((val)=>
                            val.name_formula.indexOf(NameMainFactor.current.value) >= 0 && val.name.indexOf(NameFactor.current.value) >= 0)
                                .map((val)=>val.how_use)[0]
        }
    }

    // math date sefe chemical
    const setDateSafe = () => {
        if(DateSafe.current.value === "") {
            const NumDay = DataFactor.filter((val)=>
                            val.name_formula.indexOf(NameMainFactor.current.value) >= 0 && val.name.indexOf(NameFactor.current.value) >= 0)
                                .map((val)=>val.date_sefe)[0]
            const DateUsePut = new Date(DateUse.current.value)
            DateUsePut.setDate(DateUsePut.getDate() + NumDay)
            const result = DateUsePut.toISOString().split("T")[0]
            DateSafe.current.value = result
        }
    }

    // off popup
    const OutListSearch = (e) => {
        if(e.target !== NameFactor.current && e.target !== ListSearchName.current && e.target.getAttribute("search_name") === null) 
            ResetListNamePopup()
        if(e.target !== NameMainFactor.current && e.target !== ListSearchFactorNameMain.current && e.target.getAttribute("search_other") === null) 
            ResetListOtherPopup()
    }

    // 
    const ChangeData = (DataFilter) => {
        const search = DataFilter
        const setSearch = new Set(search)
        const ObjectName = new Array
        setSearch.forEach(val=>ObjectName.push(val))
        return ObjectName
    }

    return(
        <section className="popup-content-fertilizer" onTouchStart={OutListSearch}>
            {/* <div className="head">แบบบันทึกเกษตรกร</div> */}
            <div className="form">
                <div className="head-form">
                    {type_path === "z" ? <span>แก้ไขปัจจัยการผลิต</span> : <span>แก้ไขสารเคมี</span>}
                </div>
                <div className="body-content">
                    <div className="frame-content">
                        <div className="content">
                            <div className="step">
                                <div className="num">1.</div>
                                <div className="body">
                                    { type_path === "z" ?
                                        <>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.date == 2 ? " not" : ""}`}>
                                                <span>ว/ด/ป ที่ใช้</span>
                                                <input onChange={ChangeFerti} defaultValue={ObjectData.date.split(" ")[0]} onClick={()=>clickDate(DateUse)} ref={DateUse} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.name == 2 ? " not" : ""}`}>
                                                <span className="full">ชื่อสิ่งที่ใช้ (ชื่อการค้า, ตรา)</span>
                                                <div className="content-colume-input">
                                                    <div className="input-select-popup">
                                                        <input onChange={SearchNameFactor} onMouseDown={SearchNameFactor} defaultValue={ObjectData.name} placeholder="กรอกชื่อปุ๋ย" ref={NameFactor}></input>
                                                        <div ref={ListSearchName} remove="" className="list-input-search">
                                                            {LoadSearchName ? 
                                                                ListSelectName : 
                                                                <div style={{
                                                                    display : "flex",
                                                                    justifyContent : "center" ,
                                                                    alignItems : "center"
                                                                }}> 
                                                                    <Loading size={"8vw"} border={"2vw"} color="green" animetion={true}/>
                                                                </div>
                                                                }
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.formula_name == 2 ? " not" : ""}`}>
                                                <span>ชื่อสูตรปุ๋ย</span>
                                                <div className="input-select-other">
                                                    <input onChange={SearchFactorNameOther} onMouseDown={SearchFactorNameOther} defaultValue={ObjectData.formula_name} ref={NameMainFactor} type="text" placeholder="กรอก"></input>
                                                    <div ref={ListSearchFactorNameMain} remove="" className="list-input-search">
                                                        {LoadSearchNameMain ? 
                                                            ListSelectNameMain :
                                                            <div style={{
                                                                display : "flex",
                                                                justifyContent : "center" ,
                                                                alignItems : "center"
                                                            }}> 
                                                                <Loading size={"8vw"} border={"2vw"} color="green" animetion={true}/>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.use_is == 2 ? " not" : ""}`}>
                                                <span className="full">วิธีการใช้</span>
                                                <textarea onChange={ChangeFerti} defaultValue={ObjectData.use_is} className="content-colume-input" style={{textAlign : "start"}} ref={Use}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.volume == 2 ? " not" : ""}`}>
                                                {/* <span>ปริมาณที่ใช้</span>
                                                <input onChange={ChangeFerti} defaultValue={ObjectData.volume} ref={Volume} type="number" placeholder="ตัวเลข"></input> */}
                                                <span>ปริมาณที่ใช้</span>
                                                <div className="input-volume">
                                                    <input onChange={ChangeFerti} ref={Volume} defaultValue={ObjectData.volume.split(" ")[0]} type="number" placeholder="ตัวเลข"></input>
                                                    <select onChange={ChangeFerti} ref={Unit} defaultValue={ObjectData.volume.split(" ")[1]}>
                                                        <option value={"ลิตร"}>ลิตร</option>
                                                        <option value={"ก.ก"}>ก.ก</option>
                                                    </select>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.source == 2 ? " not" : ""}`}>
                                                <span>แหล่งที่ซื้อ</span>
                                                {/* <input onChange={ChangeFerti} defaultValue={ObjectData.source} ref={Source} type="text" placeholder="กรอกข้อมูล"></input> */}
                                                {
                                                    DataSource.length != 0 && ObjectData.source ?
                                                        <select onChange={ChangeFerti} ref={Source} defaultValue={ObjectData.source}>
                                                            <option value={""} disabled>เลือก</option>
                                                            {
                                                                DataSource.map((val)=>
                                                                    <option key={val.id} value={val.name}>{val.name}</option>
                                                                )
                                                            }
                                                        </select> : <></>
                                                }
                                            </label>
                                        </div>
                                        </> :
                                        <>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.date == 2 ? " not" : ""}`}>
                                                <span>ว/ด/ป ที่พ่นสาร</span>
                                                <input onChange={ChangeChemi} defaultValue={ObjectData.date.split(" ")[0]} onClick={()=>clickDate(DateUse)} ref={DateUse} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.name == 2 ? " not" : ""}`}>
                                                <span className="full">ชื่อสารเคมี (ชื่อการค้า, ตรา)</span>
                                                <div className="content-colume-input">
                                                    <div className="input-select-popup">
                                                        <input onChange={SearchNameFactor} onMouseDown={SearchNameFactor}
                                                            defaultValue={ObjectData.name} placeholder="กรอกชื่อปุ๋ย" ref={NameFactor}></input>
                                                        <div ref={ListSearchName} remove="" className="list-input-search">
                                                            {LoadSearchName ? 
                                                                ListSelectName : 
                                                                <div style={{
                                                                    display : "flex",
                                                                    justifyContent : "center" ,
                                                                    alignItems : "center"
                                                                }}> 
                                                                    <Loading size={"8vw"} border={"2vw"} color="green" animetion={true}/>
                                                                </div>
                                                                }
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.formula_name == 2 ? " not" : ""}`}>
                                                <span>ชื่อสามัญสารเคมี</span>
                                                <div className="input-select-other">
                                                    <input onChange={SearchFactorNameOther} onMouseDown={SearchFactorNameOther} 
                                                        defaultValue={ObjectData.formula_name} ref={NameMainFactor} type="text" placeholder="กรอก"></input>
                                                    <div ref={ListSearchFactorNameMain} remove="" className="list-input-search">
                                                        {LoadSearchNameMain ? 
                                                            ListSelectNameMain :
                                                            <div style={{
                                                                display : "flex",
                                                                justifyContent : "center" ,
                                                                alignItems : "center"
                                                            }}> 
                                                                <Loading size={"8vw"} border={"2vw"} color="green" animetion={true}/>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.insect == 2 ? " not" : ""}`}>
                                                <span>ศัตรูพืชที่พบ</span>
                                                <input onChange={ChangeChemi} 
                                                    defaultValue={ObjectData.insect} ref={NameInsect} type="text" placeholder="ชื่อศัตรูพืช"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.use_is == 2 ? " not" : ""}`}>
                                                <span className="full">วิธีการใช้</span>
                                                <textarea className="content-colume-input" style={{textAlign : "start"}}
                                                    defaultValue={ObjectData.use_is} ref={Use}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.rate == 2 ? " not" : ""}`}>
                                                <span>อัตราที่ผสม</span>
                                                <input onChange={ChangeChemi} 
                                                    defaultValue={ObjectData.rate} ref={Rate} type="text" placeholder="กรอก 00/00"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.volume == 2 ? " not" : ""}`}>
                                                {/* <span>ปริมาณที่ใช้ทั้งหมด</span>
                                                <input onChange={ChangeChemi} 
                                                    defaultValue={ObjectData.volume} ref={Volume} type="number" placeholder="ตัวเลข"></input> */}
                                                <span>ปริมาณที่ใช้ทั้งหมด</span>
                                                <div className="input-volume">
                                                    <input onChange={ChangeChemi} ref={Volume} defaultValue={ObjectData.volume.split(" ")[0]} type="number" placeholder="ตัวเลข"></input>
                                                    <select onChange={ChangeChemi} ref={Unit} defaultValue={ObjectData.volume.split(" ")[1]}>
                                                        <option value={"กรัม"}>กรัม</option>
                                                        <option value={"มิลลิลิตร"}>มิลลิลิตร</option>
                                                    </select>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.date_safe == 2 ? " not" : ""}`}>
                                                <span>วันที่ปลอดภัย</span>
                                                <input onChange={ChangeChemi} 
                                                    defaultValue={ObjectData.date_safe.split(" ")[0]} onClick={()=>clickDate(DateSafe)} ref={DateSafe} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.source == 2 ? " not" : ""}`}>
                                                <span>แหล่งที่ซื้อ</span>
                                                {/* <input onChange={ChangeChemi} 
                                                    defaultValue={ObjectData.source} ref={Source} type="text" placeholder="กรอกข้อมูล"></input> */}
                                                {
                                                    DataSource.length != 0 && ObjectData.source ?
                                                        <select onChange={ChangeChemi} ref={Source} defaultValue={ObjectData.source}>
                                                            <option value={""} disabled>เลือก</option>
                                                            {
                                                                DataSource.map((val)=>
                                                                    <option key={val.id} value={val.name}>{val.name}</option>
                                                                )
                                                            }
                                                        </select> : <></>
                                                }
                                            </label>
                                        </div>
                                        </>
                                    }
                                    <div className="row">
                                        <label className={`frame-textbox colume`}>
                                            <span className="full">เหตุผลการแก้ไข</span>
                                            <textarea style={{
                                                textAlign : "start"
                                            }} onChange={type_path === "z" ? ChangeFerti : ChangeChemi} ref={Because} className="full"></textarea>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bt-form">
                    <button style={{backgroundColor : "#FF8484"}} className="bt-confirm-factor" onClick={cancel}>ยกเลิก</button>
                    { getWait ?
                        <div className="bt-confirm-factor" style={{
                            display : "flex",
                            justifyContent : "center",
                            alignItems : "center",
                            padding : "2px",
                            height : "30.8px"
                        }}>
                            <Loading size={27} border={5} color="white" animetion={true}/>
                        </div> :
                        <button ref={BTConfirm} className="bt-confirm-factor" no="" onClick={type_path === "z" ? ConfirmFerti : ConfirmChemi}>ยืนยัน</button>
                    }
                </div>
            </div>
        </section>
    )
}

export default EditFactorPopup