import React, { useEffect, useRef } from "react"
import "../../../assets/style/page/data/Insert/ConfirmInsert.scss"
import { MapsJSX } from "../../../../../../src/assets/js/module"
import { clientMo } from "../../../../../../src/assets/js/moduleClient"
const PopupConfirm = ({Ref , setPopup , session , Data , RowPresent , setLimit , Reload , setReload}) => {
    const BtConfirm = useRef()
    const Password = useRef()
    
    useEffect(()=>{
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
        console.log(Data)
    } , [])

    const Confirm = async () => {
        if(CheckEmply()) {
            Data["password"] = Password.current.value
            Data["data"]["is_use"] = 1
            const result = await clientMo.post("/api/doctor/data/insert" , Data)

            if(result === "insert") {
                setLimit(RowPresent)
                setReload(!Reload)
                close()
            } else if (result === "password") {
                Password.current.value = ""
                Password.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
                BtConfirm.current.setAttribute("not" , "")
            } else if (result === "not") {
                console.log("not")
            } else session()
        }
    }

    const close = () => {
        Ref.current.style.opacity = "0"
        Ref.current.style.visibility = "hidden"

        setTimeout(()=>{
            setPopup(<></>)
        })
    }

    const CheckEmply = () => {
        const pw = Password.current
        if(pw.value) {
            BtConfirm.current.removeAttribute("not")
            return true
        }
        else {
            BtConfirm.current.setAttribute("not" , "")
            return false
        }
    }

    return (
        <div className="content-confirm-insert">
            <span className="header">ยืนยันเพิ่ม
                {
                    Data.type === "plant" ? "ชนิดพืช" :
                    Data.type === "fertilizer" ? "ปัจจัยการผลิต" :
                    Data.type === "chemical" ? "สารเคมี" :
                    Data.type === "source" ? "แหล่งที่ซื้อ" : ""
                }
            </span>
            <div className="body">
                { 
                    Object.entries(Data.data).map((val , key)=>{
                        const HEAD = (
                                    val[0] === "name" ? `ชื่อ${
                                        Data.type === "plant" ? "ชนิดพืช" :
                                        Data.type === "fertilizer" ? "ปุ๋ย" :
                                        Data.type === "chemical" ? "สารเคมี" :
                                        Data.type === "source" ? "แหล่งที่ซื้อ" : ""
                                    }` : 
                                    val[0] === "type_plant" ? "ประเภท" : 
                                    val[0] === "qty_harvest" ? "วันที่คาดว่าจะเก็บเกี่ยว" :
                                    val[0] === "name_formula" ? Data.type === "fertilizer" ? "สูตรปุ๋ย" : "ชื่อสามัญสารเคมี" :
                                    val[0] === "how_use" ? "วิธีการใช้" :
                                    val[0] === "date_sefe" ? "จำนวนวันปลอดภัย" :
                                    val[0] === "location" ? "map"
                                    : ""
                                );
                        const Location = (HEAD === "map") ? val[1] ? val[1].slice(6 , val[1].length - 1).split(" ") : 1 :"";
                        return(
                            (Location) ?
                                val[1] ?
                                <div className="row" key={key}>
                                    <MapsJSX lat={Location[0]} lng={Location[1]}/>
                                </div> : <div key={key} hidden></div>
                            :
                                <div className="row" key={key}>
                                    <span>{HEAD}</span>
                                    <div className="data">{val[1]}</div>
                                </div>
                        )
                    })
                }
            </div>
            <div className="bt-insert">
                <input onChange={CheckEmply} ref={Password} placeholder="รหัสผ่านเจ้าหน้าที่" type="password"></input>
                <div className="bt-content">
                    <button style={{backgroundColor : "red"}} onClick={close}>ยกเลิก</button>
                    <button className="submit" ref={BtConfirm} not="" onClick={Confirm}>ยืนยัน</button>
                </div>
            </div>
        </div>
    )
}

export default PopupConfirm