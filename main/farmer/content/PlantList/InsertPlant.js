import React , {useEffect , useRef, useState} from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { DAYUTC, Loading } from "../../../../src/assets/js/module";
import { CloseAccount } from "../../method";

let TimeOut = 0

const PopupInsertPlant = ({setPopup , RefPop , id_house , ReloadData , setPage}) =>{

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
                    Generation.current.value = Object[0].generation
                    DateGlow.current.value = Object[0].date_glow
                    DatePlant.current.value = Object[0].date_plant
                    PositionW.current.value = Object[0].posi_w
                    PositionH.current.value = Object[0].posi_h
                    Qty.current.value = Object[0].qty
                    Area.current.value = Object[0].area
                    DateOut.current.value = Object[0].date_harvest
                    System.current.value = Object[0].system_glow
                    Water.current.value = Object[0].water
                    WaterStep.current.value = Object[0].water_flow
                    History.current.value = Object[0].history
                    Insect.current.value = Object[0].insect
                    QtyInsect.current.value = Object[0].qtyInsect
                    Seft.current.value = Object[0].seft
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
        if(!BTConfirm.current.getAttribute("no")) {
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
            
            if(type.value && generetion.value && dateGlow.value && datePlant.value && 
                posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
                water.value && waterStep.value && history.value && insect.value && qtyInsect.value 
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

                    const Data = await clientMo.post("/api/farmer/formplant/insert" , data)
                    console.log(Data)
                    if(await CloseAccount(Data , setPage)) {
                        cancel()
                        ReloadData()
                    }
            } else {
                let RefObject = [
                            type , generetion , dateGlow , datePlant , 
                            posiW , posiH , qty , area , dateOut , system ,
                            water , waterStep , history , insect , qtyInsect 
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
        const history = History.current
        const insect = Insect.current
        const qtyInsect = QtyInsect.current
        
        if(type.value && generetion.value && dateGlow.value && datePlant.value && 
            posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
            water.value && waterStep.value && history.value && insect.value && qtyInsect.value 
            ) {
                BTConfirm.current.removeAttribute("no")
        } else {
            BTConfirm.current.setAttribute("no" , "")
        }
    }

    const OpenPopupPlant = async (e) => {
        ResetListPopup()
        await FetchDataForm(e.target.value)
        ListSearch.current.removeAttribute("remove")
        const search = DataPlant.filter((val , key)=>val.name.indexOf(TypePlantInput.current.value) >= 0)
        if(search.length !== 0) setListOther(search.map((val , key)=> <span onClick={(e)=>SetTextOnOther(val.name , e)} key={key}>{val.name}</span>))
        else ResetListPopup()

        ChangeCHK()
    }

    const SetTextOnOther = async (name) => {
        TypePlantInput.current.value = name
        await FetchDataForm(name)
        ChangeCHK()
        ResetListPopup()
    }

    const ResetListPopup = () => {
        setListOther(<></>)
        ListSearch.current.setAttribute("remove" , "")
    }

    return(
        <section className="popup-content">
            <div className="head">แบบบันทึกเกษตรกร</div>
            <div className="form">
                <div className="head-form">
                    <span>การปลูกของฉัน</span>
                </div>
                <div className="body-content">
                    { HistoryPlantLoad ? 
                        <div className="block-wait"></div>
                        : <></>
                    }
                    <div ref={FormContent} className="frame-content" over="">
                        <div className="content">
                            <div className="step">
                                <div className="num">1.</div>
                                <div className="body">
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ชนิดพืช</span>
                                            <div className="input-select-popup">
                                                <input onChange={OpenPopupPlant} onTouchStart={OpenPopupPlant} placeholder="กรอกชื่อพืช" ref={TypePlantInput}></input>
                                                <div ref={ListSearch} remove="" className="list-input-search">
                                                    {ListSelect}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>รุ่นที่ปลูก</span>
                                            <input onInput={ChangeCHK} ref={Generation} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>วันที่เพาะกล้า</span>
                                            <input onInput={ChangeCHK} ref={DateGlow} onClick={()=>clickDate(DateGlow)} type="date" placeholder="ว/ด/ป"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>วันที่ปลูก</span>
                                            <input onInput={ChangeCHK} ref={DatePlant} type="date" placeholder="ว/ด/ป"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox colume">
                                            <div className="full">ระยะการปลูก</div>
                                            <div className="choose">
                                                <label className="choose">
                                                    กว้าง
                                                    <input onInput={ChangeCHK} ref={PositionW} type="text" placeholder="กว้าง"></input>
                                                </label>
                                                <label className="choose">
                                                    ยาว
                                                    <input onInput={ChangeCHK} ref={PositionH} type="text" placeholder="ยาว"></input>
                                                </label>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>จำนวนต้น</span>
                                            <input onInput={ChangeCHK} ref={Qty} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>พื้นที่</span>
                                            <input onInput={ChangeCHK} ref={Area} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
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
                                        <label className="frame-textbox">
                                            <span>ระบบการปลูก</span>
                                            <select onChange={ChangeCHK} ref={System} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option>น้ำ</option>
                                                <option>ดิน</option>
                                            </select>
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
                                            <select onChange={ChangeCHK} ref={Water} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option>ลำธาร</option>
                                                <option>ปะปา</option>
                                            </select>
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
                                            <select onChange={ChangeCHK} ref={WaterStep} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option>ตักรด</option>
                                                <option>รดฝักบัว</option>
                                            </select>
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
                                            <textarea onInput={ChangeCHK} ref={History} type="" placeholder="กรอก"></textarea>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>โรคและแมลงที่พบ</span>
                                            <select onChange={ChangeCHK} ref={Insect} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option>แมลง</option>
                                                <option>เพี้ย</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ปริมาณการเกิดโรค และแมลงที่พบ</span>
                                            <select onChange={ChangeCHK} ref={QtyInsect} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option>แมลง</option>
                                                <option>เพี้ย</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="row">
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
                    <button style={{backgroundColor : "#FF8484"}} onClick={cancel}>ยกเลิก</button>
                    <button ref={BTConfirm} no="" onClick={Confirm}>ยืนยัน</button>
                </div>
            </div>
        </section>
    )
}

export default PopupInsertPlant