import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";

import "./assets/DataForm.scss"
import { DayJSX } from "../../../../src/assets/js/module";
import MenuPlant from "../PlantList/MenuPlant";
import DetailEdit from "../DetailEdit";
const DataForm = ({ setBody , id_house , id_plant , liff , setPage , isClick = 0}) => {
    const [Data , setData] = useState([])
    const [Load , setLoad] = useState(false)
    const [StatusEdit , setStatusEdit] = useState(false)
    const [Popup , setPopup] = useState(<></>)
    const [DataPlant , setDataPlant] = useState([])
    const [QtyDate , setQtyDate] = useState(0)

    const PopupRef = useRef()
    const ManageMenu = useRef()
    const BtManageMenu = {
        Frame : useRef(),
        Svg : useRef(),
        Path : useRef()
    }
    const DataContent = useRef()

    const TypePlantInput = useRef()
    const Generation = useRef()
    const DateGlow = useRef()
    const DatePlant = useRef()
    const PositionW = useRef()
    const PositionH = useRef()
    const Qty = useRef()
    const Area = useRef()
    const DateOut = useRef()
    const System = useRef()
    const Water = useRef()
    const WaterStep = useRef()
    const History = useRef()
    const Insect = useRef()
    const QtyInsect = useRef()
    const Seft = useRef()

    const Because = useRef()

    const BtConfirm = useRef()

    useEffect(()=>{
        setPage("DataForm")
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/d/${id_plant}`)
        window.addEventListener("touchstart" , CloseManageMenu)
        FetchData()

        return () => {
            window.removeEventListener("touchstart" , CloseManageMenu)
        }
    } , [])

    const FetchData = async () => {
        setData([])
        const result = await clientMo.post("/api/farmer/formplant/select" , {id_formplant : id_plant , id_farmhouse : id_house})
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            setData(Data[0])
            setLoad(true)

            console.log(Data)
        }
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    }

    const FetchPlant = async () => {
        setDataPlant([])
        const DataFetch = await clientMo.post("/api/farmer/plant/list")
        if(await CloseAccount(DataFetch , setPage)) {
            const LIST = JSON.parse(DataFetch)
            const SelectPlant = LIST.filter(val=>val.name == Data.name_plant)
            setDataPlant(LIST)
            setQtyDate(SelectPlant.length != 0 ? SelectPlant[0].qty_harvest : 0)
        }
    }

    const ReturnPage = async () =>{
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setBody(<MenuPlant setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} isClick={1} liff={liff} />)
        }
    }

    const ShowMenuManageForm = () => {
        ManageMenu.current.toggleAttribute("show")
    }

    const CloseManageMenu = (e) => {
        if(ManageMenu.current) {
            if(e.target !== BtManageMenu.Frame.current 
                && e.target !== BtManageMenu.Svg.current 
                && e.target !== BtManageMenu.Path.current) ManageMenu.current.removeAttribute("show")
        }
    }

    const EditForm = async () => {
        await FetchPlant()
        DataContent.current.setAttribute("edit" , "")
        setStatusEdit(true)
        document.querySelectorAll("#data-form-page *[readonly='']").forEach((val)=>{
            if(val.getAttribute("date_dom") !== "") {
                val.removeAttribute("readonly")
            }
        })
    }

    const CancelEdit = () => {
        setLoad(false)
        setStatusEdit(false)
        DataContent.current.removeAttribute("edit")
        setTimeout(()=>{
            setLoad(true)
        } , 100)
    }

    // start Edit
    const ConfirmEdit = async () => {
        if(BtConfirm.current.getAttribute("no") == null) {
            const type = TypePlantInput.current
            const generetion = Generation.current
            const dateGlow = DateGlow.current
            const datePlant = DatePlant.current
            const posiW = PositionW.current
            const posiH = PositionH.current
            const qty = Qty.current
            const area = Area.current
            const dateOut = DateOut.current
            const system = System.current
            const water = Water.current
            const waterStep = WaterStep.current
            const history = History.current
            const insect = Insect.current
            const qtyInsect = QtyInsect.current
            const seft = Seft.current

            const because = Because.current

            const CheckChange = [
                type.value != Data.name_plant ,
                generetion.value != Data.generation ,
                dateGlow.value != Data.date_glow.split(" ")[0],
                datePlant.value != Data.date_plant.split(" ")[0],
                posiW.value != Data.posi_w,
                posiH.value != Data.posi_h ,
                qty.value != Data.qty ,
                area.value != Data.area ,
                dateOut.value != Data.date_harvest.split(" ")[0],
                system.value != Data.system_glow ,
                water.value != Data.water ,
                waterStep.value != Data.water_flow ,
                history.value != Data.history ,
                insect.value != Data.insect ,
                qtyInsect.value != Data.qtyInsect , 
                seft.value != Data.seft
            ]

            if( 
                (type.value && generetion.value && dateGlow.value && datePlant.value && 
                posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
                water.value && waterStep.value && history.value && insect.value && qtyInsect.value && because.value) 
                && 
                (
                    CheckChange.filter(val=>val)[0]
                )
                    ) {
                        const Key = [ 
                                        "name_plant" , "generation" , "date_glow" , "date_plant" , 
                                        "posi_w" , "posi_h" , "qty" , "area" , "date_harvest" , "system_glow" ,
                                        "water" , "water_flow" , "history" , "insect" , "qtyInsect" , "seft"
                                    ]
                        const Value = [
                                        type.value,
                                        generetion.value,
                                        dateGlow.value,
                                        datePlant.value,
                                        posiW.value,
                                        posiH.value,
                                        qty.value,
                                        area.value,
                                        dateOut.value,
                                        system.value,
                                        water.value,
                                        waterStep.value,
                                        history.value,
                                        insect.value,
                                        qtyInsect.value, 
                                        seft.value
                                    ]
        
                        const foundChange = CheckChange.map((val , index) => (val) ? [ Key[index] , Value[index] ] : "").filter(val => val !== "")
                        const data = {
                            id_farmhouse : id_house,
                            id_plant : id_plant ,
                            because : because.value,
                            dataChange : Object.fromEntries(new Map([...foundChange])),
                            num : foundChange.length
                        }

                        console.log(data)

                        const result = await clientMo.post("/api/farmer/formplant/edit" , data)
                        if(await CloseAccount(result , setPage)) {
                            console.log(result)
                            if(result === "133") {
                                CancelEdit()
                                FetchData()
                            } else if (result === "submit") {
                                CancelEdit()
                                FetchData()
                            }
                        }  
            } else {
                let RefObject = [
                    type , generetion , dateGlow , datePlant , 
                    posiW , posiH , qty , area , dateOut , system ,
                    water , waterStep , history , insect , qtyInsect , because
                    // , seft
                ]
                RefObject.forEach((ele)=>{
                    if(!ele.value && ele) ele.style.border = "2px solid red"
                    else if (ele.value && ele) ele.style.border = "2px solid transparent"
                })
            }
        }
    }

    const ChangeEdit = () => {
        const type = TypePlantInput.current
        const generetion = Generation.current
        const dateGlow = DateGlow.current
        const datePlant = DatePlant.current
        const posiW = PositionW.current
        const posiH = PositionH.current
        const qty = Qty.current
        const area = Area.current
        const dateOut = DateOut.current
        const system = System.current
        const water = Water.current
        const waterStep = WaterStep.current
        const history = History.current
        const insect = Insect.current
        const qtyInsect = QtyInsect.current
        const seft = Seft.current

        const because = Because.current

        const CheckChange = [
            type.value != Data.name_plant ,
            generetion.value != Data.generation ,
            dateGlow.value != Data.date_glow.split(" ")[0],
            datePlant.value != Data.date_plant.split(" ")[0],
            posiW.value != Data.posi_w,
            posiH.value != Data.posi_h ,
            qty.value != Data.qty ,
            area.value != Data.area ,
            dateOut.value != Data.date_harvest.split(" ")[0],
            system.value != Data.system_glow ,
            water.value != Data.water ,
            waterStep.value != Data.water_flow ,
            history.value != Data.history ,
            insect.value != Data.insect ,
            qtyInsect.value != Data.qtyInsect , 
            seft.value != Data.seft
        ]

        if( 
            (type.value && generetion.value && dateGlow.value && datePlant.value && 
            posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
            water.value && waterStep.value && history.value && insect.value && qtyInsect.value && because.value) 
            && 
            (
                CheckChange.filter(val=>val)[0]
            )
                ) {
                BtConfirm.current.removeAttribute("no" , "")
        } else {
            BtConfirm.current.setAttribute("no" , "")
        }
    }
    // end Edit

    // history Edit
    const HistoryEdit = async () => {
        setPopup(<DetailEdit Ref={PopupRef} setRef={setPopup} setPage={setPage} Data_on={{
            id_house : id_house , id_plant : id_plant
        }} type={"plant"}/>)
    }

    const reportEdit = () => {
        
    }

    return (
        <section className="data-form-page" id="data-form-page">
            <div className="head">
                <div className="return" onClick={ReturnPage}>
                    <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                        <g fillRule="evenodd">
                            <path d="M1052 92.168 959.701 0-.234 959.935 959.701 1920l92.299-92.43-867.636-867.635L1052 92.168Z"/>
                            <path d="M1920 92.168 1827.7 0 867.766 959.935 1827.7 1920l92.3-92.43-867.64-867.635L1920 92.168Z"/>
                        </g>
                    </svg>
                </div>
                <span>ข้อมูลแบบบันทึก</span>
                {
                    !StatusEdit && Load ? 
                        <>
                        <div className="manage-form" ref={BtManageMenu.Frame} onClick={ShowMenuManageForm}>
                            <svg ref={BtManageMenu.Svg} fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path ref={BtManageMenu.Path} d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM8 24h16v-4h-16v4zM8 18.016h16v-4h-16v4zM8 12h16v-4h-16v4z"></path>
                            </svg>
                        </div>
                        <div className="manage-menu" ref={ManageMenu}>
                            { Data.submit < 2 ?
                                <div onClick={EditForm}>แก้ไขข้อมูล</div>
                                : <></>
                            }
                            <div onClick={HistoryEdit}>ประวัติแก้ไข</div>
                        </div>
                        </> : <></>
                }
            </div>
            <div className="form">
                <div className="data-content" ref={DataContent}>
                    <div className="frame-content">
                        { Load ? 
                            <div className="content">
                                <div className="step">
                                    <div className="num">1.</div>
                                    <div className="body">
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.name_plant == 2 ? " not" : ""}`}>
                                                <span>ชนิดพืช</span>
                                                <div className="input-select-popup">
                                                    { StatusEdit ?
                                                        DataPlant.length != 0 ?
                                                            <select style={{width : "100%"}} onChange={(e)=>{
                                                                ChangeEdit()

                                                                const SelectPlant = DataPlant.filter(val=>val.name == e.target.value)
                                                                const DatePlantQty = new Date(DatePlant.current.value)

                                                                setQtyDate(SelectPlant[0].qty_harvest)
                                                                DatePlantQty.setDate(DatePlantQty.getDate() + parseInt(SelectPlant[0].qty_harvest))
                                                                DateOut.current.value = DatePlantQty.toISOString().split("T")[0]

                                                            }} ref={TypePlantInput} defaultValue={Data.name_plant}>
                                                                <option disabled value={""}>เลือกพืช</option>
                                                                { 
                                                                    DataPlant.map((plant , key)=>
                                                                        <option key={key} value={plant.name}>{plant.name}</option>
                                                                    )
                                                                }
                                                            </select> : <></>
                                                        : <input readOnly defaultValue={Data.name_plant}></input>
                                                    }
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.generation == 2 ? " not" : ""}`}>
                                                <span>รุ่นที่ปลูก</span>
                                                <input ref={Generation} onChange={StatusEdit ? ChangeEdit : null} type="number" readOnly defaultValue={Data.generation}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${Data.subjectResult.date_glow == 2 ? " not" : ""}`}>
                                                <span className="full">วันที่เพาะกล้า</span>
                                                <div className="full">
                                                    {
                                                        StatusEdit ? 
                                                            <input ref={DateGlow} onChange={StatusEdit ? ChangeEdit : null} type="date" 
                                                            defaultValue={Data.date_glow.split(" ")[0]}></input> 
                                                            : 
                                                            <DayJSX DATE={Data.date_glow} TYPE="normal"/>
                                                    }
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${Data.subjectResult.date_plant == 2 ? " not" : ""}`}>
                                                <span className="full">วันที่ปลูก</span>
                                                <div className="full">
                                                    {
                                                        StatusEdit ?
                                                            <input ref={DatePlant} onChange={StatusEdit ? (e)=>{
                                                                ChangeEdit()

                                                                const DatePlantQty = new Date(e.target.value)
                                                                DatePlantQty.setDate(DatePlantQty.getDate() + parseInt(QtyDate))
                                                                DateOut.current.value = DatePlantQty.toISOString().split("T")[0]

                                                            } : null} type="date" 
                                                            defaultValue={Data.date_plant.split(" ")[0]}></input> 
                                                            :
                                                            <DayJSX DATE={Data.date_plant} TYPE="normal"/>
                                                    }
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${Data.subjectResult.posi_w == 2 || Data.subjectResult.posi_h == 2 ? " not" : ""}`}>
                                                <div className="full">ระยะการปลูก</div>
                                                <div className="choose">
                                                    <label className="choose">
                                                        กว้าง
                                                        <input ref={PositionW} onChange={StatusEdit ? ChangeEdit : null} readOnly type="number" defaultValue={Data.posi_w} ></input>
                                                    </label>
                                                    <label className="choose">
                                                        ยาว
                                                        <input ref={PositionH} onChange={StatusEdit ? ChangeEdit : null} readOnly type="number" defaultValue={Data.posi_h}></input>
                                                    </label>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.qty == 2 ? " not" : ""}`}>
                                                <span>จำนวนต้น</span>
                                                <input ref={Qty} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.qty}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.area == 2 ? " not" : ""}`}>
                                                <span>พื้นที่</span>
                                                <input ref={Area} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.area}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${Data.subjectResult.date_harvest == 2 ? " not" : ""}`}>
                                                <span className="full">วันที่คาดว่าจะเก็บเกี่ยว</span>
                                                <div className="full">
                                                <div className="full">
                                                    {
                                                        StatusEdit ?
                                                            <input ref={DateOut} onChange={StatusEdit ? ChangeEdit : null} type="date" 
                                                            defaultValue={Data.date_harvest.split(" ")[0]}></input> 
                                                            :
                                                            <DayJSX DATE={Data.date_harvest} TYPE="normal"/>
                                                    }
                                                </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="num">2.</div>
                                    <div className="body">
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.system_glow == 2 ? " not" : ""}`}>
                                                <span>ระบบการปลูก</span>
                                                { StatusEdit ?
                                                    <select onChange={ChangeEdit} ref={System} defaultValue={Data.system_glow}>
                                                        <option disabled value="">เลือก</option>
                                                        <option value={"ขึ้นแปลงปลูกตามไหล่เขา"}>ขึ้นแปลงปลูกตามไหล่เขา</option>
                                                        <option value={"ขึ้นแปลงปลูกที่ลุ่มหลังนา"}>ขึ้นแปลงปลูกที่ลุ่มหลังนา</option>
                                                        <option value={"ปลูกแบบขึ้นค้าง"}>ปลูกแบบขึ้นค้าง</option>
                                                        <option value={"ระบบ Hydroponic"}>ระบบ Hydroponic</option>
                                                        <option value={"ปลูกในวัสดุปลูก"}>ปลูกในวัสดุปลูก</option>
                                                        <option value={"ในโรงเรือน"}>ในโรงเรือน</option>
                                                    </select>
                                                    : <input readOnly defaultValue={Data.system_glow}></input>
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="num">3.</div>
                                    <div className="body">
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.water == 2 ? " not" : ""}`}>
                                                <span>แหล่งน้ำ</span>
                                                { StatusEdit ?
                                                    <select onChange={ChangeEdit} ref={Water} defaultValue={Data.water}>
                                                        <option disabled value="">เลือก</option>
                                                        <option value={"อาศัยน้ำฝน"}>อาศัยน้ำฝน</option>
                                                        <option value={"ลำธาร/คลองธรรมชาติ"}>ลำธาร/คลองธรรมชาติ</option>
                                                        <option value={"บ่อบาดาล"}>บ่อบาดาล</option>
                                                        <option value={"บ่อ/สระขุด"}>บ่อ/สระขุด</option>
                                                        <option value={"คลองชลประทาน"}>คลองชลประทาน</option>
                                                        <option value={"อ่างเก็บน้ำ"}>อ่างเก็บน้ำ</option>
                                                    </select>
                                                    : <input readOnly defaultValue={Data.water}></input>
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="num">4.</div>
                                    <div className="body">
                                    <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.water_flow == 2 ? " not" : ""}`}>
                                                <span>วิธีการให้น้ำ</span>
                                                { StatusEdit ?
                                                    <select onChange={ChangeEdit} ref={WaterStep} defaultValue={Data.water_flow}>
                                                        <option disabled value="">เลือก</option>
                                                        <option value={"สปริงเกอร์"}>สปริงเกอร์</option>
                                                        <option value={"ระบบน้ำหยด"}>ระบบน้ำหยด</option>
                                                        <option value={"ปล่อยตามร่อง"}>ปล่อยตามร่อง</option>
                                                        <option value={"ใช้สายยางรด"}>ใช้สายยางรด</option>
                                                        <option value={"ตักรด"}>ตักรด</option>
                                                    </select>
                                                    : <input readOnly defaultValue={Data.water_flow}></input>
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="num">5.</div>
                                    <div className="body">
                                        <div className="row">
                                            <label className={`frame-textbox`}>
                                                <span style={{width : "100%"}}>ประวัติการใช้พื้นที่และการเกิดโรคระบาด</span>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.history == 2 ? " not" : ""}`}>
                                                <span>พืชที่ปลูกก่อนหน้า</span>
                                                <input ref={History} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.history}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.insect == 2 ? " not" : ""}`}>
                                                <span>โรค/แมลงที่พบ</span>
                                                { StatusEdit ?
                                                    <select onChange={ChangeEdit} ref={Insect} defaultValue={Data.insect}>
                                                        <option disabled value="">เลือก</option>
                                                        <option value={"แมลง"}>แมลง</option>
                                                        <option value={"ใบจุด"}>ใบจุด</option>
                                                        <option value={"เพี้ย"}>เพี้ย</option>
                                                    </select>
                                                    : <input readOnly defaultValue={Data.insect}></input>
                                                }
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.qtyInsect == 2 ? " not" : ""}`}>
                                                <span>ปริมาณการเกิดโรค และแมลงที่พบ</span>
                                                { StatusEdit ?
                                                    <select onChange={ChangeEdit} ref={QtyInsect} defaultValue={Data.qtyInsect}>
                                                        <option disabled value="">เลือก</option>
                                                        <option value={"น้อย"}>น้อย</option>
                                                        <option value={"ปานกลาง"}>ปานกลาง</option>
                                                        <option value={"มาก"}>มาก</option>
                                                    </select>
                                                    : <input readOnly defaultValue={Data.qtyInsect}></input>
                                                }
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${Data.subjectResult.seft == 2 ? " not" : ""}`}>
                                                <span>การป้องกันกำจัด</span>
                                                <textarea style={{textAlign : "start" , padding : "0.5em"}} ref={Seft} onChange={StatusEdit ? ChangeEdit : null} readOnly defaultValue={Data.seft}></textarea>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    StatusEdit ?
                                        <div className="step">
                                            <div className="body">
                                                <div className="row">
                                                    <label className={`frame-textbox colume`}>
                                                        <span className="full">เหตุผลการแก้ไข</span>
                                                        <textarea style={{textAlign : "start" , padding : "0.5em"}} className="full" onChange={ChangeEdit} ref={Because}></textarea>
                                                    </label>
                                                </div>
                                            </div>
                                        </div> : <></>
                                }
                            </div> : <></>
                        }
                    </div>
                </div>
                {
                    StatusEdit ? 
                    <div className="bt">
                        <button style={{backgroundColor : "red"}} onClick={CancelEdit}>ยกเลิก</button>
                        <button ref={BtConfirm} no="" onClick={ConfirmEdit}>ยืนยัน</button>
                    </div>
                    : <></>
                }
            </div>
            <div className="popup-detail-edit" ref={PopupRef}>
                {Popup}
            </div>
        </section>
    )
}

export default DataForm