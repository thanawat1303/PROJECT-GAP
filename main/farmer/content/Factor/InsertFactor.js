import React, { useRef , useEffect, useState} from "react";
import "./assets/ListFertilizer.scss"
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";
import { Loading } from "../../../../src/assets/js/module";

const PopupInsertFactor = ({setPopup , RefPop , uid , id_house , id_form_plant , type_path , ReloadData , setPage}) => {
    const DateNowOnForm = `${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1).toString()).slice(-2)}-${("0" + new Date().getDate().toString()).slice(-2)}`
    // same
    const DateUse = useRef()
    const NameMainFactor = useRef()
    const NameFactor = useRef()
    const Use = useRef()
    const Volume = useRef()
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
        const dateUse = DateUse.current
        const formula_name = NameMainFactor.current
        const Name = NameFactor.current
        const use = Use.current
        const volume = Volume.current
        const source = Source.current

        if( dateUse.value && formula_name.value && Name.value && use.value && volume.value && source.value
            ) {
                let data = {
                    id_farmhouse : id_house,
                    id_plant : id_form_plant,
                    date : dateUse.value,
                    formula_name : formula_name.value,
                    name : Name.value,
                    use : use.value,
                    volume : volume.value,
                    source : source.value,
                    type_insert : type_path
                }

                const result = await clientMo.post("/api/farmer/factor/insert" , data)
                if(await CloseAccount(result , setPage)) {
                    cancel()
                    ReloadData()
                }
        } else {
            let RefObject = [
                        dateUse ,
                        formula_name ,
                        Name ,
                        use ,
                        volume ,
                        source ,
                        // , seft
                    ]
            RefObject.forEach((ele , index)=>{
                if(!ele.value && ele) ele.style.border = "2px solid red"
                else if (ele.value && ele) ele.style.border = "2px solid transparent"
            })
        }
    }

    const ConfirmChemi = async () => {
        const dateUse = DateUse.current
        const formula_name = NameMainFactor.current
        const Name = NameFactor.current
        const insect = NameInsect.current
        const use = Use.current
        const rate = Rate.current
        const volume = Volume.current
        const dateSafe = DateSafe.current
        const source = Source.current

        if( dateUse.value && formula_name.value && Name.value 
                && insect.value && use.value && rate.value
                && volume.value && dateSafe.value && source.value
            ) {
                let data = {
                    id_farmhouse : id_house,
                    id_plant : id_form_plant,
                    date : dateUse.value,
                    formula_name : formula_name.value,
                    name : Name.value,
                    insect : insect.value,
                    use : use.value,
                    rate : rate.value,
                    volume : volume.value,
                    dateSafe : dateSafe.value,
                    source : source.value,
                    type_insert : type_path
                }

                const result = await clientMo.post("/api/farmer/factor/insert" , data)
                if(await CloseAccount(result , setPage)) {
                    cancel()
                    ReloadData()
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
                        // , seft
                    ]
            RefObject.forEach((ele , index)=>{
                if(!ele.value && ele) ele.style.border = "2px solid red"
                else if (ele.value && ele) ele.style.border = "2px solid transparent"
            })
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
        const source = Source.current

        if(!e) {
            if(Name.value && formula_name.value) {
                setHowUse()
            }
        }
        
        if( dateUse.value && formula_name.value && Name.value && use.value && volume.value && source.value
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
        const dateSafe = DateSafe.current
        const source = Source.current

        if(!e) {
            if(Name.value && formula_name.value) {
                setHowUse()
                setDateSafe() 
            }
        }

        if( dateUse.value && formula_name.value && Name.value 
                && insect.value && use.value && rate.value
                && volume.value && dateSafe.value && source.value
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
            setListName(setSearch.map((val , key)=>
                <span search_name="" onClick={()=>SetTextInputName(val)} key={key}>{val}</span>
            ))
        else ResetListNamePopup()
        setLoadName(true);

        (type_path === "z") ? ChangeFerti() : ChangeChemi()
    }

    const SetTextInputName = (name) => {
        NameFactor.current.value = name;
        (type_path === "z") ? ChangeFerti() : ChangeChemi()
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
            setListOther(setSearch.map((val , key)=>
                <span search_other="" onClick={()=>SetTextInputOrther(val)} key={key}>{val}</span>
            ))
        else ResetListOtherPopup()
        setLoadNameMain(true);

        (type_path === "z") ? ChangeFerti() : ChangeChemi()
    }

    const SetTextInputOrther = (name) => {
        NameMainFactor.current.value = name;
        (type_path === "z") ? ChangeFerti() : ChangeChemi()
        ResetListOtherPopup()
    }

    const ResetListOtherPopup = () => {
        setListOther(<></>)
        ListSearchFactorNameMain.current.setAttribute("remove" , "")
    }

    // change how use 
    const setHowUse = () => {
        if(Use.current.value === "") {
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
            <div className="head">แบบบันทึกเกษตรกร</div>
            <div className="form">
                <div className="head-form">
                    {type_path === "z" ? <span>ปัจจัยการผลิต</span> : <span>สารเคมี</span>}
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
                                            <label className="frame-textbox">
                                                <span>ว/ด/ป ที่ใช้</span>
                                                <input onChange={ChangeFerti} defaultValue={DateNowOnForm} onClick={()=>clickDate(DateUse)} ref={DateUse} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">ชื่อสิ่งที่ใช้ (ชื่อการค้า, ตรา)</span>
                                                <div className="content-colume-input">
                                                    <div className="input-select-popup">
                                                        <input onChange={SearchNameFactor} onMouseDown={SearchNameFactor} placeholder="กรอกชื่อปุ๋ย" ref={NameFactor}></input>
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
                                            <label className="frame-textbox">
                                                <span>ชื่อสูตรปุ๋ย</span>
                                                <div className="input-select-other">
                                                    <input onChange={SearchFactorNameOther} onMouseDown={SearchFactorNameOther} ref={NameMainFactor} type="text" placeholder="กรอก"></input>
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
                                            <label className="frame-textbox colume">
                                                <span className="full">วิธีการใช้</span>
                                                <textarea onChange={ChangeFerti} className="content-colume-input" style={{textAlign : "left"}} ref={Use}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ปริมาณที่ใช้</span>
                                                <input onChange={ChangeFerti} ref={Volume} type="number" placeholder="ตัวเลข"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>แหล่งที่ซื้อ</span>
                                                {/* <input onChange={ChangeFerti} ref={Source} type="text" placeholder="กรอกข้อมูล"></input> */}
                                                <select onChange={ChangeFerti} ref={Source} defaultValue={""}>
                                                    <option value={""} disabled>เลือก</option>
                                                        { 
                                                            DataSource ?
                                                                DataSource.map((val , key)=>
                                                                    <option value={val.name}>{val.name}</option>
                                                                ) : <></>
                                                        }
                                                </select>
                                            </label>
                                        </div>
                                        </> :
                                        <>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ว/ด/ป ที่ใช้</span>
                                                <input onChange={ChangeChemi} defaultValue={DateNowOnForm} onClick={()=>clickDate(DateUse)} ref={DateUse} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">ชื่อสารเคมี (ชื่อการค้า, ตรา)</span>
                                                <div className="content-colume-input">
                                                    <div className="input-select-popup">
                                                        <input onChange={SearchNameFactor} onMouseDown={SearchNameFactor} placeholder="กรอกชื่อปุ๋ย" ref={NameFactor}></input>
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
                                            <label className="frame-textbox">
                                                <span>ชื่อสามัญสารเคมี</span>
                                                <div className="input-select-other">
                                                    <input onChange={SearchFactorNameOther} onMouseDown={SearchFactorNameOther} ref={NameMainFactor} type="text" placeholder="กรอก"></input>
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
                                            <label className="frame-textbox">
                                                <span>ศัตรูพืชที่พบ</span>
                                                <input onChange={ChangeChemi} ref={NameInsect} type="text" placeholder="ชื่อศัตรูพืช"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">วิธีการใช้</span>
                                                <textarea className="content-colume-input" style={{textAlign : "left"}} ref={Use}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>อัตราที่ผสม</span>
                                                <input onChange={ChangeChemi} ref={Rate} type="text" placeholder="กรอก 00/00"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ปริมาณที่ใช้ทั้งหมด</span>
                                                <input onChange={ChangeChemi} ref={Volume} type="number" placeholder="ตัวเลข"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>วันที่ปลอดภัย</span>
                                                <input onChange={ChangeChemi} onClick={()=>clickDate(DateSafe)} ref={DateSafe} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>แหล่งที่ซื้อ</span>
                                                {/* <input onChange={ChangeChemi} ref={Source} type="text" placeholder="กรอกข้อมูล"></input> */}
                                                <select onChange={ChangeChemi} ref={Source} defaultValue={""}>
                                                    <option value={""} disabled>เลือก</option>
                                                    { 
                                                        DataSource ?
                                                            DataSource.map((val , key)=>
                                                                <option value={val.name}>{val.name}</option>
                                                            ) : <></>
                                                    }
                                                </select>
                                            </label>
                                        </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bt-form">
                    <button style={{backgroundColor : "#FF8484"}} onClick={cancel}>ยกเลิก</button>
                    <button ref={BTConfirm} no="" onClick={type_path === "z" ? ConfirmFerti : ConfirmChemi}>ยืนยัน</button>
                </div>
            </div>
        </section>
    )
}

export default PopupInsertFactor