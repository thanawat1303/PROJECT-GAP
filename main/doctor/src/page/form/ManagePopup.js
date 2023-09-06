import React, { useEffect, useRef, useState } from "react"
import { clientMo } from "../../../../../src/assets/js/moduleClient"
import "../../assets/style/page/form/ManagePopup.scss"
import { DayJSX, Loading, MapsJSX, PopupDom, ResizeImg } from "../../../../../src/assets/js/module"
import DetailEdit from "./DetailEdit"
import { ExportPDF } from "../../../../../src/assets/js/Export"
import { ListCheckForm, ListReport } from "./ListManageDoctor"

const ManagePopup = ({setPopup , RefPop , id_form , status , session , Fecth , RefData}) => {
    const [Content , setContent] = useState(<></>)
    // const [ID_farmer , setID_farmer] = useState("")
    const [LoadContent , setLoadContent] = useState(true)
    const [getNameFarmer , setNameFarmer] = useState("")

    const [BodyPopupEdit , setBodyPopupEdit] = useState(<></>)
    const PopRef = useRef()

    const [CountEdit , setCountEdit] = useState(0)

    const [TypePage , setTypePage] = useState(0) //0 : plant , 1 : fertilizer , 2 : chemical , 3 : manage , 4 : profile
    
    const [StateMenuShow , setStateMenuShow] = useState(false)
    const [getResize , setResize] = useState(window.innerWidth)

    useEffect(()=>{
        RefPop.current.style.opacity = "1"
        RefPop.current.style.visibility = "visible"
        FetchContent(0)
    } , [])

    useEffect(()=>{
        window.addEventListener("resize" , reSize)

        return(()=>{
            window.removeEventListener("resize" , reSize)
        })
    } , [])

    const reSize = () => {
        setResize(window.innerWidth)
        // console.log(window.innerWidth)
    }

    const FetchContent = async (type_form) => {
        setLoadContent(true)
        const Data = await clientMo.get(`/api/doctor/form/get/detail?id_form=${id_form}&type=${type_form}`)
        try {
            const JsonData = JSON.parse(Data)
            if(!type_form) setNameFarmer(JsonData[0].fullname)
            console.log(JsonData)
            setContent(
                JsonData.map((data , key)=>
                    {
                        if(type_form === 0) {
                            // setID_farmer(data.id_farmer)
                            setCountEdit(data.countStatus)
                            return (
                                <section key={key} className="detail-main-form">
                                    <div className="content-data">
                                        <div className="number">1.</div>
                                        <div className="data-row">
                                            <div className="row">
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">ชนิดพืช</span>
                                                    <span className="data-show">{data.type_main}</span>
                                                </div>
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">ชื่อพืช</span>
                                                    <span className="data-show">{data.name_plant}</span>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">วันที่เพาะกล้า</span>
                                                    <DayJSX TYPE="small" TEXT="วันที่" DATE={data.date_glow}/>
                                                </div>
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">วันที่ปลูก</span>
                                                    <DayJSX TYPE="small" TEXT="วันที่" DATE={data.date_plant}/>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">วันที่คาดว่าจะเก็บเกี่ยว</span>
                                                    <DayJSX TYPE="small" TEXT="วันที่" DATE={data.date_harvest}/>
                                                </div>
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">วันที่เก็บเกี่ยว</span>
                                                    { data.date_success ? 
                                                        <DayJSX TYPE="small" TEXT="วันที่" DATE={data.date_success}/> 
                                                        : <span className="data-show">ยังไม่เก็บเกี่ยว</span>}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">พื้นที่</span>
                                                    <span className="data-show">
                                                        {data.area}
                                                        <div className="unit">
                                                            ตารางเมตร
                                                        </div>
                                                    </span>
                                                </div>
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">จำนวนต้น</span>
                                                    <span className="data-show">{data.qty}</span>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <span className="head-text">ระยะการปลูก</span>
                                                <div className="text-body">
                                                    <div className={`data-main ${getResize >= 450 ? "in-2 column" : "in-1 screen-small"}`}>
                                                        <span className="head-data">ระหว่างต้น</span>
                                                        <span className="data-show">{data.posi_w}</span>
                                                    </div>
                                                    <div className={`data-main ${getResize >= 450 ? "in-2 column" : "in-1 screen-small"}`}>
                                                        <span className="head-data">ระหว่างแถว</span>
                                                        <span className="data-show">{data.posi_h}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">รุ่นที่ปลูก</span>
                                                    <span className="data-show">{data.generation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-data">
                                        <div className="number">2.</div>
                                        <div className="data-row">
                                            <div className="row">
                                                <div className={`data-main in-1 column ${getResize < 450 ? "screen-small" : ""}`}>
                                                    <span className="head-data" style={{width : "110px"}}>รูปแบบการปลูก</span>
                                                    <span className="data-show">{data.system_glow}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-data">
                                        <div className="number">3.</div>
                                        <div className="data-row">
                                            <div className="row">
                                                <div className={`data-main in-1 ${getResize < 450 ? "screen-small" : ""}`}>
                                                    <span className="head-data" style={{width : "110px"}}>แหล่งน้ำ</span>
                                                    <span className="data-show">{data.water}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-data">
                                        <div className="number">4.</div>
                                        <div className="data-row">
                                            <div className="row">
                                                <div className={`data-main in-1 ${getResize < 450 ? "screen-small" : ""}`}>
                                                    <span className="head-data" style={{width : "110px"}}>วิธีการให้น้ำ</span>
                                                    <span className="data-show">{data.water_flow}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-data">
                                        <div className="number">5.</div>
                                        <div className="data-row">
                                            <div className="row">
                                                <div className={`data-main in-1 ${getResize < 450 ? "screen-small" : ""}`}>
                                                    <span style={{width : "100%"}} className="head-data">ประวัติการใช้พื้นที่และการเกิดโรค</span>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">ชนิดพืชก่อนหน้า</span>
                                                    <span className="data-show">{data.history ? data.history : "ไม่ระบุ"}</span>
                                                </div>
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">โรค/แมลงที่พบ</span>
                                                    <span className="data-show">{data.insect ? data.insect : "ไม่ระบุ"}</span>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">ปริมาณการเกิด</span>
                                                    <span className="data-show">{data.qtyInsect ? data.qtyInsect : "ไม่ระบุ"}</span>
                                                </div>
                                                <div className={`data-main ${getResize >= 450 ? "in-2" : "in-1 screen-small"}`}>
                                                    <span className="head-data">การป้องกันกำจัด</span>
                                                    <span className="data-show">{data.seft ? data.seft : "ไม่ระบุ"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    { 
                                        data.location_house ?
                                            data.location_house.x && data.location_house.x ?
                                            <div className="content-data">
                                                <div className="data-row">
                                                    <div className="row">
                                                        <div className="data-main in-1 column">
                                                            <span className="head-data">ตำแหน่งที่ทำการเกษตรกร</span>
                                                            <MapsJSX lat={data.location_house.x} lng={data.location_house.y}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : <></> 
                                        : <></>
                                    }
                                </section>
                            )
                        } else if(type_form === 1) {
                            return (
                                <div key={key} className="row-factor">
                                    <div className="row-in">
                                        <div className="in-data date">
                                            <span>ว/ด/ป ที่ใช้</span>
                                            <DayJSX DATE={data.date} TYPE="small" TEXT="วันที่"/>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data">
                                            <span>การค้า</span>
                                            <div>{data.name}</div>
                                        </div>
                                        <div className="in-data">
                                            <span>สูตร</span>
                                            <div>{data.formula_name ? data.formula_name : "ไม่ระบุ"}</div>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data">
                                            <span>วิธีการใช้</span>
                                            <div>{data.use_is}</div>
                                        </div>
                                        <div className="in-data">
                                            <span>ปริมาณ</span>
                                            <div>{data.volume}</div>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data">
                                            <span>แหล่งที่ซื้อ</span>
                                            <div>{" " + data.source}</div>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="bt-factor">
                                            { data.countStatus ?
                                                <div className="dot-report"></div> : <></>
                                            }
                                            <button onClick={()=>GetDetailEdit(data.id , type_form === 1 ? "fertilizer" : "chemical" )}>ตรวจการแก้ไข</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else if(type_form === 2) {
                            return (
                                <div key={key} className="row-factor">
                                    <div className="row-in">
                                        <div className="in-data date">
                                            <span>ว/ด/ป ที่พ่นสาร</span>
                                            <DayJSX DATE={data.date} TYPE="small" TEXT="วันที่"/>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data">
                                            <span>การค้า</span>
                                            <div>{data.name}</div>
                                        </div>
                                        <div className="in-data">
                                            <span>สามัญ</span>
                                            <div>{data.formula_name}</div>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data">
                                            <span>ศัตรูพืช</span>
                                            <div>{data.insect}</div>
                                        </div>
                                        <div className="in-data">
                                            <span>วิธีการใช้</span>
                                            <div>{data.use_is}</div>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data">
                                            <span>อัตรา</span>
                                            <div>{data.rate}/น้ำ20ล.</div>
                                        </div>
                                        <div className="in-data">
                                            <span>ปริมาณ</span>
                                            {data.volume}
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data">
                                            <span>แหล่งที่ซื้อ</span>
                                            <div>{" " + data.source}</div>
                                        </div>
                                    </div>
                                    <div className="row-in">
                                        <div className="in-data safe">
                                            <span>ปลอดภัย</span>
                                            <DayJSX DATE={data.date_safe} TYPE="small" TEXT="วันที่"/>
                                        </div>
                                    </div>
                                    <div className="bt-factor">
                                        { data.countStatus ?
                                            <div className="dot-report"></div> : <></>
                                        }
                                        <button onClick={()=>GetDetailEdit(data.id , type_form === 1 ? "fertilizer" : "chemical" )}>ตรวจการแก้ไข</button>
                                    </div>
                                </div>
                            )
                        } else return(<></>)
                    }
                )
            )
            setLoadContent(false)
        } catch (e) {
            session()
        }
    }

    const close = () => {
        RefPop.current.style.opacity = "0"
        RefPop.current.style.visibility = "hidden"
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const GetDetailEdit = async (id_form_edit , type) => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) 
            setBodyPopupEdit(<DetailEdit Ref={PopRef} setRef={setBodyPopupEdit} setDetailData={FetchContent} type={type} id_form={id_form_edit} id_from_plant={id_form} session={session}/>)
        else session()
    }

    const ChangeTypePage = async (type) => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) {
            setTypePage(type)
            FetchContent(type)
        }
        else session()
    }


    //profile farmer
    const GetProfileFarmer = async () => {
        setLoadContent(true)
        const profileGet = await clientMo.get(`/api/doctor/form/get/farmer?id_form=${id_form}`)
        setTypePage(3)
        if(!profileGet) session()
        else {
            const Data = JSON.parse(profileGet)
            console.log(Data)
            setContent(Data.map((val , key)=>{
                return(
                    <section key={key} className="profile-farmer">
                        <div className="img">
                            <img src={val.img}></img>
                        </div>
                        <div className="detail-text">
                            <div className="row">
                                <span className="head-text">รหัสเกษตรกร</span>
                                <div className="body-text">{val.id_farmer}</div>
                            </div>
                            <div className="row">
                                <span className="head-text">ชื่อ - นามสกุล</span>
                                <div className="body-text">{val.fullname}</div>
                            </div>
                            <div className="row">
                                <span className="head-text">เบอร์โทร</span>
                                <div className="body-text">{val.tel_number ? val.tel_number : "ไม่ระบุ"}</div>
                            </div>
                            <div className="row">
                                <span className="head-text">วันที่สมัคร</span>
                                <div className="body-text">
                                    <DayJSX DATE={val.date_register} TYPE="small" TEXT="วันที่"/>
                                </div>
                            </div>
                            <div className="row">
                                <span className="head-text">วันที่เจ้าหน้าที่ยืนยัน</span>
                                <div className="body-text">
                                    {val.date_doctor_confirm ?
                                        <DayJSX DATE={val.date_doctor_confirm} TYPE="small" TEXT="วันที่"/>
                                        : "ยังไม่ผ่านการตรวจสอบ"
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <span className="head-text">ที่อยู่</span>
                                <div className="body-text">{val.text_location ? val.text_location : "ไม่ระบุ"}</div>
                            </div>
                            <div className="row">
                                <span className="head-text">ตำแหน่งที่ตั้ง</span>
                                <div className="body-text map">
                                    <MapsJSX lat={val.location.x} lng={val.location.y} w={"100%"}/>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }))
            setLoadContent(false)
        }
    }

    // manage
    const MenuBTManage = {
        success : useRef(),
        report : useRef(),
        CheckForm : useRef(),
        CheckPlant : useRef()
    }

    const [StatePage , SetStatePage] = useState("success")
    const [DataFormManage , setDataFormManage] = useState([])
    const MenuManageFormByDoctor = async (type_page , e = "") => {
        const Type = type_page === "success" ? "success_detail" 
                    : type_page === "report" ? "report_detail"
                    : type_page === "CheckForm" ? "check_form_detail"
                    : type_page === "CheckPlant" ? "check_plant_detail" 
                    : "";
        Fecth();
        const context = await clientMo.get(`/api/doctor/form/manage/get?id_plant=${id_form}&typePage=${Type}`);
        if(context) {

            try {
                for(let x in MenuBTManage) {
                    MenuBTManage[x].current.removeAttribute("select")
                }
                MenuBTManage[type_page].current.setAttribute("select" , "")
            } catch(e) {}

            setTypePage(4)
            SetStatePage(type_page)
            const Data = JSON.parse(context).list
            setDataFormManage(JSON.parse(context))
            setContent(Data.map((data , key)=> 
                <section key={key} className="list-manage-doctor" 
                    state_success={type_page === "success" ? data.type_success : null}
                    status_check={type_page === "CheckForm" ? data.status_check : null}>
                    {
                        type_page === "success" ? 
                        <>
                            <div className="row">
                                <div className="field">
                                    <span>ไอดีเก็บเกี่ยว</span>
                                    <div>{data.id_success}</div>
                                </div>
                                <div className="field date">
                                    <span>วันที่</span>
                                    <DayJSX DATE={data.date_of_doctor} TYPE="small"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="field">
                                    <span>เจ้าหน้าที่</span>
                                    <div>{data.name_doctor}</div>
                                </div>
                                <div className="field">
                                    <span>ไอดีเจ้าหน้าที่</span>
                                    <div>{data.id_doctor}</div>
                                </div>
                            </div>
                        </>
                        :
                        type_page === "report" ? 
                            <ListReport data={data} index={key}/> 
                        :
                        type_page === "CheckForm" ? 
                            <ListCheckForm data={data} index={key}/>
                        :
                        type_page === "CheckPlant" ?  
                        <>
                        <div className="row">
                            <div className="field">
                                <span>ผลวิเคราะห์</span>
                                <div>{!data.state_check ? "ก่อน" : "หลัง"} : {data.status_check}</div>
                            </div>
                            <div className="field date">
                                <span>วันที่</span>
                                <DayJSX DATE={data.date_check} TYPE="small"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field column">
                                <span>หมายเหตุ</span>
                                <div>{data.note_text ? data.note_text : "ไม่ระบุ"}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field">
                                <span>เจ้าหน้าที่</span>
                                <div>{data.name_doctor}</div>
                            </div>
                            <div className="field">
                                <span>ไอดีเจ้าหน้าที่</span>
                                <div>{data.id_doctor}</div>
                            </div>
                        </div>
                        </>
                        : ""
                    }
                </section>
            ))
        }
        else session()
    }

    // succes action
    const RefManagePopup = useRef()
    const [ ManagePop , setManagePop ] = useState(<></>) 

    const SuccessResult = async (result) => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) {
            setManagePop(<PopupConfirmAction Ref={RefManagePopup} setPopup={setManagePop}
                            session={session} FetchData={()=>MenuManageFormByDoctor("success")} Result={result} id_plant={id_form}/>)
        }
        else session()
    }

    //popup manage
    const PopupReport = async (typeClick , statusCheck = "") => {
        const context = await clientMo.get('/api/doctor/name')
        if(context) {
            setManagePop(<InsertManage Ref={RefManagePopup} setPopup={setManagePop}
                session={session} FetchData={()=>MenuManageFormByDoctor(typeClick)} NameDoctor={context} typeInsert={typeClick} id_plant={id_form} statusSuccess={statusCheck}/>)
        }
        else session()
    }

    // report
    const PopupEditReport = async (Data , typeClick) => {
        const context = await clientMo.get('/api/doctor/name')
        if(context) {
            setManagePop(<EditReport Ref={RefManagePopup} setPopup={setManagePop} session={session} 
                            FetchData={()=>MenuManageFormByDoctor(typeClick)} Data={Data}/>)
        }
        else session()
    }


    //export menu 
    const PdfExport = async (id_table) => {
        let JsonData = {textInput : id_table}

        const ExportFetch = await clientMo.post('/api/doctor/form/export' , JsonData)
        if(ExportFetch) {
            const DataExport = JSON.parse(ExportFetch)
            ExportPDF(DataExport)
        } else session()
    }

    return (
        <>
        <div className="content-detail-form">
            <a title="ปิด" className="close">
                <svg onClick={close} width="45" height="44" viewBox="0 0 45 44" fill="none">
                    <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                </svg>
            </a>
            <div className="menu-content" show={StateMenuShow ? "" : null}>
                { StateMenuShow ?
                    <a title="ปิดเมนู" onClick={()=>setStateMenuShow(false)}>
                        <svg className="menu-90" viewBox="0 0 45 44">
                            <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z"/>
                        </svg>
                    </a>
                    :
                    <a title="เปิดเมนู" onClick={()=>setStateMenuShow(true)}>
                        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <path fillRule="evenodd" d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"/>
                        </svg>
                    </a>
                }
                <a title="ข้อมูลพื้นฐาน" onClick={()=>{
                        ChangeTypePage(0)
                        setStateMenuShow(false)
                    }}>
                    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 92.04 122.88" >
                        <g>
                            <path style={{fillRule : "evenodd",clipRule : "evenodd"}} d="M21.74,33.56h48.65c0.24,0,0.44,0.2,0.44,0.44c0,3.15,0,1.05,0,4.19c0,0.24-0.2,0.44-0.44,0.44H21.74 c-0.29,0-0.53-0.24-0.53-0.53c0-3.09,0-0.93,0-4.02C21.21,33.8,21.45,33.56,21.74,33.56L21.74,33.56z M9.25,7.23h7.81V2.33 c0-1.28,1.28-2.33,2.85-2.33h0c1.57,0,2.85,1.05,2.85,2.33v4.89h12.4V2.33C35.16,1.05,36.44,0,38,0h0c1.57,0,2.85,1.05,2.85,2.33 v4.89h12.4V2.33C53.25,1.05,54.53,0,56.1,0h0c1.57,0,2.85,1.05,2.85,2.33v4.89h12.4V2.33c0-1.28,1.28-2.33,2.85-2.33h0 c1.57,0,2.85,1.05,2.85,2.33v4.89h5.74c5.09,0,9.25,4.16,9.25,9.25v97.15c0,5.09-4.16,9.25-9.25,9.25H9.25 c-5.09,0-9.25-4.16-9.25-9.25V16.48C0,11.39,4.16,7.23,9.25,7.23L9.25,7.23z M9.99,15.1h7.07v3.47c0,1.28,1.28,2.33,2.85,2.33h0 c1.57,0,2.85-1.05,2.85-2.33V15.1h12.4v3.47c0,1.28,1.28,2.33,2.85,2.33h0c1.57,0,2.85-1.05,2.85-2.33V15.1h12.4v3.47 c0,1.28,1.28,2.33,2.85,2.33h0c1.57,0,2.85-1.05,2.85-2.33V15.1h12.4v3.47c0,1.28,1.28,2.33,2.85,2.33h0 c1.57,0,2.85-1.05,2.85-2.33V15.1h5c1.43,0,2.61,1.18,2.61,2.61v94.68c0,1.42-1.18,2.61-2.61,2.61H9.99 c-1.42,0-2.61-1.17-2.61-2.61V17.71C7.38,16.28,8.56,15.1,9.99,15.1L9.99,15.1z M21.74,104.89h48.65c0.24,0,0.44-0.2,0.44-0.44 c0-3.15,0-1.05,0-4.19c0-0.24-0.2-0.44-0.44-0.44H21.74c-0.29,0-0.53,0.24-0.53,0.53c0,2.73,0,1.29,0,4.02 C21.21,104.65,21.45,104.89,21.74,104.89L21.74,104.89z M21.74,88.33h48.65c0.24,0,0.44-0.2,0.44-0.44c0-3.15,0-0.57,0-3.71 c0-0.24-0.2-0.44-0.44-0.44H21.74c-0.29,0-0.53,0.24-0.53,0.53c0,3.09,0,0.45,0,3.54C21.21,88.09,21.45,88.33,21.74,88.33 L21.74,88.33z M21.74,71.76h48.65c0.24,0,0.44-0.2,0.44-0.44c0-3.15,0-1.53,0-4.67c0-0.24-0.2-0.44-0.44-0.44H21.74 c-0.29,0-0.53,0.24-0.53,0.53c0,3.09,0,1.41,0,4.5C21.21,71.52,21.45,71.76,21.74,71.76L21.74,71.76z M21.74,55.2h48.65 c0.24,0,0.44-0.2,0.44-0.44c0-3.15,0-1.05,0-4.19c0-0.24-0.2-0.44-0.44-0.44H21.74c-0.29,0-0.53,0.24-0.53,0.53 c0,3.09,0,0.93,0,4.02C21.21,54.96,21.45,55.2,21.74,55.2L21.74,55.2z"/>
                        </g>
                    </svg>
                </a>
                <a title="ปัจจัยการผลิต" onClick={()=>{
                        ChangeTypePage(1)
                        setStateMenuShow(false)
                    }}>
                    <svg shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 437 512.09">
                        <path fillRule="nonzero" d="M123.65 71.27a6.564 6.564 0 0 1-5.43 4.71c-8.75 7.68-17.25 15.58-25.36 24 37.16 9.86 74.19 16.22 111.12 18.79 28.55 1.99 57.04 1.72 85.47-.92 13.06-1.52 26.7-3.54 41.19-6.07.99-.17 1.92-.35 2.8-.54.25-.49.33-1.21.18-2.25-1.02-6.94-6.34-11.99-11.82-17.07l-2.08-1.91c-2.31-2.17-4.7-4.37-7.16-6.59l-.85-.13a6.597 6.597 0 0 1-5.55-5.57l-2.49-2.17a587.18 587.18 0 0 0-16.95-14.15l-2.93-2.36c-16.8-13.56-55.06-44.44-69.75-45.71-19.04-1.62-38.26 14.45-56.65 29.84l-10.42 8.62c-7.9 6.52-15.7 12.95-23.32 19.48zm95.14 282.74 35.84-14.35-32.88 18.87c5.46 5.26 11.85 8.02 19.09 8.5 14.93.99 28.7-5.66 37.92-17.22 1.74-2.18 3.26-4.62 4.59-7.17 1.62-3.1 7.41-13.51 6.58-16-1.23-3.63-18.28-6.14-22.18-6.67-20.26-2.78-45.03.59-50.53 24.41-.26 1.17-.32 2.35-.23 3.55l-1.14.74-1.08-.79c.2-.83.31-1.68.29-2.53-.5-20.54-20.33-27.49-37.48-28.63-3.3-.21-17.76-1.03-19.38 1.75-1.11 1.9 1.91 11.46 2.71 14.28.67 2.32 1.51 4.59 2.57 6.69 5.64 11.06 15.86 18.87 28.32 20.57 6.04.83 11.76-.37 17.15-3.77l-23.89-21.09 25.8 16.82-.01.18c1.21 4.22 1.59 8.6 1.29 13.26-4.25.66-8.82 3.49-9.03 7.77-14.84-10.02-29.23 11.93-27.76 26.09l83.84-4.73c-1.5-15.38-18.42-21.23-29.53-15.32 4.17-11.55-4.67-14-10.99-12.27-.19-.24-.41-.45-.67-.63-.55-4.19-.51-8.38.79-12.31zm-.29-107.89c27.83 0 53.04 11.29 71.28 29.53 18.24 18.24 29.53 43.45 29.53 71.28 0 27.84-11.29 53.04-29.53 71.28-18.24 18.24-43.45 29.53-71.28 29.53-27.84 0-53.04-11.29-71.28-29.53-18.25-18.24-29.53-43.44-29.53-71.28 0-27.83 11.28-53.04 29.53-71.28 18.24-18.24 43.44-29.53 71.28-29.53zm62.08 38.72c-15.88-15.89-37.83-25.71-62.08-25.71s-46.21 9.82-62.09 25.71c-15.89 15.89-25.72 37.84-25.72 62.09s9.83 46.21 25.72 62.09c15.88 15.89 37.84 25.71 62.09 25.71s46.2-9.82 62.08-25.71c15.89-15.88 25.72-37.84 25.72-62.09s-9.83-46.2-25.72-62.09zM195.6 39.58c1.72 0 3.1 1.38 3.1 3.1 0 1.71-1.38 3.1-3.1 3.1-1.71 0-3.1-1.39-3.1-3.1 0-1.72 1.39-3.1 3.1-3.1zm38.25 32.1c1.71 0 3.09 1.39 3.09 3.1a3.094 3.094 0 1 1-6.19 0c0-1.71 1.38-3.1 3.1-3.1zm-31.98 18.08a4.5 4.5 0 0 1 0 9c-2.49 0-4.51-2.01-4.51-4.5s2.02-4.5 4.51-4.5zm154.42 302.5c-.39-3.62 2.22-6.88 5.84-7.28 3.61-.39 6.87 2.21 7.27 5.83.87 7.83 1.87 19.86 1.81 30.59-.05 7.97-.71 15.31-2.47 20.08-1.25 3.42-5.04 5.17-8.46 3.92-3.42-1.25-5.17-5.04-3.92-8.46 1.19-3.24 1.65-9.05 1.69-15.59.06-9.99-.91-21.52-1.76-29.09zm-295.01 11.8c.39-3.62 3.65-6.23 7.27-5.83 3.62.39 6.23 3.65 5.83 7.27-.68 6.12-.85 11.88-.43 17.24.4 5.16 1.37 9.92 2.94 14.2 1.25 3.42-.51 7.21-3.92 8.46-3.42 1.25-7.22-.5-8.47-3.92-2-5.45-3.21-11.38-3.71-17.71-.48-6.15-.29-12.74.49-19.71zM200.23 60.55c1.71 0 3.09 1.39 3.09 3.1a3.094 3.094 0 1 1-6.19 0c0-1.71 1.38-3.1 3.1-3.1zM176.5 71.38c2.49 0 4.5 2.01 4.5 4.5s-2.01 4.5-4.5 4.5-4.5-2.01-4.5-4.5 2.01-4.5 4.5-4.5zm-54.15 22.28c1.33 0 2.4 1.08 2.4 2.41s-1.07 2.4-2.4 2.4c-1.33 0-2.41-1.07-2.41-2.4 0-1.33 1.08-2.41 2.41-2.41zm19.3-3c2.49 0 4.51 2.01 4.51 4.5s-2.02 4.5-4.51 4.5a4.5 4.5 0 0 1 0-9zm24.44 8.94c1.72 0 3.1 1.39 3.1 3.1 0 1.71-1.38 3.1-3.1 3.1-1.71 0-3.1-1.39-3.1-3.1 0-1.71 1.39-3.1 3.1-3.1zm-14.78-31.17a3.495 3.495 0 1 1 0 6.99c-1.94 0-3.5-1.56-3.5-3.5 0-1.93 1.56-3.49 3.5-3.49zM227 38.33c1.49 0 2.7 1.21 2.7 2.7 0 1.5-1.21 2.7-2.7 2.7-1.5 0-2.71-1.2-2.71-2.7 0-1.49 1.21-2.7 2.71-2.7zm6.46 63.49c1.33 0 2.41 1.08 2.41 2.41s-1.08 2.41-2.41 2.41-2.4-1.08-2.4-2.41 1.07-2.41 2.4-2.41zm42.48-37.47c1.33 0 2.4 1.07 2.4 2.4 0 1.33-1.07 2.41-2.4 2.41-1.33 0-2.41-1.08-2.41-2.41s1.08-2.4 2.41-2.4zm-24.06 22.63c2.05 0 3.7 1.65 3.7 3.7 0 2.05-1.65 3.7-3.7 3.7-2.05 0-3.7-1.65-3.7-3.7 0-2.05 1.65-3.7 3.7-3.7zm18.98-4c2.18 0 3.93 1.76 3.93 3.93 0 2.18-1.75 3.94-3.93 3.94-2.17 0-3.93-1.76-3.93-3.94a3.93 3.93 0 0 1 3.93-3.93zm23.94 11.71a2.96 2.96 0 1 1 0 5.92c-1.64 0-2.97-1.33-2.97-2.96 0-1.64 1.33-2.96 2.97-2.96zm-4.36-17.58c1.81 0 3.28 1.47 3.28 3.28 0 1.81-1.47 3.27-3.28 3.27-1.8 0-3.27-1.46-3.27-3.27a3.28 3.28 0 0 1 3.27-3.28zm-15.22 26.42c1.8 0 3.25 1.46 3.25 3.26 0 1.8-1.45 3.26-3.25 3.26-1.81 0-3.26-1.46-3.26-3.26 0-1.8 1.45-3.26 3.26-3.26zM96.26 78.13c-3.39.37-6.7.76-9.79 1.17l-.52.05c-6.25.32-11.26 2.17-15.38 5l-.03.02c-.87.6-1.72 1.25-2.53 1.95.44 1.21 1.42 2.52 2.93 3.9 1.96 1.78 4.65 3.54 8.05 5.28 5.61-6.05 11.37-11.81 17.27-17.37zm250.19 27.58c1.92-1.62 3.23-3.4 4.6-5.28 2.11-2.89 4.33-5.94 7.85-8.99-2.08-.48-4.27-.9-6.55-1.35l-3.94-.77c-4-.77-8.29-1.52-12.67-2.25 4.96 5.03 9.18 10.64 10.71 18.64zm-28.07-34.75c10.43 1.6 22.01 3.39 32.52 5.41l3.95.77c7.71 1.5 14.54 2.84 20.76 6.24 1.35.34 2.58 1.09 3.5 2.19 1.57 1.11 3.1 2.4 4.59 3.9 6.66 6.68 12.35 18.2 16.47 30.46 4.71 14.03 7.49 29.39 7.32 39.41-.18 10-1.99 18.69-5.96 25.67-3.63 6.39-8.93 11.23-16.23 14.2 5.41 14.59 9.92 42.31 13.5 73.81 5.81 51.23 9.33 113.28 10.08 143.82.18 7.35-.2 12.26-.47 15.85-.22 2.86-.35 4.59-.23 4.89.16.38 2.84 1.61 9.58 4.68l.75.35c9.2 4.21 14.77 9.77 17.2 17.8 2.22 7.3 1.5 16.2-1.65 27.74a6.584 6.584 0 0 1-6.48 5.06l-54.49-.73c-40.52 8.22-76.06 14.57-110.69 17.6-35.09 3.09-69.47 2.82-107.4-2.23-18.57-2.47-36.74-5.48-54.11-8.35-13.9-2.3-27.3-4.52-39.86-6.3-7.75-1.09-16.54-.52-25.14.04-9.06.58-17.95 1.16-26.13-.06-2.3-.36-4.35-1.9-5.22-4.23-5.46-14.62-5.72-24.97-2.26-32.56 3.72-8.14 11.09-12.48 20.65-15.05 5.24-1.4 5.22-1.61 4.92-3.97-.34-2.69-.79-6.21-.95-10.95-1.19-35.28.83-88.77 5.26-137.27 3.58-39.18 8.75-75.27 15.12-96.26-10.63-5.39-19.43-11.77-22.64-19.06-4.48-10.16-3.22-23.36.78-36.76 5.38-18.01 15.79-36.81 23.25-48.2 3.9-5.97 8.54-11.33 14.44-15.38 6.01-4.11 13.17-6.8 21.96-7.28 4.93-.65 10.33-1.25 15.71-1.79 3.79-.39 7.95-.78 11.99-1.15 8.44-7.3 17.07-14.41 25.84-21.64l10.32-8.57C169.38 15.94 190.74-1.93 215.14.17c18.69 1.61 59.15 34.27 76.91 48.6l2.93 2.36c5.9 4.75 11.68 9.57 17.31 14.47 2.02 1.75 4.05 3.54 6.09 5.36zm8.49 55.37a530.606 530.606 0 0 1-35.27 4.55c-6.89.81-13.63 1.48-20.24 2.02-19.14 1.56-37.37 1.99-55.64 1.33-21.1-.76-50.3-3.55-77.96-8.44-22.08-3.91-43.36-9.19-59.11-15.92-7.15-3.05-12.69-6.35-16.58-9.9-1.09-.99-2.05-2-2.9-3.04-6.93 10.73-16.28 27.76-21.11 43.91-3.19 10.69-4.39 20.79-1.35 27.68 5.76 13.05 46.6 24.58 63.38 29.32l1.67.47c22.75 6.45 47.02 11.15 71.48 13.86 16.83 1.86 33.75 2.79 50.34 2.7 25.69-.99 52.76-4.18 82.11-9.29 5.43-1.23 10.86-2.58 16.29-4.06l56-13.68c5.65-1.69 9.58-4.9 12.1-9.33 2.82-4.95 4.11-11.55 4.25-19.38.15-8.67-2.37-22.31-6.64-35.02-3.54-10.54-8.19-20.21-13.33-25.35-.4-.4-.82-.78-1.24-1.15-6.3 3.52-8.98 7.18-11.44 10.56-4.12 5.65-7.85 10.75-18.94 14.27-2.48 1.73-5.86 2.5-9.81 3.08l-6.06.81zm-18.74 92.21a396.233 396.233 0 0 1-62.45 8.81c-7.37.44-14.84.68-22.38.71-6.95.25-13.83.36-20.62.3-49.82-.43-95.46-9.51-143.54-29.09-5.75 20.33-10.5 54.2-13.87 91.07-4.38 47.99-6.38 100.85-5.21 135.66.14 4.17.54 7.32.85 9.72 1.64 12.88 1.78 14-14.58 18.37-5.92 1.59-10.3 3.9-12.07 7.77-1.78 3.89-1.58 9.82 1.29 18.68 5.97.41 12.69-.02 19.52-.46 9.24-.6 18.68-1.22 27.77.07 12.62 1.78 26.15 4.02 40.16 6.34 17.46 2.89 35.72 5.92 53.7 8.31 36.78 4.9 70.27 5.14 104.57 2.13 34.57-3.04 69.79-9.34 109.92-17.49.45-.09.91-.13 1.36-.13l49.99.67c1.5-6.74 1.76-11.88.58-15.75-1.24-4.07-4.5-7.1-10.08-9.65l-.75-.34c-10.07-4.61-14.07-6.43-16.24-11.5-1.4-3.29-1.17-6.21-.8-11.03.26-3.46.63-8.19.47-14.57-.74-30.14-4.24-91.61-10.03-142.67-3.4-29.97-7.53-56.08-12.23-69.42-23.04 5.38-44.72 9.9-65.33 13.49z"/>
                    </svg>
                </a>
                <a title="สารเคมี" onClick={()=>{
                        ChangeTypePage(2)
                        setStateMenuShow(false)
                    }}>
                    <svg id="Layer_1" data-name="Layer 1" viewBox="-8 0 90 122.88">
                        <path d="M14,41.48h27.5c2,13.88,7.76,23.34,12.34,33.91,5.65,13.07,8.21,16.34,6,31.09a26.44,26.44,0,0,1-3.69,10.73A13.57,13.57,0,0,1,52.49,121a11.55,11.55,0,0,1-5.54,1.9H17.63a17.42,17.42,0,0,1-8.23-2.32C-9.74,108.77,5,56.53,13,42.11a1.19,1.19,0,0,1,1-.63ZM55.53,1.41,55.4,16.56a1.17,1.17,0,0,1-.87,1.13h0a23.68,23.68,0,0,0-9.33,4.6,15.46,15.46,0,0,0-4.9,9.11v5.18a1.19,1.19,0,0,1-1.19,1.2H18.36A2.91,2.91,0,0,1,15.85,37a3.91,3.91,0,0,1-.92-2.8v-.12c.4-4.25-.48-7.42-2.48-9.89s-5.37-4.42-9.79-6a1.2,1.2,0,0,1-.72-1.53h0C4.33,10.3,8,6.27,12.62,3.76S26,.35,31.94.19C35.66.09,39.4,0,43.15,0s7.49,0,11.22.18a1.18,1.18,0,0,1,1.16,1.23ZM58,1.06l.1,14.56h7.12c1,0,1.51-.81,1.27-3V3.51a1.63,1.63,0,0,0-1-1.59L58,1.06ZM45.47,32.67c1.27-5.07,4.3-8.41,9.4-9.7A48.49,48.49,0,0,0,62,43c2.12,3-1.32,6.07-3.79,2.92l-8-13.12-4.68-.13ZM28.16,72.06a20.2,20.2,0,0,0-3.87.65,19.26,19.26,0,0,0-3.68,1.38,20.13,20.13,0,0,0-8.49,8h0a19.92,19.92,0,0,0-1.62,3.58,20.71,20.71,0,0,0-.9,3.83,20.36,20.36,0,0,0-.12,3.91,19.4,19.4,0,0,0,.64,3.88,20.23,20.23,0,0,0,1.38,3.68,20.15,20.15,0,0,0,4.75,6.2,21,21,0,0,0,3.14,2.26l.06,0A20.31,20.31,0,0,0,23,111a19.58,19.58,0,0,0,3.83.89h0a19.72,19.72,0,0,0,7.79-.52A19.78,19.78,0,0,0,38.34,110,20.2,20.2,0,0,0,41.67,108a20,20,0,0,0,5.15-5.88,20.31,20.31,0,0,0,1.63-3.59,20.07,20.07,0,0,0,1-7.74,21.22,21.22,0,0,0-.64-3.88,20.54,20.54,0,0,0-1.39-3.68,20.15,20.15,0,0,0-2.06-3.33A20.84,20.84,0,0,0,42.69,77a20,20,0,0,0-10.61-4.81h0a20.43,20.43,0,0,0-3.92-.13Zm1.35,10.21a4.2,4.2,0,0,1,1.5.28c.62-1.35.8-1.78,1.49-3.1l1.65,1.08c.35.22-1.07,2-1.52,3a10.53,10.53,0,0,1,3.07,5.63H29.06l.68.82H37l3.05-1c3-.89,3,1.88,1.57,2.37l-3.92,1.34h0c0,.21,0,.43,0,.65A16.66,16.66,0,0,1,37.64,95l3.73,1.89c1.21.61,1.32,3.28-1.82,2.16l-2.47-1.25-.24.73,3.83,4.63a1,1,0,0,0,1.45.14,1.14,1.14,0,0,0,.16-.15l.36-.43.38-.49c.2-.27.4-.55.59-.84s.4-.62.56-.89a17.33,17.33,0,0,0,1.37-3,17,17,0,0,0,.76-3.24A16.62,16.62,0,0,0,46.4,91a17,17,0,0,0-.54-3.29,17.41,17.41,0,0,0-1.17-3.12,16.53,16.53,0,0,0-1.75-2.81h0a16.84,16.84,0,0,0-2.28-2.42A16.55,16.55,0,0,0,38,77.36a16.08,16.08,0,0,0-3-1.38,17,17,0,0,0-9.83-.32c-.44.12-.87.26-1.3.41s-.83.31-1.25.5h0c-.3.13-.58.27-.83.39l-.8.45a1,1,0,0,0-.38,1.41.83.83,0,0,0,.16.21l4.65,5.63a7.63,7.63,0,0,1,1.05-1.13c-.23-.49-.42-.93-.59-1.31l-1-1.84,1.66-1.08c.31-.2.59.3.83,1s.54,1.81.75,2.28a5,5,0,0,1,1.52-.28ZM25.1,89.16H23.31a14.76,14.76,0,0,1,.47-1.59l-5.51-6.66a1,1,0,0,0-1.45-.14.71.71,0,0,0-.15.15l-.37.43-.38.49c-.2.26-.4.55-.59.84s-.4.62-.55.89a16.73,16.73,0,0,0-1.38,3,16.22,16.22,0,0,0-.75,3.24,15.9,15.9,0,0,0-.11,3.31,17.23,17.23,0,0,0,.54,3.29,17.8,17.8,0,0,0,1.17,3.11A16.91,16.91,0,0,0,16,102.38h0a16.77,16.77,0,0,0,2.27,2.42A17.45,17.45,0,0,0,21,106.75a16.8,16.8,0,0,0,6.28,2.13,15.9,15.9,0,0,0,3.31.11,17.23,17.23,0,0,0,3.29-.54c.43-.12.87-.26,1.3-.41s.82-.31,1.24-.5h0l.79-.38.82-.44a1,1,0,0,0,.37-1.42.8.8,0,0,0-.15-.21l-3-3.56a7.14,7.14,0,0,1-5.73,3.34c-3.37,0-6.27-2.93-7.5-7.09L19.39,99c-3.11,1.47-3.1-1.63-1.79-2.21L21.54,95a16.25,16.25,0,0,1-.08-1.7h0c0-.22,0-.44,0-.65L17.31,91.2c-1.56-.54-1.2-3.35,1.57-2.37L22.21,90h3.57l-.68-.82Z"/>
                    </svg>
                </a>
                <a title="ข้อมูลเกษตรกร" onClick={()=>{
                        GetProfileFarmer()
                        setStateMenuShow(false)
                    }}>
                    <svg viewBox="0 0 297 297">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                        <g id="SVGRepo_iconCarrier"> <g> <path d="M113.986,209.155c-2.197,0-4.361,0.889-5.909,2.447c-1.558,1.558-2.457,3.723-2.457,5.919c0,2.196,0.899,4.351,2.457,5.919 c1.548,1.557,3.712,2.447,5.909,2.447c2.206,0,4.361-0.89,5.919-2.447c1.557-1.558,2.447-3.713,2.447-5.919 c0-2.207-0.89-4.361-2.447-5.919C118.347,210.043,116.192,209.155,113.986,209.155z"/> <path d="M267.206,185.582c-2.057-16.465-11.21-30.85-24.486-38.482l-49.029-28.182c10.546-11.153,17.033-26.182,17.033-42.707 c0-1.178-0.042-2.354-0.109-3.529h58.672c5.775,0,10.458-4.682,10.458-10.458s-4.682-10.458-10.458-10.458h-46.3 C211.528,20.982,181.782,0,148.5,0S85.472,20.982,74.013,51.766h-46.3c-5.775,0-10.458,4.682-10.458,10.458 s4.682,10.458,10.458,10.458h58.672c-0.067,1.175-0.109,2.352-0.109,3.529c0,16.525,6.487,31.554,17.033,42.707L54.28,147.1 c-13.274,7.63-22.428,22.016-24.487,38.482l-12.457,99.663c-0.372,2.976,0.553,5.969,2.537,8.218 c1.985,2.249,4.841,3.537,7.84,3.537h241.574c2.999,0,5.855-1.288,7.84-3.537c1.985-2.249,2.909-5.242,2.537-8.218L267.206,185.582 z M89.937,193.468h117.127v82.616H89.937V193.468z M107.192,172.553v-31.742l14.619-8.403c8.093,3.859,17.142,6.026,26.69,6.026 s18.596-2.167,26.69-6.026l14.619,8.403v31.742H107.192z M148.5,20.915c21.248,0,40.54,11.606,50.806,29.456H97.694 C107.96,32.521,127.252,20.915,148.5,20.915z M189.656,72.681c0.101,1.174,0.152,2.351,0.152,3.529 c0,22.777-18.531,41.308-41.308,41.308s-41.308-18.531-41.308-41.308c0-1.179,0.051-2.355,0.152-3.529H189.656z M50.547,188.176 c1.249-9.989,6.54-18.566,14.156-22.943l21.573-12.4v19.72h-6.798c-5.775,0-10.458,4.683-10.458,10.458v93.074H39.56 L50.547,188.176z M227.979,276.085v-93.074c0-5.775-4.682-10.458-10.458-10.458h-6.798v-19.72l21.573,12.4 c7.616,4.377,12.907,12.955,14.155,22.943l10.989,87.908H227.979z"/> <path d="M183.007,209.155c-2.197,0-4.361,0.889-5.909,2.447c-1.558,1.558-2.457,3.712-2.457,5.919c0,2.206,0.899,4.361,2.457,5.919 c1.548,1.557,3.712,2.447,5.909,2.447c2.206,0,4.361-0.89,5.919-2.447c1.557-1.558,2.447-3.724,2.447-5.919 c0-2.207-0.89-4.361-2.447-5.919C187.368,210.043,185.213,209.155,183.007,209.155z"/> </g> </g>
                    </svg>
                </a>
                <a title="ส่วนเจ้าหน้าที่" onClick={async ()=>{
                        setLoadContent(true)
                        await MenuManageFormByDoctor("success")
                        setStateMenuShow(false)
                        setLoadContent(false)
                    }}>
                    <svg id="Layer_1" data-name="Layer 1" viewBox="0 0 111.56 122.88">
                        <path style={{fillRule : "evenodd"}} d="M79.86,65.67a25,25,0,0,1,20.89,38.62l10.81,11.78-7.46,6.81L93.68,111.42A25,25,0,1,1,79.86,65.67Zm-42.65.26a2.74,2.74,0,0,1-2.6-2.84,2.71,2.71,0,0,1,2.6-2.84h15.4a2.76,2.76,0,0,1,2.6,2.84,2.71,2.71,0,0,1-2.6,2.84ZM22.44,57.22a5.67,5.67,0,1,1-5.67,5.67,5.67,5.67,0,0,1,5.67-5.67Zm2-18.58a2,2,0,0,1,2.85,0,2.07,2.07,0,0,1,0,2.89l-2,2,2,2a2,2,0,0,1,0,2.87,2,2,0,0,1-2.84,0l-2-2-2,2a2,2,0,0,1-2.86,0,2.07,2.07,0,0,1,0-2.89l2-2-2-2.05a2,2,0,0,1,2.87-2.86l2,2,2-2ZM16.85,21.52a2.29,2.29,0,0,1,3.16.63l1.13,1.36,4-5.05a2.27,2.27,0,1,1,3.51,2.88l-5.86,7.34a2.48,2.48,0,0,1-.55.52,2.28,2.28,0,0,1-3.16-.63l-2.84-3.89a2.28,2.28,0,0,1,.63-3.16Zm66.51-4.25h9.32a6.69,6.69,0,0,1,6.66,6.65v30.9c-.2,2.09-5.31,2.11-5.75,0V23.92a.93.93,0,0,0-.27-.67.91.91,0,0,0-.67-.27H83.32V54.82c-.49,1.89-4.75,2.18-5.71,0V6.66A1,1,0,0,0,77.34,6a.93.93,0,0,0-.67-.27h-70A.93.93,0,0,0,6,6a1,1,0,0,0-.27.68V85.79a1,1,0,0,0,.27.68.93.93,0,0,0,.67.27H44.74c2.88.29,3,5.27,0,5.71H21.66v10.61a.92.92,0,0,0,.94.94H44.74c2.09.24,2.76,5,0,5.71H22.64a6.54,6.54,0,0,1-4.7-2,6.63,6.63,0,0,1-2-4.7V92.45H6.66A6.69,6.69,0,0,1,0,85.79V6.66A6.54,6.54,0,0,1,2,2a6.61,6.61,0,0,1,4.7-2h70a6.55,6.55,0,0,1,4.7,2,6.65,6.65,0,0,1,2,4.7V17.27ZM37.18,26.44a2.75,2.75,0,0,1-2.6-2.84,2.71,2.71,0,0,1,2.6-2.84H63.86a2.74,2.74,0,0,1,2.6,2.84,2.71,2.71,0,0,1-2.6,2.84Zm0,19.74a2.74,2.74,0,0,1-2.6-2.83,2.71,2.71,0,0,1,2.6-2.84H63.86a2.74,2.74,0,0,1,2.6,2.84,2.7,2.7,0,0,1-2.6,2.83ZM70.45,93a3.46,3.46,0,0,1-.34-.44,3.4,3.4,0,0,1-.26-.5,3.18,3.18,0,0,1,4.57-4,2.93,2.93,0,0,1,.49.38h0c.87.83,1.15,1,2.11,1.87l.84.74,6.79-7.29c2.87-3,7.45,1.37,4.58,4.4l-8.47,9.06-.43.45a3.19,3.19,0,0,1-4.43.19l0,0c-.22-.19-.44-.4-.66-.6-.52-.46-1.06-.94-1.61-1.41-1.26-1.09-2-1.69-3.17-2.87Zm9.43-22.09A19.86,19.86,0,1,1,60,90.74,19.86,19.86,0,0,1,79.88,70.88Z"/>
                    </svg>
                </a>
                <a title="ส่งออกข้อมูล" onClick={()=>{
                        PdfExport(id_form)
                        setStateMenuShow(false)
                    }}>
                    <svg viewBox="0 0 24 24" className="menu-80">
                        <path d="M20.92 15.62a1.15 1.15 0 0 0-.21-.33l-3-3a1 1 0 0 0-1.42 1.42l1.3 1.29H12a1 1 0 0 0 0 2h5.59l-1.3 1.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3-3a.93.93 0 0 0 .21-.33 1 1 0 0 0 0-.76ZM14 20H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h4a1 1 0 0 0 .92-.62 1 1 0 0 0-.21-1.09l-6-6a1.07 1.07 0 0 0-.28-.19h-.09l-.28-.1H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h8a1 1 0 0 0 0-2ZM13 5.41 15.59 8H14a1 1 0 0 1-1-1Z"></path>
                    </svg>
                </a>
            </div>
            <div className="content-detail">
                { LoadContent ? 
                    <div style={{
                        display : "flex",
                        justifyContent : "center",
                        alignItems : "center",
                        overflow : "hidden",
                        width : "100%",
                        height : "100%"
                    }}>
                        <Loading size={"100px"} border={"8px"} color="#22c7a9b2" animetion={true}/>
                    </div>
                    :
                    <div className="content-body">
                        {
                            TypePage === 0 || TypePage === 1 || TypePage === 2 || TypePage === 4 ? 
                            <div className="fullname-farmer">
                                <span>ชื่อเกษตรกร</span>
                                <div className="frame-text">
                                    <div className="text">
                                        {getNameFarmer}
                                    </div>
                                </div>
                            </div> : <></>
                        }
                        <div className="head-content">
                            <div className="text">{TypePage === 0 ? "ข้อมูลการปลูกพืช" : TypePage === 1 ? "ข้อมูลการใช้ปัจจัยการผลิต" : TypePage === 2 ? "ข้อมูลการใช้สารเคมี" : TypePage === 3 ? "ข้อมูลเกษตรกร" : TypePage === 4 ? "บันทึกเจ้าหน้าที่" : ""}</div>
                            { TypePage === 0 ?
                                (
                                    <a className="bt-edit" onClick={()=>GetDetailEdit(id_form , "plant")}>
                                        { CountEdit ? <div className="count-edit"></div> : <></>}
                                        <svg viewBox="0 0 494.936 494.936">
                                            <g>
                                                <g>
                                                    <path d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157
                                                        c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21
                                                        s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741
                                                        c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"/>
                                                    <path d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069
                                                        c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963
                                                        c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692
                                                        C494.936,37.396,491.007,27.915,483.876,20.791z M466.61,56.897L257.457,266.05c-0.035,0.036-0.055,0.078-0.089,0.107
                                                        l-33.989,15.131L238.51,247.3c0.03-0.036,0.071-0.055,0.107-0.09L447.765,38.058c5.038-5.039,13.819-5.033,18.846,0.005
                                                        c2.518,2.51,3.905,5.855,3.905,9.414C470.516,51.036,469.127,54.38,466.61,56.897z"/>
                                                </g>
                                            </g>
                                        </svg>
                                    </a>
                                ) : <></>
                            }
                        </div>
                        <div className={`frame-body ${TypePage !== 0 && TypePage !== 3 ? TypePage === 4 ? "manage" : "factor" : ''}`}>
                            { TypePage === 4 ?
                                (
                                    <>
                                    <div className="menu-manage-form">
                                        <div className="flex-center" select="" onClick={(e)=>MenuManageFormByDoctor("success" , e)} ref={MenuBTManage.success}>
                                            <div>เก็บเกี่ยว</div>
                                        </div>
                                        <div className="flex-center" onClick={(e)=>MenuManageFormByDoctor("report" , e)} ref={MenuBTManage.report}>
                                            <div>ข้อแนะนำ</div>
                                        </div>
                                        <div className="flex-center" onClick={(e)=>MenuManageFormByDoctor("CheckForm" , e)} ref={MenuBTManage.CheckForm}>
                                            <div>ตรวจสอบ</div>
                                            <div>แบบบันทึก</div>
                                        </div>
                                        <div className="flex-center" onClick={(e)=>MenuManageFormByDoctor("CheckPlant" , e)} ref={MenuBTManage.CheckPlant}>
                                            <div>วิเคราะห์</div>
                                            <div>ผลผลิต</div>
                                        </div>
                                    </div>
                                    <div className="bt-add-content">
                                        { StatePage === "success" ?
                                            <>
                                            <div className="item-2">
                                                <a className="success-0" 
                                                    not={!DataFormManage.option[0].Check_success_after ? null : ""} 
                                                    onClick={!DataFormManage.option[0].Check_success_after ? ()=>SuccessResult(0) : null}>
                                                        <div>สั่งเก็บผลผลิตตัวอย่าง</div>
                                                    {/* <div>ตัวอย่าง</div> */}
                                                </a>
                                                <a className="success-1" 
                                                    not={(DataFormManage.option[0].check_plant_before && !DataFormManage.option[0].Check_success_after) ? null : ""} 
                                                    onClick={(DataFormManage.option[0].check_plant_before && !DataFormManage.option[0].Check_success_after) ? ()=>SuccessResult(1) : null}>
                                                        <div>สั่งเก็บผลผลิตทั้งหมด</div>
                                                    {/* <div>ทั้งหมด</div> */}
                                                </a>
                                            </div>
                                            </> 
                                            : StatePage === "report" ? 
                                                <a onClick={()=>PopupReport("report")}>เพิ่มข้อแนะนำ</a>
                                            : StatePage === "CheckForm" ? 
                                                DataFormManage.list.length === 0 ? 
                                                    <a onClick={()=>PopupReport("CheckForm")}>เพิ่มผลตรวจสอบ</a> : <></>
                                            : StatePage === "CheckPlant" ? 
                                                !DataFormManage.option[0].check_plant_after ?
                                                    <a not={!DataFormManage.option[0].check_success_before ? "" : null} 
                                                        onClick={!DataFormManage.option[0].check_success_before ? null : ()=>PopupReport("CheckPlant" , DataFormManage.option[0])}
                                                        >เพิ่มผลวิเคราะห์</a> 
                                                : <></>
                                            : <></>
                                                     
                                        }
                                    </div>
                                    </>
                                ) : <></>
                            }
                            <div className="body">
                                { TypePage === 0 ?
                                    Content :
                                    <div className="frame-content-scroll">
                                        {Content}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
        <PopupDom Ref={PopRef} Body={BodyPopupEdit}/>
        <PopupDom Ref={RefManagePopup} Body={ManagePop} zIndex={1}/>
        </>
    )
}

const PopupConfirmAction = ({Ref , setPopup , session , FetchData , Result , id_plant}) => {

    const BtConfirm = useRef()
    const Password = useRef()
    
    useEffect(()=>{
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
    } , [])

    const Confirm = async () => {
        if(CheckEmply()) {
            const result = await clientMo.post("/api/doctor/form/manage/success/insert" , {
                type : Result,
                id_plant : id_plant,
                password : Password.current.value
            })

            if(result === "113") {
                FetchData()
                close()
            } else if (result === "password") {
                Password.current.value = ""
                Password.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
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
        <div className="content-confirm-manage">
            <span>{Result ? "ยืนยันเก็บเกี่ยวผลผลิตทั้งหมด" : "ยืนยันเก็บเกี่ยวผลผลิตตัวอย่าง"}</span>
            <input onChange={CheckEmply} ref={Password} placeholder="รหัสผ่านเจ้าหน้าที่" type="password"></input>
            <div className="bt-content">
                <button style={{backgroundColor : "red"}} onClick={close}>ยกเลิก</button>
                <button ref={BtConfirm} not="" onClick={Confirm}>ยืนยัน</button>
            </div>
        </div>
    )
}

const InsertManage = ({Ref , setPopup , session , FetchData , NameDoctor , typeInsert , id_plant , statusSuccess}) => {
    const NoteText = useRef()
    const ImgReport = useRef()
    const [QtyNote , setQtyNote] = useState(0)
    
    const StateCheckBefore = useRef()
    const StateCheckAfter = useRef()

    const [StateCheck , setStateCheck] = useState("")
    const [StateShowNote , setStateShowNote] = useState(!typeInsert === "CheckForm")

    const StatusCheck = useRef()
    
    const Password = useRef()
    const BtConfirm = useRef()

    const [getImgPreview , setImgPreview] = useState("")

    useEffect(()=>{
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
    } , [])

    const close = () => {
        Ref.current.style.opacity = "0"
        Ref.current.style.visibility = "hidden"

        setTimeout(()=>{
            setPopup(<></>)
        })
    }

    const CheckData = async (state = "") => {
        const noteText = NoteText.current
        const Img = ImgReport.current ? ImgReport.current.files[0] ? await ResizeImg(ImgReport.current.files[0] , 600) : "" : ""
        const statusCheck = StatusCheck.current
        let stateCheck = StateCheck
        const Pw = Password.current

        if(state) {
            stateCheck = state
            setStateCheck(state)
            if(state === 1) {
                StateCheckBefore.current.setAttribute("select" , "")
                StateCheckAfter.current.removeAttribute("select")
            }
            else {
                StateCheckAfter.current.setAttribute("select" , "")
                StateCheckBefore.current.removeAttribute("select")
            }
        }

        const check = 
                        typeInsert === "report" ? noteText.value : 
                        typeInsert === "CheckPlant" ? stateCheck && statusCheck.value 
                        :
                        !parseInt(statusCheck.value) ? 
                            noteText ? 
                                statusCheck.value && noteText.value 
                                : false 
                            : statusCheck.value;
        
        if(typeInsert === "CheckForm") 
            (!parseInt(statusCheck.value)) ? setStateShowNote(true) : setStateShowNote(false);

        if(check && Pw.value) {
            BtConfirm.current.setAttribute("pass" , "")
            return typeInsert === "report" ? 
                { 
                    report_text : noteText.value , 
                    img_report : Img,
                    password : Pw.value , 
                    id_plant : id_plant
                } : 
                typeInsert === "CheckPlant" ?
                { 
                    report_text : noteText.value , 
                    statusCheck : statusCheck.value , 
                    stateCheck : stateCheck == 1 ? 0 : 1 , 
                    password : Pw.value , 
                    id_plant : id_plant 
                } :
                {
                    report_text : noteText ? noteText.value : "" , 
                    statusCheck : statusCheck.value ,
                    password : Pw.value , 
                    id_plant : id_plant 
                }
        } else {
            BtConfirm.current.removeAttribute("pass")
            return false
        }
    }

    const CheckOffsetNumber = (e) => {
        const value = e.target.value[e.target.value.length - 1];
        StatusCheck.current.value = (value < 0) ? 0 : (value > 5) ? 5 : value;
    }

    const Confirm = async () => {
        const Data = await CheckData()
        console.log(Data)
        if(Data) {
            const url = typeInsert === "report" ? '/api/doctor/form/manage/report/insert' : typeInsert === "CheckPlant" ? '/api/doctor/form/manage/checkplant/insert' : '/api/doctor/form/manage/checkform/insert';
            const result = await clientMo.postForm(url , Data)
            
            console.log(result)
            if(result === "113" || result === "max") {
                FetchData()
                close()
            } else if (result === "password") {
                Password.current.value = ""
                Password.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
            } else if (result === "not") {
                console.log("not")
            } else if (result === "not image") {
                
            }
            else session()
        } 
    }

    return(
        <div className="insert-manage-doctor">
            <div className="head-content">
                {typeInsert === "report" ? "เพิ่มข้อแนะนำ" : typeInsert === "CheckPlant" ? "เพิ่มผลตรวจสอบผลผลิต" : "เพิ่มผลตรวจสอบแบบบันทึก" }
            </div>
            <div className="content-insert">
                { typeInsert === "report" ? 
                    <div className="report">
                        <div className="date">
                            <DayJSX DATE={new Date()} TYPE="small"/>
                        </div>
                        <div className="show-max-text">{QtyNote}/70</div>
                        <textarea onChange={()=>CheckData()} onInput={(e)=>setQtyNote(e.target.value.length)} ref={NoteText} maxLength={70} placeholder="กรอกข้อความ"></textarea>
                        <div className="content-img-report">
                            { getImgPreview ?
                                <div className="img-report-preview" onLoad={(e)=>{
                                    if(e.target.clientHeight > e.target.clientWidth) {
                                        e.target.setAttribute("h" , "")
                                        e.target.removeAttribute("w")
                                    } else {
                                        e.target.setAttribute("w" , "")
                                        e.target.removeAttribute("h")
                                    }
                                }}>
                                    <img src={getImgPreview}></img>
                                </div>
                                : <></>
                            }
                            <div className="bt-manage-img">
                                { getImgPreview ?
                                    <span className="delete" onClick={()=>{
                                        setImgPreview("")
                                        ImgReport.current.value = ""
                                    }}>ลบรูปภาพ</span> : <></>
                                }
                                <label>
                                    <input capture="user" ref={ImgReport} onChange={(e)=>{
                                        if(e.target.files[0].type.indexOf("image") >= 0) {
                                            setImgPreview(URL.createObjectURL(e.target.files[0]))
                                            CheckData()
                                            e.preventDefault()
                                        }
                                    }} hidden type="file"></input>
                                    <span className="add">เพิ่มรูปภาพ</span>
                                </label>
                            </div>
                        </div>
                        <input value={`ผู้บันทึก ${NameDoctor}`} readOnly className="name-doctor" type="text"></input>
                    </div> :
                    typeInsert === "CheckPlant" ? 
                    <div className="check">
                        <div className="date">
                            <DayJSX DATE={new Date()} TYPE="small"/>
                        </div>
                        <div className="result">
                            <div className="box-result">
                                <a ref={StateCheckBefore} not={!statusSuccess.check_success_before ? "" : null} onClick={!statusSuccess.check_success_before ? null : ()=>CheckData(1)}>ก่อน</a>
                                <a ref={StateCheckAfter} not={!statusSuccess.check_plant_after && !statusSuccess.check_success_after ? "" : null} onClick={!statusSuccess.check_plant_after && !statusSuccess.check_success_after ? null : ()=>CheckData(2)}>หลัง</a>
                            </div>
                            <div className="box-result">
                                <input placeholder="ผลตรวจสอบ 0-5" min={0} max={5} onInput={CheckOffsetNumber} onChange={()=>CheckData()} ref={StatusCheck} type="number"></input>
                            </div>
                        </div>
                        <input maxLength={10} className="note" ref={NoteText} onChange={()=>CheckData()} placeholder="หมายเหตุ"></input>
                        <input value={`ผู้บันทึก ${NameDoctor}`} readOnly className="name-doctor" type="text"></input>
                    </div> : 
                    <div className="form">
                        <div className="date">
                            <DayJSX DATE={new Date()} TYPE="small"/>
                        </div>
                        <div className="result">
                            <select onChange={()=>CheckData()} ref={StatusCheck} defaultValue={""}>
                                <option disabled value={""}>เลือกผลตรวจสอบ</option>
                                <option value={"0"}>ไม่ผ่าน</option>
                                <option value={"1"}>ผ่าน</option>
                            </select>
                        </div>
                        { StateShowNote ?
                            <>
                            <div className="show-max-text">{QtyNote}/70</div>
                            <textarea onInput={(e)=>setQtyNote(e.target.value.length)} onChange={()=>CheckData()} maxLength={70} ref={NoteText} placeholder="การแก้ไข"></textarea>
                            </>
                            : <></>
                        }
                        <input value={`ผู้บันทึก ${NameDoctor}`} readOnly className="name-doctor" type="text"></input>
                    </div>
                }
            </div>
            <div className="appove">
                <input onChange={()=>CheckData()} placeholder="รหัสผ่านเจ้าหน้าที่" ref={Password} type="password"></input>
                <div className="bt-insert">
                    <button onClick={close} className="cancel">ยกเลิก</button>
                    <button ref={BtConfirm} className="submit" onClick={Confirm}>ยืนยัน</button>
                </div>
            </div>
        </div>
    )
}

const EditReport = ({Ref , setPopup , session , FetchData , Data}) => {
    const NoteText = useRef()
    const [QtyNote , setQtyNote] = useState(Data.report_text.length)
    
    const Password = useRef()
    const BtConfirm = useRef()

    useEffect(()=>{
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
    } , [])

    const close = () => {
        Ref.current.style.opacity = "0"
        Ref.current.style.visibility = "hidden"

        setTimeout(()=>{
            setPopup(<></>)
        })
    }

    const CheckData = () => {
        const noteText = NoteText.current
        const Pw = Password.current

        if(noteText.value && noteText.value != Data.report_text && Pw.value) {
            BtConfirm.current.setAttribute("pass" , "")
            return(
                { 
                    id : Data.id,
                    id_plant : Data.id_plant,
                    report_text : noteText.value , 
                    password : Pw.value
                } 
            )
        } else {
            BtConfirm.current.removeAttribute("pass")
            return false
        }
    }

    const Confirm = async () => {
        const Data = CheckData()
        if(Data) {
            console.log(Data)
            const result = await clientMo.post("/api/doctor/form/manage/report/edit" , Data)

            console.log(result)
            if(result === "113") {
                FetchData()
                close()
            } else if (result === "password") {
                Password.current.value = ""
                Password.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
            } else if (result === "not") {
                console.log("not")
            } else session()
        } 
    }

    return(
        <div className="insert-manage-doctor">
            <div className="head-content">แก้ไขข้อแนะนำ</div>
            <div className="content-insert">
                <div className="report">
                    <div className="date">
                        <DayJSX DATE={new Date()} TYPE="small"/>
                    </div>
                    <div className="show-max-text">{QtyNote}/70</div>
                    <textarea defaultValue={Data.report_text} onChange={()=>CheckData()} onInput={(e)=>setQtyNote(e.target.value.length)} ref={NoteText} maxLength={70} placeholder="กรอกข้อความ"></textarea>
                    <input value={`ผู้บันทึก ${Data.name_doctor}`} readOnly className="name-doctor" type="text"></input>
                </div>
            </div>
            <div className="appove">
                <input onChange={()=>CheckData()} placeholder="รหัสผ่านเจ้าหน้าที่" ref={Password} type="password"></input>
                <div className="bt-insert">
                    <button onClick={close} className="cancel">ยกเลิก</button>
                    <button ref={BtConfirm} className="submit" onClick={Confirm}>ยืนยัน</button>
                </div>
            </div>
        </div>
    )
}

export default ManagePopup