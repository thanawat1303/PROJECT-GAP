import React , {useEffect , useRef} from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { DAYUTC } from "../../../../src/assets/js/module";

const PopupInsertPlant = ({setPopup , RefPop , uid , path , setBodyList , setLoading}) =>{
    const TypePlantRefOne = useRef()
    const TypePlantRefTwo = useRef()
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

    useEffect(()=>{
        RefPop.current.setAttribute("show" , "")
    })

    const Confirm = () => {
        const typePlantHead = TypePlantRefOne.current.checked ? TypePlantRefOne.current : TypePlantRefTwo.current.checked ? TypePlantRefTwo.current : ""
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

        if(typePlantHead.value && type.value && generetion.value && dateGlow.value && datePlant.value && 
            posiW.value && posiH.value && qty.value && area.value && dateOut.value && system.value &&
            water.value && waterStep.value && history.value && insect.value && qtyInsect.value 
            // && seft.value
            ) {
                let data = {
                    uid : uid,
                    id_farmhouse : path.get("farm"),
                    typePlantHead : typePlantHead.value,
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
                
                clientMo.post("/api/farmer/formplant/insert" , data).then((result)=>{
                    if(result === "insert") {
                        setLoading(1)
                        cancel()
                        clientMo.post("/api/farmer/sign" ,{uid:uid , page : `authplant`}).then((auth)=>{
                            if(auth === "search") {
                                clientMo.post('/api/farmer/formplant/select' , {
                                    uid : uid,
                                    id_farmhouse : path.get("farm")
                                }).then((list)=>{
                                    setLoading(true)
                                    if(list !== '[]'){
                                        setBodyList(JSON.parse(list).map((val , key)=>
                                            <div key={key} className="plant-content">
                                                <div className="top">
                                                    <div className="type-main">
                                                        <input readOnly value={val.type_main}></input>
                                                    </div>
                                                    <div className="date">
                                                        <span>วันที่ปลูก <DAYUTC DATE={val.date_plant} TYPE="short"/></span>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <div className="content">
                                                        <span>{val.type}</span>
                                                    </div>
                                                    <div className="content">
                                                        <input readOnly value={`จำนวน ${val.qty} ต้น`}></input>
                                                    </div>
                                                    
                                                </div>
                                                <div className="bottom">
                                                    <div className="content">
                                                        <span>{`รุ่นที่ ${val.generation}`}</span>
                                                    </div>
                                                    <div className="bt">
                                                        <button>แก้ไข</button>
                                                        <button>รายละเอียด</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    } else {
                                        setBodyList(<div></div>)
                                    }
                                })
                            }
                        })
                        
                    }
                })
        } else {
            let RefObject = [
                        typePlantHead , type , generetion , dateGlow , datePlant , 
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

    const cancel = () => {
        RefPop.current.removeAttribute("show")
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const clickDate = (ele) => {
        ele.current.focus()
    }
    return(
        <section className="popup-content">
            <div className="head">แบบบันทึกเกษตรกร</div>
            <div className="form">
                <div className="head-form">
                    <span>การปลูกของฉัน</span>
                </div>
                <div className="body-content">
                    <div className="frame-content">
                        <div className="type-plant">
                            <label>
                                <input ref={TypePlantRefOne} value={"พืชผัก"} name="type" type="radio"></input>
                                <span>พืชผัก</span>
                            </label>
                            <label>
                                <input ref={TypePlantRefTwo} value={"สมุนไพร"} name="type" type="radio"></input>
                                <span>สมุนไพร</span>
                            </label>
                        </div>
                        <div className="content">
                            <div className="step">
                                <div className="num">1.</div>
                                <div className="body">
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ชนิดพืช</span>
                                            <input ref={TypePlant} type="text" placeholder="กรอก"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>รุ่นที่ปลูก</span>
                                            <input ref={Generation} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>วันที่เพาะกล้า</span>
                                            <input ref={DateGlow} onClick={()=>clickDate(DateGlow)} type="date" placeholder="ว/ด/ป"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>วันที่ปลูก</span>
                                            <input ref={DatePlant} type="date" placeholder="ว/ด/ป"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox colume">
                                            <div className="full">ระยะการปลูก</div>
                                            <div className="choose">
                                                <label className="choose">
                                                    กว้าง
                                                    <input ref={PositionW} type="text" placeholder="กว้าง"></input>
                                                </label>
                                                <label className="choose">
                                                    ยาว
                                                    <input ref={PositionH} type="text" placeholder="ยาว"></input>
                                                </label>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>จำนวนต้น</span>
                                            <input ref={Qty} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>พื้นที่</span>
                                            <input ref={Area} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>วันที่คาดว่า <br></br>จะเก็บเกี่ยว</span>
                                            <input ref={DateOut} type="date"></input>
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
                                            <select ref={System} defaultValue={""}>
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
                                            <select ref={Water} defaultValue={""}>
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
                                            <select ref={WaterStep} defaultValue={""}>
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
                                            <textarea ref={History} type="" placeholder="กรอก"></textarea>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>โรคและแมลงที่พบ</span>
                                            <select ref={Insect} defaultValue={""}>
                                                <option disabled value="">เลือก</option>
                                                <option>แมลง</option>
                                                <option>เพี้ย</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ปริมาณการเกิดโรค และแมลงที่พบ</span>
                                            <select ref={QtyInsect} defaultValue={""}>
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
                    <button onClick={cancel}>ยกเลิก</button>
                    <button onClick={Confirm}>ยืนยัน</button>
                </div>
            </div>
        </section>
    )
}

export default PopupInsertPlant