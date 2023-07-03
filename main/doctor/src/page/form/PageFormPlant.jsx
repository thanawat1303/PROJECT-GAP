import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/form/PageFormPlant.scss"
import { DayJSX } from "../../../../../src/assets/js/module";

const PageFormPlant = ({setMain , session , socket , type = 0 , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    // const [Body , setBody] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    const [statusPage , setStatus] = useState({
        status : LoadType.split(":")[0],
        open : type
    })

    const Search = useRef()
    
    const [ShowDate , setShowDate] = useState(false)

    const [Year , setYear] = useState(<></>)
    const StartMount = useRef()
    const StartYear = useRef()
    const EndMount = useRef()
    const EndYear = useRef()
    let month = ["เลือกเดือน","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]
    
    useEffect(()=>{
        eleImageCover.current.style.height = "30%"
        eleBody.current.style.height = "70%"
        setTextStatus(["หน้าหลัก" , "แบบบันทึกการปลูก" , "รายการแบบบันทึก"])
        clientMo.unLoadingPage()
        GetYear()

        // if(LoadType.split(":")[1] === "pop") chkPath()

    } , [LoadType])

    // const chkPath = () => {
    //     if(LoadType.split(":")[0] === "ap") 
    //         setStatus({
    //             status : "ap",
    //             open : 0
    //         })
    //     else if(LoadType.split(":")[0] === "wt") 
    //         setStatus({
    //             status : "wt",
    //             open : 0
    //         })
    // }

    // const changeMenu = (typeClick) => {
    //     if(typeClick !== statusPage.status) {
    //         setStatus({
    //             status : typeClick,
    //             open : 1
    //         })
    //     }
    // }
    const GetYear = () => {
        let year = new Date().getUTCFullYear() + 543
        const yearArr = new Array()
        for( let i = year; i >= (year - 10) ; i-- )yearArr.push(i)
        setYear(yearArr.map((val , index)=>(<option key={index} value={val - 543}>{val}</option>)))
    }

    const OpenOption = (Ref) => {
        Ref.current.toggleAttribute("show")
    }

    const CheckSelectDateOffset = (e) => {
        if(e.target.value) setShowDate(true)
        else setShowDate(false)
    }

    return(
        <section className="form-list-page">
            <div className="search-form" ref={Search}>
                <a title="ค้นหา" className="bt-search-show" onClick={()=>OpenOption(Search)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                            <path d="m11.25 11.25l3 3"/>
                            <circle cx="7.5" cy="7.5" r="4.75"/>
                        </g>
                    </svg>
                </a>
                <div className="content-option">
                    <div className="field-option">
                        <div className="row">
                            <input type="search" placeholder="รหัสการเก็บเกี่ยว/รหัสแบบฟอร์ม"></input>
                        </div>
                        <div className="row">
                            <label className="field-select">
                                <span>ชนิดพืช :</span>
                                <select defaultValue={""} className="width-100">
                                    <option value={""}>ทั้งหมด</option>
                                    <option value={"glow"}>เพาะพันธุิ์</option>
                                    <option value={"check"}>ตรวจสอบผลผลิต</option>
                                    <option value={"success"}>เก็บเกี่ยวผลผลิตแล้ว</option>
                                </select>
                            </label>
                            <label className="field-select">
                                <span>สถานะแบบฟอร์ม :</span>
                                <select defaultValue={""} className="width-100">
                                    <option value={""}>ทั้งหมด</option>
                                    <option value={"glow"}>เพาะพันธุิ์</option>
                                    <option value={"check"}>ตรวจสอบผลผลิต</option>
                                    <option value={"success"}>เก็บเกี่ยวผลผลิตแล้ว</option>
                                </select>
                            </label>
                        </div>
                        <div className="row">
                            <label className="field-select">
                                <span>สถานะผู้บันทึก :</span>
                                <select defaultValue={""} className="width-100">
                                    <option value={""}>ทั้งหมด</option>
                                    <option value={"glow"}>ตรวจสอบแล้ว</option>
                                    <option value={"check"}>ยังไม่ตรวจสอบ</option>
                                </select>
                            </label>
                            <label className="field-select">
                                <span>ประเภทช่วงเวลา :</span>
                                <select defaultValue={""} className="width-100" onChange={CheckSelectDateOffset}>
                                    <option value={""}>ทั้งหมด</option>
                                    <option value={"glow"}>วันที่เพาะปลูก</option>
                                    <option value={"check"}>วันที่เก็บเกี่ยวผลผลิต</option>
                                </select>
                            </label>
                        </div>
                        {/* select date */}
                        {ShowDate ? 
                            <div className="row">
                                <div className="field-select">
                                    <span>เลือกช่วงเวลา :</span>
                                    <div>
                                        <select defaultValue={0} ref={StartMount}>
                                            {month.map((val , index)=>{
                                                if(index === 0) return <option disabled key={index} value={index}>{val}</option>
                                                else return <option key={index} value={(index >= 10) ? index : `0${index}`}>{val}</option>
                                            })}
                                        </select>
                                        <select defaultValue={""} ref={StartYear}>
                                            <option disabled value={""}>เลือกปี</option>
                                            {Year}
                                        </select>
                                        ถึง
                                        <select defaultValue={0} ref={EndMount}>
                                            {month.map((val , index)=>{
                                                if(index === 0) return <option disabled key={index} value={index}>{val}</option>
                                                else return <option key={index} value={(index >= 10) ? index : `0${index}`}>{val}</option>
                                            })}
                                        </select>
                                        <select defaultValue={""} ref={EndYear}>
                                            <option disabled value={""}>เลือกปี</option>
                                            {Year}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            : <></>
                        }
                    </div>
                </div>
            </div>
            <div className="form-list">
                <List session={session} socket={socket} status={statusPage}/>
            </div>
        </section>
    )
}

const List = ({ session , socket , status}) => {
    const [Body , setBody] = useState(<></>)
    
    useEffect(()=>{
        setBody(<></>)
        FetchList()
    } , [status])

    const FetchList = async () => {
        
        const list = await clientMo.post('/api/doctor/form/list' , {limit : 30})
        try {
            if(status.open === 1) window.history.pushState({} , "" , `/doctor/form/${status.status}`)
            const data = JSON.parse(list)
            console.log(data)
            // if(data.length !== 0) {
            //     let DataArray = []
            //     let MaxData = 3
            //     for (let i = 0; i <= data.length; i+=MaxData){
            //         DataArray.push(data.slice(i , i+MaxData))
            //     }
            //     setBody(DataArray.map((Data , key)=>(
            //         <section key={key} className="row">
            //             {Data.map((val , key)=>(
            //                 <div key={key} className="content-list-form">
            //                     <div className="inrow">
            //                         <div className="type-main">
            //                             {val.type_main}
            //                         </div>
            //                         <div className="type">
            //                             {val.type}
            //                         </div>
            //                         <div className="date">
            //                             <span>ปลูก</span>
            //                             <DayJSX DATE={val.date_plant} TYPE="SMALL"/>
            //                         </div>
            //                     </div>
            //                     <div className="inrow">
            //                         <div className="system-glow">
            //                             ระบบการปลูก {val.system_glow}
            //                         </div>
            //                         <div className="factor">
            //                             <span>
            //                                 ปุ๋ย {val.ctFer} ครั้ง
            //                             </span>
            //                             <span className="dot">|</span>
            //                             <span>
            //                                 สารเคมี {val.Ctche} ครั้ง
            //                             </span>
            //                         </div>
            //                     </div>
            //                     <div className="inrow">
            //                         <div className="insect">
            //                             ศัตรูพืช {val.insect}
            //                         </div>
            //                         <div className="factor">
            //                             <span className="generation">
            //                                 รุ่น {val.generation}
            //                             </span>
            //                             <span className="qty">
            //                                 จำนวน {val.qty} ต้น
            //                             </span>
            //                         </div>
            //                     </div>
            //                 </div>
            //             ))}
            //         </section>
            //     )))
            // } else {
            //     setBody(
            //         <section>
            //             <div>ไม่พบข้อมูล</div>
            //         </section>
            //     )
            // }
                
        } catch(e) {
            session()
        }
    }

    return (Body)
}

export default PageFormPlant