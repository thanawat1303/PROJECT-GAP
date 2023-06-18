import React , {useEffect , useRef, useState} from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { DAYUTC, Loading } from "../../../../src/assets/js/module";
import { CloseAccount } from "../../method";

const PopupInsertPlant = ({setPopup , RefPop , id_house , ReloadData}) =>{

    const FormContent = useRef()

    const TypePlant = useRef()
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

    const [SELECT , setSelect] = useState(<></>)
    const [LoadingSelect , setLoading] = useState(false)

    const [HistoryPlantLoad , setHistory] = useState(true)

    const BTConfirm = useRef()
    useEffect(()=>{
        FetchPlant()
    } , [])

    const FetchPlant = async () => {
        const Data = await clientMo.post("/api/farmer/plant/search")
        if(await CloseAccount(Data)) {
            const LIST = JSON.parse(Data).map((val , key)=> <option key={key} value={val.id}>{val.name}</option>)
            RefPop.current.setAttribute("show" , "")
            setSelect(LIST)
        }
        setLoading(true)
    }

    const FetchDataForm = async (id_plant_list) => {
        setHistory(true)
        FormContent.current.setAttribute("over" , "")
        const Data = await clientMo.post("/api/farmer/formplant/get" , {id_farmhouse : id_house , id_plant_list : id_plant_list})
        if(await CloseAccount(Data)) {
            const Object = JSON.parse(Data)
            if(Object[0]) {
                Generation.current.value = Object[0].generetion
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
            }
        }
        FormContent.current.removeAttribute("over")
        setHistory(false)
    }

    const Confirm = async () => {
        if(!BTConfirm.current.getAttribute("no")) {
            const type = TypePlant.current
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
                        type : type.value,
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
                    if(await CloseAccount(Data)) {
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
                    else if (ele.value && ele) ele.removeAttribute("style")
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

    const ChangeCHK = async (e) => {
        const type = TypePlant.current
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

        if(e.target === type) await FetchDataForm(e.target.value)
        
        if(type.value && generetion.value && dateGlow.value && datePlant.value && 
            posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
            water.value && waterStep.value && history.value && insect.value && qtyInsect.value 
            ) {
                BTConfirm.current.removeAttribute("no")
        } else {
            BTConfirm.current.setAttribute("no" , "")
        }
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
                                            <select onChange={ChangeCHK} ref={TypePlant} type="text" defaultValue={""}>
                                                {LoadingSelect ? <option disabled value={""}>เลือกชนิดพืช</option> : <option disabled value={""}>กำลังโหลด</option>}
                                                {SELECT}
                                            </select>
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