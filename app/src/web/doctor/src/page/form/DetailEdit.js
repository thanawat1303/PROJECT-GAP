import React, { useEffect, useState , useRef, useContext } from "react";
import "../../assets/style/page/form/DetailEdit.scss"
import { clientMo } from "../../../../../assets/js/moduleClient";
import { DayJSX, Loading, ReportAction } from "../../../../../assets/js/module";
import { DoctorProvider } from "../../main";
import Locals from "../../../../../locals";

const DetailEdit = ({Ref , setRef , setDetailData , type , id_form , id_from_plant , session}) => {
    const { lg } = useContext(DoctorProvider)
    
    const [Data , setData] = useState(null)
    const [HeadEdit , setHead] = useState([])
    const [BodyEdit , setBody] = useState(<></>)
    const [LoadingData , setLoad] = useState(false)
    const UrlFecth = "/api/doctor/form/edit/get"
    const DataFetch = {
        id_form : id_form , 
        type_form : type
    }

    const [OpenReport , setOpenreport] = useState(0)
    const [StatusReport , setStatusReport] = useState(0)
    const [TextReport , setTextReport] = useState(0)

    const RefBecause = useRef()
    const RefBtNot = useRef()
    const RefBtPass = useRef() 
    
    const subject = type === "plant" ? 
                    {
                        name_plant : Locals[lg]["plant_type"] ,
                        generation : Locals[lg]["generation"] ,
                        date_glow : Locals[lg]["date_glow"] ,
                        date_plant : Locals[lg]["date_plant"],
                        posi_w : Locals[lg]["posi_w"],
                        posi_h : Locals[lg]["posi_h"],
                        qty : Locals[lg]["qty"],
                        area : Locals[lg]["area"],
                        date_harvest : Locals[lg]["date_harvest"],
                        system_glow : Locals[lg]["system_glow"],
                        water : Locals[lg]["water"],
                        water_flow : Locals[lg]["water_flow"],
                        history : Locals[lg]["history"],
                        insect : Locals[lg]["insect"],
                        qtyInsect : Locals[lg]["qtyInsect"],
                        seft : Locals[lg]["seft"],
                    } : 
                    {
                        name : type === "z" ? Locals[lg]["name_equip_fertilizer"] : Locals[lg]["name_equip_chemicals"] ,
                        formula_name : type === "z" ? Locals[lg]["formula_name_fertilizer"] : Locals[lg]["formula_name_chemicals"] ,
                        insect : Locals[lg]["insect_equip"] ,
                        use_is : Locals[lg]["use_is"] ,
                        rate : Locals[lg]["rate"] ,
                        volume : Locals[lg]["volume"] ,
                        source : Locals[lg]["source"] ,
                        date_safe : Locals[lg]["date_safe"] ,
                        date : type === "z" ? Locals[lg]["date_fertilizer"] : Locals[lg]["date_chemicals"] ,
                    }
    
    useEffect(()=>{
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
        Fetch()
    } , [])

    const Fetch = async () => {
        const result = await clientMo.post(UrlFecth , DataFetch)
        if(result) {
            const Data = JSON.parse(result)
            setData(Data)
            if(Data[0]) SelectHead(Data[0].id_edit)
        } else session()
    }

    const SelectHead = async (id_table_edit , e) => {
        setLoad(false)
        const result = await clientMo.post(UrlFecth , {...DataFetch , id_edit : id_table_edit})
        if(result) {
            const Data = JSON.parse(result)
            if(e) {
                document.querySelector(".menu-edit .frame-menu a[select='']").removeAttribute("select")
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
        } else session()
    }

    const close = () => {
        Ref.current.style.opacity = "0"
        Ref.current.style.visibility = "hidden"
        setTimeout(()=>{
            setRef(<></>)
        }, 500)
    }

    const ApiResultCheck = async (id_edit , resultBt) => {
        if(CheckEmplyBecause()) {
            setOpenreport(1)
            const result = await clientMo.put("/api/doctor/form/edit/change/status" , {
                status : resultBt,
                note : RefBecause.current.value,
                id_edit : id_edit,
                id_plant : id_from_plant
            })

            if(result) {
                setStatusReport(resultBt)
                setTextReport(resultBt == 1 ? Locals[lg]["approval"] : Locals[lg]["disapproved"])
            } else session()
        }
    }

    const ResultReport = () => {
        setOpenreport(0)
        setDetailData(type === "plant" ? 0 : type === "fertilizer" ? 1 : 2)
        SelectHead(HeadEdit.id_edit , "")
        setTimeout(()=>{
            setStatusReport(0)
            setTextReport("")
        } , 500)
    }

    const CheckEmplyBecause = () => {
        const Because = RefBecause
        const Not = RefBtNot
        const Pass = RefBtPass

        if(Because.current.value) {
            Not.current.removeAttribute("click-not")
            Pass.current.removeAttribute("click-not")
            return true
        } else {
            Not.current.setAttribute("click-not" , "")
            Pass.current.setAttribute("click-not" , "")
            return false
        }
    }

    return(
        Data === null ?
            <Loading size={"83.1px"} border={"6.925px"} color="rgb(53 207 187)" animetion={true}/> :
            <>
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
                                        <a select="" onClick={(e)=>SelectHead(val.id_edit , e)} key={key}>ล่าสุด</a>
                                        :
                                        <a onClick={(e)=>SelectHead(val.id_edit , e)} key={key}>{key + 1}</a>
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
                                        <DayJSX DATE={HeadEdit.date} TYPE="small" TEXT={Locals[lg]["date_edit"]}/>
                                    </div>
                                    <div className="line"></div>
                                    <div className="row-detail column">
                                        <span>{Locals[lg]["reason"]}</span>
                                        <textarea readOnly defaultValue={HeadEdit.because}></textarea>
                                    </div>
                                    { HeadEdit.status != 0 ?
                                        <>
                                        <div className="line"></div>
                                        <div className="row-detail">
                                            <span>{Locals[lg]["status_check"]}</span>
                                            <span className="dot">:</span>
                                            <div>
                                                {
                                                HeadEdit.status == 1 ? Locals[lg]["pass"] : Locals[lg]["not_pass"]
                                                }
                                            </div>
                                        </div> 
                                        </>
                                        : <></>
                                    }
                                    {
                                        HeadEdit.status !== 0 ? 
                                            <div className="row-detail column">
                                                <span>{Locals[lg]["note"]}</span>
                                                <textarea readOnly defaultValue={HeadEdit.note}></textarea>
                                            </div>
                                            : <></>
                                    }
                                </div>
                                <div className="detail">
                                    <div className="detail-body">
                                        <div className="head">
                                            <span>{Locals[lg]["corrected_information"]}</span>
                                            <span className="advice">
                                                <div className="row-advice">
                                                    <div className="dot old"></div>
                                                    {Locals[lg]["old_data"]}
                                                </div>
                                                <div className="row-advice">
                                                    <div className="dot new"></div>
                                                    {Locals[lg]["new_data"]}
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
                                                                    <span>{val.old_content ? val.old_content : Locals[lg]["not_specified"]}</span>
                                                            }
                                                            </span>
                                                            <span className="new">
                                                            {
                                                                val.subject_form.indexOf("date") >= 0 ? 
                                                                    <DayJSX DATE={val.new_content} TYPE="small"/>
                                                                    :
                                                                    <span>{val.new_content ? val.new_content : Locals[lg]["not_specified"]}</span>
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
                                {
                                    HeadEdit.status == 0 ? 
                                        <div className="detail">
                                            <div className="detail-body">
                                                <div className="head">
                                                    <span>{Locals[lg]["note"]}</span>
                                                </div>
                                                <div className="line"></div>
                                                <div className="body-because">
                                                    <textarea onChange={CheckEmplyBecause} ref={RefBecause} placeholder="กรอกข้อมูลสำหรับแจ้งเกษตรกร"></textarea>
                                                </div>
                                            </div>
                                            <div className="bt-confirm-edit">
                                                <a onClick={()=>ApiResultCheck(HeadEdit.id_edit , 2)} ref={RefBtNot} className="not" click-not="">{Locals[lg]["not_pass"]}</a>
                                                <a onClick={()=>ApiResultCheck(HeadEdit.id_edit , 1)} ref={RefBtPass} className="pass" click-not="">{Locals[lg]["pass"]}</a>
                                            </div>
                                        </div>
                                        : <></>
                                }
                            </div> : 
                            <div className="loading-edit">
                                <Loading size={"41.55px"} border={"5.54px"} color="rgb(53 207 187)" animetion={true}/>
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
                        {Locals[lg]["No_found_edit"]}
                    </div>
                    </>
                }
            </section>
            <ReportAction Open={OpenReport} Status={StatusReport} Text={TextReport}
                            setOpen={setOpenreport} setStatus={setStatusReport} setText={setTextReport}
                            sizeLoad={60} BorderLoad={8} color={"rgb(57 132 122)"} action={ResultReport}/>
            </>
    )
}

export default DetailEdit