import React, { useRef , useEffect} from "react";
import "../../assets/ListFertilizer.scss"
import { clientMo } from "../../../../src/assets/js/moduleClient";

const PopupInsertFertilizer = ({setPopup , RefPop , uid , id , ReloadData}) => {
    const DateUse = useRef()
    const FormulaName = useRef()
    const NameFertilizer = useRef()
    const Use = useRef()
    const Volume = useRef()
    const Source = useRef()

    useEffect(()=>{
        RefPop.current.setAttribute("show" , "")
    })

    const Confirm = () => {
        const dateUse = DateUse.current
        const formula_name = FormulaName.current
        const Name = NameFertilizer.current
        const use = Use.current
        const volume = Volume.current
        const source = Source.current

        if( dateUse.value && formula_name.value && Name.value && use.value && volume.value && source.value
            ) {
                let data = {
                    uid : uid,
                    id_farmhouse : id.id_house,
                    id : id.id_form,
                    date : dateUse.value,
                    formula_name : formula_name.value,
                    name : Name.value,
                    use : use.value,
                    volume : volume.value,
                    source : source.value,
                }
                
                clientMo.post("/api/farmer/factor/fertilizer/insert" , data).then((result)=>{
                    if(result === "133") {
                        cancel()
                        ReloadData()
                    } else {
                        
                    }
                })
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
        <section className="popup-content-fertilizer">
            <div className="head">แบบบันทึกเกษตรกร</div>
            <div className="form">
                <div className="head-form">
                    <span>ปัจจัยการผลิต</span>
                </div>
                <div className="body-content">
                    <div className="frame-content">
                        <div className="content">
                            <div className="step">
                                <div className="num">1.</div>
                                <div className="body">
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ว/ด/ป ที่ใช้</span>
                                            <input onClick={()=>clickDate(DateUse)} ref={DateUse} type="date"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox colume">
                                            <span className="full">ชื่อสิ่งที่ใช้ (ชื่อการค้า, ตรา)</span>
                                            <div className="select-content">
                                                <select ref={FormulaName} defaultValue={""}>
                                                    <option value={""}>เลือก</option>
                                                    <option value={"กระต่ายบิน"}>กระต่ายบิน</option>
                                                </select>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ชื่อสูตรปุ๋ย</span>
                                            <input ref={NameFertilizer} type="text" placeholder="กรอก"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>วิธีการใช้</span>
                                            <select ref={Use} defaultValue={""}>
                                                <option value={""}>เลือก</option>
                                                <option value={"หว่าน"}>หว่าน</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>ปริมาณที่ใช้</span>
                                            <input ref={Volume} type="number" placeholder="ตัวเลข"></input>
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label className="frame-textbox">
                                            <span>พื้นที่</span>
                                            <select ref={Source} defaultValue={""}>
                                                <option value={""}>เลือก</option>
                                                <option value={"ตัวเมือง"}>ตัวเมือง</option>
                                            </select>
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

export default PopupInsertFertilizer