import React, { useEffect, useState } from "react";
import "../assets/DetailEdit.scss"
import { clientMo } from "../../../src/assets/js/moduleClient";
import { CloseAccount } from "../method";
import { DayJSX, Loading } from "../../../src/assets/js/module";

const DetailEdit = ({Ref , setRef , setPage , type , Data_on}) => {
    const [Data , setData] = useState(null)
    const [HeadEdit , setHead] = useState([])
    const [BodyEdit , setBody] = useState(<></>)
    const [LoadingData , setLoad] = useState(false)
    const UrlFecth = type === "plant" ? "/api/farmer/formplant/edit/select" : "/api/farmer/factor/edit/select" ;
    const DataFetch = type === "plant" ? {
                                            id_farmhouse : Data_on.id_house , 
                                            id_plant : Data_on.id_plant
                                        } 
                                        : {
                                            id_farmhouse : Data_on.id_house , 
                                            id_plant : Data_on.id_plant , 
                                            id_form_factor : Data_on.id_factor , 
                                            type_form : Data_on.type_form
                                        }
    
    const subject = type === "plant" ? 
                    {
                        name_plant : "ชนิดพืช" ,
                        generation : "รุ่นที่ปลูก" ,
                        date_glow : "วันที่เพราะกล้า" ,
                        date_plant : "วันที่ปลูก",
                        posi_w : "ระยะการปลูก ความกว้าง",
                        posi_h : "ระยะการปลูก ความยาว",
                        qty : "จำนวนต้น",
                        area : "พื้นที่",
                        date_harvest : "วันที่คาดว่าจะเก็บเกี่ยว",
                        system_glow : "รูปแบบการปลูก",
                        water : "แหล่งน้ำ",
                        water_flow : "วิธีการให้น้ำ",
                        history : "ประวัติการใช้พื้นที่",
                        insect : "โรคและแมลงที่พบ",
                        qtyInsect : "ปริมาณการเกิดโรค และแมลงที่พบ",
                        seft : "การป้องกัน กำจัด",
                    } : 
                    {
                        name : type === "z" ? "ชื่อสิ่งที่ใช้" : "ชื่อสารเคมี" ,
                        formula_name : type === "z" ? "ชื่อสูตรปุ๋ย" : "ชื่อสามัญสารเคมี" ,
                        insect : "ศัตรูพืชที่พบ" ,
                        use_is : "วิธีการใช้" ,
                        rate : "อัตราที่ผสม" ,
                        volume : "ปริมาณที่ใช้" ,
                        source : "แหล่งที่ซื้อ" ,
                        date_safe : "วันที่ปลอดภัย" ,
                        date : type === "z" ? "ว/ด/ป ที่ใช้" : "ว/ด/ป ที่พ่นสาร" ,
                    }
    
    useEffect(()=>{
        Ref.current.setAttribute("s" , "")
        Fetch()
    } , [])

    const Fetch = async () => {
        const result = await clientMo.post(UrlFecth , DataFetch)
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            setData(Data)
            if(Data[0]) SelectHead(Data[0].id_edit)
        }
    }

    const SelectHead = async (id_table_edit , e) => {
        setLoad(false)
        const result = await clientMo.post(UrlFecth , {...DataFetch , id_edit : id_table_edit})
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            if(e) {
                document.querySelector(".menu-edit .frame-menu span[select='']").removeAttribute("select")
                // const prev = e.target.previousElementSibling
                // const next = e.target.nextElementSibling
                // if(prev) prev.style.borderBottomRightRadius = "10px";
                // if(next) next.style.borderBottomLeftRadius = "10px";
                // e.target.removeAttribute("style")
                e.target.setAttribute("select" , "")
            }
            if(Data.head.id_edit) {
                setHead(Data.head)
                setBody(Data.detail)
                setLoad(true)
            } else setLoad(true)
        }
    }

    const close = () => {
        Ref.current.removeAttribute("s")
        setTimeout(()=>{
            setRef(<></>)
        }, 500)
    }

    return(
        Data === null ?
            <Loading size={"30vw"} border={"2.5vw"} color="#23dd36" animetion={true}/> :
            <section id="detail-edit-popup">
                {
                    Data[0] ?
                    <>
                        <div className="menu-edit">
                            <div className="frame-menu">
                                <div className="menu-list">
                                {
                                    Data.map((val , key)=>
                                        key == 0  ?
                                        <span select="" onClick={(e)=>SelectHead(val.id_edit , e)} key={key}>ล่าสุด</span>
                                        :
                                        <span onClick={(e)=>SelectHead(val.id_edit , e)} key={key}>{key + 1}</span>
                                    )
                                }
                                </div>
                            </div>
                            <div className="close" onClick={close}>
                                <svg viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                                </svg>
                            </div>
                        </div>
                        {
                            LoadingData ?
                            <div className="body-edit">
                                <div className="head-detail-edit">
                                    <div className="row-detail">
                                        <DayJSX DATE={HeadEdit.date} TYPE="small" TEXT="วันที่แก้ไข"/>
                                    </div>
                                    <div className="line"></div>
                                    <div className="row-detail column">
                                        <span>เหตุผล</span>
                                        <textarea readOnly defaultValue={HeadEdit.because}></textarea>
                                    </div>
                                    <div className="line"></div>
                                    <div className="row-detail">
                                        <span>สถานะตรวจสอบ</span>
                                        <span className="dot">:</span>
                                        <div>
                                            {
                                                HeadEdit.status ? 
                                                    HeadEdit.status == 1 ? "ผ่าน" : "ไม่ผ่าน"
                                                : "ยังไม่ตรวจสอบ"
                                            }
                                        </div>
                                    </div>
                                    {
                                        HeadEdit.status == 2 ? 
                                            <div className="row-detail column">
                                                <span>หมายเหตุ</span>
                                                <textarea readOnly defaultValue={HeadEdit.note}></textarea>
                                            </div>
                                            : <></>
                                    }
                                </div>
                                <div className="detail">
                                    <div className="detail-body">
                                        <div className="head">
                                            <span>ข้อมูลที่ถูกแก้ไข</span>
                                            <span className="advice">
                                                <div className="row-advice">
                                                    <div className="dot old"></div>
                                                    ข้อมูลเก่า
                                                </div>
                                                <div className="row-advice">
                                                    <div className="dot new"></div>
                                                    ข้อมูลใหม่
                                                </div>
                                            </span>
                                        </div>
                                        <div className="line"></div>
                                        <div className="body">
                                            {
                                                BodyEdit.map((val , key)=>
                                                    <div key={key}>
                                                        <div className="list-detail">
                                                            <div className="subject">{subject[val.subject_form]}</div>
                                                            <div className="content">
                                                            <span className="old">
                                                            {
                                                                val.subject_form.indexOf("date") >= 0 ? 
                                                                    <DayJSX DATE={val.old_content} TYPE="small"/>
                                                                    :
                                                                    <span>{val.old_content ? val.old_content : "ไม่ระบุ"}</span>
                                                            }
                                                            </span>
                                                            <span className="new">
                                                            {
                                                                val.subject_form.indexOf("date") >= 0 ? 
                                                                    <DayJSX DATE={val.new_content} TYPE="small"/>
                                                                    :
                                                                    <span>{val.new_content ? val.new_content : "ไม่ระบุ"}</span>
                                                            }
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="line"></div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div> : 
                            <div className="loading-edit">
                                <Loading size={"15vw"} border={"2vw"} color="rgb(53 207 187)" animetion={true}/>
                            </div>
                        }
                    </> :
                    <>
                    <div className="close ab" onClick={close}>
                        <svg viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                        </svg>
                    </div>
                    <div className="not-edit">
                        ไม่พบการแก้ไขข้อมูล
                    </div>
                    </>
                }
            </section>
    )
}

export default DetailEdit