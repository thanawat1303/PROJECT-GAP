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
        const result = await clientMo.post("/api/farmer/formplant/select" , {id_formplant : id_plant , id_farmhouse : id_house})
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            setData(Data[0])
            setLoad(true)
        }
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
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

    const EditForm = () => {
        setStatusEdit(true)
        DataContent.current.setAttribute("edit" , "")
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
                                        "type_plant" , "generation" , "date_glow" , "date_plant" , 
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

                        const result = await clientMo.post("/api/farmer/formplant/edit" , data)
                        if(await CloseAccount(result , setPage)) {
                            if(result === "133") {
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
                    !StatusEdit ? 
                        <>
                        <div className="manage-form" ref={BtManageMenu.Frame} onClick={ShowMenuManageForm}>
                            <svg ref={BtManageMenu.Svg} fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path ref={BtManageMenu.Path} d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM8 24h16v-4h-16v4zM8 18.016h16v-4h-16v4zM8 12h16v-4h-16v4z"></path>
                            </svg>
                        </div>
                        <div className="manage-menu" ref={ManageMenu}>
                            <div onClick={EditForm}>แก้ไขข้อมูล</div>
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
                                            <label className="frame-textbox">
                                                <span>ชนิดพืช</span>
                                                <div className="input-select-popup">
                                                    <input ref={TypePlantInput} onChange={StatusEdit ? ChangeEdit : null} type="text" readOnly defaultValue={Data.name_plant}></input>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>รุ่นที่ปลูก</span>
                                                <input ref={Generation} onChange={StatusEdit ? ChangeEdit : null} type="number" readOnly defaultValue={Data.generation}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
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
                                            <label className="frame-textbox colume">
                                                <span className="full">วันที่ปลูก</span>
                                                <div className="full">
                                                    {
                                                        StatusEdit ?
                                                            <input ref={DatePlant} onChange={StatusEdit ? ChangeEdit : null} type="date" 
                                                            defaultValue={Data.date_plant.split(" ")[0]}></input> 
                                                            :
                                                            <DayJSX DATE={Data.date_plant} TYPE="normal"/>
                                                    }
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <div className="full">ระยะการปลูก</div>
                                                <div className="choose">
                                                    <label className="choose">
                                                        กว้าง
                                                        <input ref={PositionW} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.posi_w} ></input>
                                                    </label>
                                                    <label className="choose">
                                                        ยาว
                                                        <input ref={PositionH} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.posi_h}></input>
                                                    </label>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>จำนวนต้น</span>
                                                <input ref={Qty} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.qty}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>พื้นที่</span>
                                                <input ref={Area} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.area}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
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
                                            <label className="frame-textbox">
                                                <span>ระบบการปลูก</span>
                                                <input ref={System} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.system_glow}></input>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="num">3.</div>
                                    <div className="body">
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>แหล่งน้ำ</span>
                                                <input ref={Water} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.water}></input>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="num">4.</div>
                                    <div className="body">
                                    <div className="row">
                                            <label className="frame-textbox">
                                                <span>วิธีการให้น้ำ</span>
                                                <input ref={WaterStep} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.water_flow}></input>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="num">5.</div>
                                    <div className="body">
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ประวัติการใช้พื้นที่</span>
                                                <textarea style={{textAlign : "start" , padding : "0.5em"}} ref={History} readOnly defaultValue={Data.history}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>โรคและแมลงที่พบ</span>
                                                <input ref={Insect} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.insect}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ปริมาณการเกิดโรค และแมลงที่พบ</span>
                                                <input ref={QtyInsect} onChange={StatusEdit ? ChangeEdit : null} readOnly type="text" defaultValue={Data.qtyInsect}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
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
                                                    <label className="frame-textbox colume">
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