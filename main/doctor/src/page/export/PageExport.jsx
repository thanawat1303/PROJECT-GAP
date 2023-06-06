import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/export/PageExport.scss"
import { ExportExcel } from "../../../../../src/assets/js/module";
const PageExport = ({main , session , setBodyDoctor , socket , type = 0 , typeDataForm , eleImageCover , eleBody , setTextStatus}) => {
    const [DataPull , setData] = useState({})
    const [Loading , setLoading] = useState(false)
    const [Year , setYear] = useState(<></>)
    const [DataExport , setExport] = useState({})

    const BT = useRef()
    const Option = useRef()

    const SelectM = useRef()
    const SelectY = useRef()
    const SelectMaf = useRef()
    const SelectYaf = useRef()

    let month = ["เลือกเดือน","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]

    useEffect(()=>{
        if(type === 1) window.history.pushState({} , "" , `/doctor/export`)
        eleImageCover.current.style.height = "30%"
        eleBody.current.style.height = "70%"
        setTextStatus(["หน้าหลัก" , "ส่งออกข้อมูล"])

        let year = new Date().getUTCFullYear() + 543
        let yearArr = new Array()

        for( let i = year; i >= (year - 20) ; i-- ){
            yearArr.push(i)
        }
        setYear(yearArr.map((val , index)=>(<option key={index} value={val - 543}>{val}</option>)))

        // BT.current.style.height = 
    } , [typeDataForm])

    const ShowOption = (e) => {
        BT.current.toggleAttribute("show")
    }

    const PullDataChange = (e) => {
        const Data = new Map()
        let M = SelectM.current
        let Y = SelectY.current
        let Maf = SelectMaf.current
        let Yaf = SelectYaf.current
         
        if(M === e.target || Y === e.target || Maf === e.target || Yaf === e.target ) {
            if(M.value == "0" || Y.value == "0" || Maf.value == "0" || Yaf.value == "0") {
                return 0
            }
        }

        if(M.value != "0" && Y.value != "0" && Maf.value != "0" && Yaf.value != "0") {
            let Start = parseInt(`${Y.value}${M.value}`)
            let End = parseInt(`${Yaf.value}${Maf.value}`)

            if(Start <= End) {
                Data.set("dateStart" , `${Y.value}-${M.value}-01`)
                Data.set("dateEnd" , `${Yaf.value}-${Maf.value}-${new Date(parseInt(Yaf.value) , parseInt(Maf.value) , 0).getDate()}`)
            } else {
                alert("ใส่วันที่ไม่ถูกต้อง")
                return 0
            }
        }

        if(e.target.name == "status-register" && e.target.value != "") Data.set("register" , e.target.value)
        if(e.target.name == "status-account" && e.target.value != "") Data.set("submit" , e.target.value)

        // if(submit.value) Data.set("submit" , submit.value)
        
        const DataArr = Array.from(Data);
        const JsonOb = Object.fromEntries(DataArr);
        
        setData(JsonOb)
    } 
    return (
        <section className="page-export">
            <div ref={BT} className="bt-action">
                <div className="bt-action-option" onClick={ShowOption}>
                    <button>แสดงตัวเลือก</button>
                </div>
                <div ref={Option} className="content-option">
                    <div className="date">
                        <select onChange={PullDataChange} ref={SelectM} defaultValue={0}>
                            {month.map((val , index)=>{
                                if(index === 0) return <option disabled key={index} value={index}>{val}</option>
                                else return <option key={index} value={(index >= 10) ? index : `0${index}`}>{val}</option>
                            })}
                        </select>
                        <select onChange={PullDataChange} ref={SelectY} defaultValue={0}>
                            <option disabled value={0}>เลือกปี</option>
                            {Year}
                        </select>
                        <span>ถึง</span>
                        <select onChange={PullDataChange} ref={SelectMaf} defaultValue={0}>
                            {month.map((val , index)=>{
                                if(index === 0) return <option disabled key={index} value={index}>{val}</option>
                                else return <option key={index} value={(index >= 10) ? index : `0${index}`}>{val}</option>
                            })}
                        </select>
                        <select onChange={PullDataChange} ref={SelectYaf} defaultValue={0}>
                            <option disabled value={0}>เลือกปี</option>
                            {Year}
                        </select>
                    </div>
                    <div className="type-from">
                        <span className="head">สถานะการเก็บเกี่ยว</span>
                        <div className="content-radio">
                            <label>
                                <input onClick={PullDataChange} type="radio" name="status-register" value={""}></input>
                                <span>ทั้งหมด</span>
                            </label>
                            <label>
                                <input onClick={PullDataChange} type="radio" name="status-register" value={1}></input>
                                <span>เก็บเกี่ยวแล้ว</span>
                            </label>
                            <label>
                                <input onClick={PullDataChange} type="radio" name="status-register" value={0}></input>
                                <span>ยังไม่เก็บเกี่ยว</span>
                            </label>
                        </div>
                    </div>
                    <div className="type-from">
                        <span className="head">สถานะบัญชี</span>
                        <div className="content-radio">
                            <label>
                                <input onClick={PullDataChange} type="radio" name="status-account" value={""}></input>
                                <span>ทั้งหมด</span>
                            </label>
                            <label>
                                <input onClick={PullDataChange} type="radio" name="status-account" value={1}></input>
                                <span>ตรวจสอบบัญชีแล้ว</span>
                            </label>
                            <label>
                                <input onClick={PullDataChange} type="radio" name="status-account" value={0}></input>
                                <span>ยังไม่ตรวจสอบบัญชี</span>
                            </label>
                        </div>
                    </div>
                    <div className="bt-export">
                        <ExportExcel fileName={"Export Excel"} excelData={DataExport} nameBT={"ส่งข้อมูลออก"}/>
                    </div>
                </div>
            </div>
            <div className="list-export-all">
                <ListExport session={session} socket={socket} Data={DataPull} setExport={setExport}/>
            </div>
        </section>
    )
}

const ListExport = ({ session , socket , Data , setExport}) => {
    const [Body , setBody] = useState(<></>)
    useEffect(()=>{
        // setExport(
        //     {
        //         "เสาวรส" : [
        //             {
        //                 data : 1
        //             },
        //             {
        //                 data : 2
        //             }
        //         ],
        //         "เมล่อน" : [
        //             {
        //                 data : 3
        //             },
        //             {
        //                 data : 4
        //             }
        //         ]
        //     }
        // )
        clientMo.post("/api/doctor/export" , Data).then((val)=>{


            // let profile = JSON.parse(val)
            // let newData = new Array()
            // let number = 1
            // for(let i in profile) {
            //     let EachData = profile[i]
            //     for(let x in EachData){
            //         let Each = EachData[x] //ชุดข้อมูล
            //         let account = ""
            //         if(x === "data") {
            //             account += 
            //             `
            //                 ลำดับ : ${number},
            //                 ชื่อ-นามสกุล : ${EachData.fullname},
            //                 รหัสเกษตรกร : ${},
            //                 วันที่เริ่มปลูก : ${},
            //                 วันที่ส่งผลผลิต : ${},
            //             `
            //         }

            //         number++
            //     }
            // }
            // JSON.parse(val).map((val)=>{

            // })
            // setExport(JSON.parse(val))
        })
        // setBodyFormList()
    } , [Data])

    return (Body)
}

export default PageExport