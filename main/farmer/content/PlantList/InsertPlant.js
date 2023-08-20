import React , {useEffect , useRef, useState} from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { DateSelect, DayJSX, Loading } from "../../../../src/assets/js/module";
import { CloseAccount } from "../../method";

let TimeOut = 0

const PopupInsertPlant = ({setPopup , RefPop , id_house , ReloadData , setPage}) =>{
    const [DateNowOnForm , setDateNowOnForm] = useState(`${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1).toString()).slice(-2)}-${("0" + new Date().getDate().toString()).slice(-2)}`)
    const [DateHarvest , setDateHarvest] = useState("")

    const FormContent = useRef()

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

    const ListSearch = useRef()
    const [ListSelect , setListOther] = useState(<></>)
    const [DataPlant , setDataPlant] = useState([])

    const [HistoryPlantLoad , setHistory] = useState(true)

    const BTConfirm = useRef()

    const [getWait , setWait] = useState(false)

    useEffect(()=>{
        FetchPlant()
        RefPop.current.setAttribute("show" , "")

        return() => {
            clearTimeout(TimeOut)
        }
    } , [])

    const FetchPlant = async () => {
        const Data = await clientMo.post("/api/farmer/plant/list")
        if(await CloseAccount(Data , setPage)) {
            const LIST = JSON.parse(Data)
            setDataPlant(LIST)
        }
    }

    const FetchDataForm = async (name_plant_list) => {
        setHistory(true)
        FormContent.current.setAttribute("over" , "")
        clearTimeout(TimeOut)
        TimeOut = setTimeout( async ()=>{
            const Data = await clientMo.post("/api/farmer/formplant/history" , {id_farmhouse : id_house , name_plant_list : name_plant_list})
            if(await CloseAccount(Data , setPage)) {
                try {
                    const Object = JSON.parse(Data)
                    if(Object.qtyDate.length != 0) {
                        MathDateHarvest(DateNowOnForm , Object.qtyDate[0].qty_harvest)
                        setDateHarvest(Object.qtyDate[0].qty_harvest)
                    }

                    if(Object.FromHistory.length !== 0) {
                        Generation.current.value = parseInt(Object.FromHistory[0].generation) + 1
                        // DateGlow.current.value = Object.FromHistory[0].date_glow
                        // DatePlant.current.value = Object.FromHistory[0].date_plant
                        PositionW.current.value = Object.FromHistory[0].posi_w
                        PositionH.current.value = Object.FromHistory[0].posi_h
                        Qty.current.value = Object.FromHistory[0].qty
                        Area.current.value = Object.FromHistory[0].area
                        System.current.value = Object.FromHistory[0].system_glow
                        Water.current.value = Object.FromHistory[0].water
                        WaterStep.current.value = Object.FromHistory[0].water_flow
                        History.current.value = Object.FromHistory[0].history
                        Insect.current.value = Object.FromHistory[0].insect
                        QtyInsect.current.value = Object.FromHistory[0].qtyInsect
                        Seft.current.value = Object.FromHistory[0].seft
                    }
                } catch (err) {
                    // Generation.current.value = ""
                    // DateGlow.current.value = ""
                    // DatePlant.current.value = ""
                    // PositionW.current.value = ""
                    // PositionH.current.value = ""
                    // Qty.current.value = ""
                    // Area.current.value = ""
                    // DateOut.current.value = ""
                    // System.current.value = ""
                    // Water.current.value = ""
                    // WaterStep.current.value = ""
                    // History.current.value = ""
                    // Insect.current.value = ""
                    // QtyInsect.current.value = ""
                    // Seft.current.value = ""
                }
            }
            if(name_plant_list !== "") {
                FormContent.current.removeAttribute("over")
                setHistory(false)
            }
        } , 1500)
    }

    const Confirm = async () => {
        // if(!BTConfirm.current.getAttribute("no") == null ) {
            
        // }

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
        
        if(type.value && generetion.value && dateGlow.value.split("-")[0] && datePlant.value && 
            posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
            water.value && waterStep.value
            // && seft.value
            ) {
                const data = {
                    id_farmhouse : id_house,
                    name_plant : type.value,
                    generetion : generetion.value,
                    dateGlow : dateGlow.value,
                    datePlant : datePlant.value,
                    posiW : posiW.value,
                    posiH : posiH.value,
                    qty : qty.value,
                    area : area.value,
                    dateOut : dateOut.value,
                    system : system.value,
                    water : water.value,
                    waterStep : waterStep.value,
                    history : history.value,
                    insect : insect.value,
                    qtyInsect : qtyInsect.value,
                    seft : seft.value
                }

                setWait(true)
                const Data = await clientMo.post("/api/farmer/formplant/insert" , data)
                if(await CloseAccount(Data , setPage)) {
                    cancel()
                    ReloadData()
                    setWait(false)
                }
        } else {
            // let RefObject = [
            //             type , generetion , dateGlow , datePlant , 
            //             posiW , posiH , qty , area , dateOut , system ,
            //             water , waterStep , history , insect , qtyInsect 
            //             // , seft
            //         ]
            // RefObject.forEach((ele , index)=>{
            //     if(!ele.value && ele) ele.style.border = "2px solid red"
            //     else if (ele.value && ele) ele.style.border = "2px solid transparent"
            // })
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

    const ChangeCHK = () => {
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
        // const history = History.current
        // const insect = Insect.current
        // const qtyInsect = QtyInsect.current
        
        if(type.value && generetion.value && dateGlow.value.split("-")[0] && datePlant.value && 
            posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
            water.value && waterStep.value 
            ) {
                BTConfirm.current.removeAttribute("no")
        } else {
            BTConfirm.current.setAttribute("no" , "")
        }
    }

    // const OpenPopupPlant = async (e) => {
    //     ResetListPopup()
    //     await FetchDataForm(e.target.value)
    //     ListSearch.current.removeAttribute("remove")
    //     const search = DataPlant.filter((val , key)=>val.name.indexOf(TypePlantInput.current.value) >= 0)
    //     if(search.length !== 0) setListOther(search.map((val , key)=> <span onClick={(e)=>SetTextOnOther(val.name , e)} key={key}>{val.name}</span>))
    //     else ResetListPopup()

    //     ChangeCHK()
    // }

    const SetTextOnOther = async (e) => {
        // TypePlantInput.current.value = name
        await FetchDataForm(e.target.value)
        ChangeCHK()
        // ResetListPopup()
    }

    const MathDateHarvest = (DatePlant , DateQty) => {
        try {
            const DatePlantQty = new Date(DatePlant)
            DatePlantQty.setDate(DatePlantQty.getDate() + parseInt(DateQty))
            DateOut.current.value = DatePlantQty.toISOString().split("T")[0]
        } catch(e) {}
    }

    // const ResetListPopup = () => {
    //     setListOther(<></>)
    //     ListSearch.current.setAttribute("remove" , "")
    // }

    return(
        <section className="popup-content">
            <div className="head">แบบบันทึกเกษตรกร</div>
            <div className="form">
                <div className="head-form">
                    <span>การปลูกของฉัน</span>
                </div>
                <div className="body-content">
                    <div ref={FormContent} className="frame-content" over="">
                        <div className="content">
                            <div className="step">
                                <div className="num">1.</div>
                                <div className="body">
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ชนิดพืช</span>
                                            <select onChange={SetTextOnOther} ref={TypePlantInput} defaultValue={""}>
                                                <option disabled value={""}>เลือกพืช</option>
                                                { 
                                                    DataPlant.map((plant , key)=>
                                                        <option key={key} value={plant.name}>{plant.name}</option>
                                                    )
                                                }
                                            </select>
                                            {/* <div className="input-select-popup">
                                                <input onChange={OpenPopupPlant} onTouchStart={OpenPopupPlant} placeholder="กรอกชื่อพืช" ref={TypePlantInput}></input>
                                                <div ref={ListSearch} remove="" className="list-input-search">
                                                    {ListSelect}
                                                </div>
                                            </div> */}
                                        </label>
                                        <span className="dot-required">*</span>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>รุ่นที่ปลูก</span>
                                            <input onInput={ChangeCHK} ref={Generation} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>วันที่เพาะกล้า (เฉพาะปีได้)</span>
                                            <DateSelect RefDate={DateGlow} methodCheckValue={ChangeCHK}/>
                                            {/* <input onInput={ChangeCHK} ref={DateGlow} onClick={()=>clickDate(DateGlow)} type="date" placeholder="ว/ด/ป"></input> */}
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>วันที่ปลูก</span>
                                            <input onInput={(e)=>{
                                                ChangeCHK()
                                                setDateNowOnForm(e.target.value)
                                                MathDateHarvest(e.target.value , DateHarvest)
                                            }} defaultValue={DateNowOnForm} ref={DatePlant} type="date" placeholder="ว/ด/ป"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox colume">
                                            <div className="full">ระยะการปลูก</div>
                                            <div className="choose">
                                                <label className="choose colume">
                                                    ระหว่างต้น
                                                    <input onInput={ChangeCHK} ref={PositionW} type="number" placeholder="" className="center"></input>
                                                </label>
                                                <div>X</div>
                                                <label className="choose colume">
                                                    ระหว่างแถว
                                                    <input onInput={ChangeCHK} ref={PositionH} type="number" placeholder="" className="center"></input>
                                                </label>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>จำนวนต้น</span>
                                            <input onInput={ChangeCHK} ref={Qty} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>พื้นที่</span>
                                            <input onInput={ChangeCHK} ref={Area} type="number" placeholder="ตารางเมตร"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>วันที่คาดว่า <br></br>จะเก็บเกี่ยว</span>
                                            <input onInput={ChangeCHK} ref={DateOut} type="date"></input>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="step">
                                <div className="num">2.</div>
                                <div className="body">
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>รูปแบบการปลูก</span>
                                            <select onChange={ChangeCHK} ref={System} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option value={"ขึ้นแปลงปลูกตามไหล่เขา"}>ขึ้นแปลงปลูกตามไหล่เขา</option>
                                                <option value={"ขึ้นแปลงปลูกที่ลุ่มหลังนา"}>ขึ้นแปลงปลูกที่ลุ่มหลังนา</option>
                                                <option value={"ปลูกแบบขึ้นค้าง"}>ปลูกแบบขึ้นค้าง</option>
                                                <option value={"ระบบ Hydroponic"}>ระบบ Hydroponic</option>
                                                <option value={"ปลูกในวัสดุปลูก"}>ปลูกในวัสดุปลูก</option>
                                                <option value={"ในโรงเรือน"}>ในโรงเรือน</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="step">
                                <div className="num">3.</div>
                                <div className="body">
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>แหล่งน้ำ</span>
                                            <select onChange={ChangeCHK} ref={Water} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option value={"อาศัยน้ำฝน"}>อาศัยน้ำฝน</option>
                                                <option value={"ลำธาร/คลองธรรมชาติ"}>ลำธาร/คลองธรรมชาติ</option>
                                                <option value={"บ่อบาดาล"}>บ่อบาดาล</option>
                                                <option value={"บ่อ/สระขุด"}>บ่อ/สระขุด</option>
                                                <option value={"คลองชลประทาน"}>คลองชลประทาน</option>
                                                <option value={"อ่างเก็บน้ำ"}>อ่างเก็บน้ำ</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="step">
                                <div className="num">4.</div>
                                <div className="body">
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <span className="dot-required">*</span>
                                        }
                                        <label className="frame-textbox">
                                            <span>วิธีการให้น้ำ</span>
                                            <select onChange={ChangeCHK} ref={WaterStep} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option value={"สปริงเกอร์"}>สปริงเกอร์</option>
                                                <option value={"ระบบน้ำหยด"}>ระบบน้ำหยด</option>
                                                <option value={"ปล่อยตามร่อง"}>ปล่อยตามร่อง</option>
                                                <option value={"ใช้สายยางรด"}>ใช้สายยางรด</option>
                                                <option value={"ตักรด"}>ตักรด</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="step">
                                <div className="num">5.</div>
                                <div className="body">
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <></>
                                        }
                                        <label className="frame-textbox">
                                            <span style={{width : "100%"}}>ประวัติการใช้พื้นที่และการเกิดโรคระบาด</span>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <></>
                                        }
                                        <label className="frame-textbox">
                                            <span>พืชที่ปลูกก่อนหน้า</span>
                                            <input onInput={ChangeCHK} ref={History} type="" placeholder="กรอก"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <></>
                                        }
                                        <label className="frame-textbox">
                                            <span>โรค/แมลงที่พบ</span>
                                            <select onChange={ChangeCHK} ref={Insect} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option value={"แมลง"}>แมลง</option>
                                                <option value={"ใบจุด"}>ใบจุด</option>
                                                <option value={"เพี้ย"}>เพี้ย</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <></>
                                        }
                                        <label className="frame-textbox">
                                            <span>ปริมาณการเกิดโรค และแมลงที่พบ</span>
                                            <select onChange={ChangeCHK} ref={QtyInsect} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option value={"น้อย"}>น้อย</option>
                                                <option value={"ปานกลาง"}>ปานกลาง</option>
                                                <option value={"มาก"}>มาก</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="row">
                                        { HistoryPlantLoad ? 
                                            <div className="block-wait"></div>
                                            : <></>
                                        }
                                        <label className="frame-textbox">
                                            <span>การป้องกันกำจัด</span>
                                            <textarea ref={Seft} type="text" placeholder="กรอก"></textarea>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bt-form">
                    <button className="bt-confirm-add" style={{backgroundColor : "#FF8484"}} onClick={cancel}>ยกเลิก</button>
                    { getWait ?
                        <div className="bt-confirm-add" style={{
                            display : "flex",
                            justifyContent : "center",
                            alignItems : "center",
                            padding : "2px",
                            height : "31.2px"
                        }}>
                            <Loading size={27} border={5} color="white" animetion={true}/>
                        </div>
                        :
                        <button className="bt-confirm-add" ref={BTConfirm} no="" onClick={Confirm}>ยืนยัน</button>
                    }
                </div>
            </div>
        </section>
    )
}

export default PopupInsertPlant