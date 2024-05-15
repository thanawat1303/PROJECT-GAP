import React, { useContext, useEffect, useRef, useState } from "react";
import { DayJSX, Loading, OpenImageMax, PopupDom } from "../../../../../assets/js/module";
import { clientMo } from "../../../../../assets/js/moduleClient";
import { DoctorProvider } from "../../main";
import Locals from "../../../../../locals";

const ListSuccess = ({data , index , DoctorSuccess}) => {
    const { lg } = useContext(DoctorProvider)
    return(
        <>
            <div className="row">
                <div className="field">
                    <span className="subject">{Locals[lg]["Harvest_ID"]}</span>
                    <div className="value">{data.id_success}</div>
                </div>
                <div className="field date">
                    <span>{Locals[lg]["date"]}</span>
                    <DayJSX DATE={data.date_of_doctor} TYPE="small"/>
                </div>
            </div>
            <BtDoctorShow DoctorDetailFunc={DoctorSuccess} data={data}/>
        </>
    )
}

const ListReport = ({data , index , EditReport , DoctorReport}) => {
    const { lg } = useContext(DoctorProvider)
    
    const RefOpenImage = useRef()

    const Menu = useRef()
    const SvgMenu = useRef()
    const PathMenu = useRef()
    const ListMenuNameRef = useRef()
    const ListMenuEditRef = useRef()

    const [getOpenImg , setOpenImg] = useState()
    const [getStateMenu , setStateMenu] = useState(false)

    const OpenImg = () => {
        setOpenImg(<OpenImageMax img={`/doctor/report/${data.image_path}`} Ref={RefOpenImage} setPopup={setOpenImg}/>)
    }

    useEffect(()=>{
        if(getStateMenu) window.addEventListener("click" , CloseMenu)
        // else window.removeEventListener("click" , CloseMenu)
        return(()=>{
            window.removeEventListener("click" , CloseMenu)
        })
    } , [getStateMenu])

    const CloseMenu = (e) => {
        if(Menu.current != e.target && SvgMenu.current != e.target && PathMenu.current != e.target) {
            window.removeEventListener("click" , CloseMenu)
            setStateMenu(false)
        }
    }

    return(
        <>
            <PopupDom Ref={RefOpenImage} Body={getOpenImg} zIndex={999} Background="#000000b3"/>
            <div className="row">
                <div className="field">
                    <span className="subject">{Locals[lg]["The_time"]}</span>
                    <div className="value">{index + 1}</div>
                </div>
                <div className="field date">
                    <span>{Locals[lg]["date"]}</span>
                    <DayJSX DATE={data.date_report} TYPE="small"/>
                </div>
            </div>
            <div className="row">
                <div className="field column">
                    <span className="subject">{Locals[lg]["recommendations"]}</span>
                    <div className="value">{data.report_text}</div>
                </div>
            </div>
            <div className="row end">
                { data.image_path ?
                    <div className="field menu-detail" onClick={OpenImg}>
                        <svg className="icon-menu" viewBox="0 0 16 16" >
                            <path id="rect4082" d="M1 1v14h14V1zm1 1h12v12H2z"/>
                            <path id="path847" d="M5 3a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2zm0 1a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1z" /><path id="path869" d="m3 12 1 1 3-3 1 1 2-2 2 2 1-1-3-3-2 2-1-1z" />
                        </svg>
                    </div> : <></>
                }
                <div className="field menu-detail">
                    <svg ref={SvgMenu} onClick={()=>setStateMenu(true)} className="icon-menu" viewBox="0 0 1024 1024">
                        <path ref={PathMenu} d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H608zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H608z"/>
                    </svg>
                    <div ref={Menu} show={getStateMenu ? "" : null} className="menu-popup">
                        <span ref={ListMenuNameRef} onClick={()=>DoctorReport(data)}>{Locals[lg]["recorder"]}</span>
                        {
                            data.check_doctor ?
                            <span ref={ListMenuEditRef} onClick={()=>EditReport(data , "report")}>{Locals[lg]["edit"]}</span> 
                            : <></>
                        }
                    </div>
                    {/* <button className="edit-report" onClick={()=>PopupEditReport(data , "report")}>แก้ไข</button> */}
                </div>
            </div>
        </>
    )
}

const ListCheckForm = ({data , index , DoctorCheck}) => {
    const { lg } = useContext(DoctorProvider)

    return(
        <>
            <div className="row">
                <div className="field">
                    <span className="subject">{Locals[lg]["inspection_results"]}</span>
                    <div className="value">{data.status_check ? Locals[lg]["pass"] : Locals[lg]["not_pass"]}</div>
                </div>
                <div className="field date">
                    <span>{Locals[lg]["date"]}</span>
                    <DayJSX DATE={data.date_check} TYPE="small"/>
                </div>
            </div>
            { data.status_check ? <></> :
                <div className="row">
                    <div className="field column">
                        <span className="subject">{Locals[lg]["editing"]}</span>
                        <div className="value">{data.note_text ? data.note_text : Locals[lg]["not_specified"]}</div>
                    </div>
                </div>
            }
            <BtDoctorShow DoctorDetailFunc={DoctorCheck} data={data}/>
        </>
    )
}

const ListCheckPlant = ({data , index , DoctorPlant}) => {
    const { lg } = useContext(DoctorProvider)

    return(
        <>
            <div className="row">
                <div className="field">
                    <span className="subject">{Locals[lg]["analysis_results"]}</span>
                    <div className="value">{!data.state_check ? Locals[lg]["before"] : Locals[lg]["after"]} : {data.status_check}</div>
                </div>
                <div className="field date">
                    <span>{Locals[lg]["date"]}</span>
                    <DayJSX DATE={data.date_check} TYPE="small"/>
                </div>
            </div>
            <div className="row">
                <div className="field column">
                    <span className="subject">{Locals[lg]["note"]}</span>
                    <div className="value">{data.note_text ? data.note_text : Locals[lg]["not_specified"]}</div>
                </div>
            </div>
            <BtDoctorShow DoctorDetailFunc={DoctorPlant} data={data}/>
        </>
    )
}

const BtDoctorShow = ({DoctorDetailFunc , data}) => {
    return(
        <div className="row end">
            <div className="field menu-detail">
                <svg className="icon-menu" onClick={()=>DoctorDetailFunc(data)} version="1.1" viewBox="0 0 512 512">
                    <g strokeWidth="0"/>
                    <g strokeLinecap="round" strokeLinejoin="round"/>
                    <g> 
                        <g> 
                            <path d="M453.047,429.766c-2.016-7.516-4.844-14.25-8.344-20.25c-6.109-10.516-14.234-18.703-23.188-25.188 c-6.703-4.891-13.891-8.844-21.172-12.266c-10.953-5.125-22.125-9.047-32.453-12.875c-10.313-3.781-19.766-7.516-27.094-11.844 c-2.672-1.594-5.094-3.25-7.172-4.969c-3.141-2.625-5.563-5.375-7.328-8.5c-1.766-3.094-2.938-6.594-3.406-10.969 c-0.313-3.125-0.453-6.047-0.453-8.844c0-8.25,1.219-15.438,2.766-22.719c4.625-5.219,8.844-11.422,12.828-18.844 c4.031-7.469,7.813-16.188,11.609-26.531c2.422-1.094,4.875-2.422,7.281-4.031c5.438-3.656,10.625-8.781,14.922-15.594 c4.328-6.813,7.797-15.281,10.141-25.719c0.656-2.906,0.984-5.781,0.984-8.625c0-5.922-1.406-11.563-3.75-16.625 c-1.625-3.5-3.719-6.719-6.125-9.625c1.234-4.563,2.734-10.688,4.063-17.875c1.844-9.969,3.375-21.922,3.375-34.5 c0-8.125-0.641-16.516-2.297-24.797c-1.234-6.203-3.047-12.359-5.625-18.266c-3.844-8.875-9.422-17.219-17.219-24.094 c-7.203-6.391-16.234-11.469-27.125-14.75c-4.609-5.5-9.375-10.188-14.297-14.094c-8.281-6.625-17-11.031-25.906-13.719 C279.188,0.969,270.172,0,261.203,0c-4.734,0-9.469,0.281-14.203,0.688c-4.438,0.406-8.141,0.875-11.438,1.422 c-4.922,0.828-8.984,1.922-12.922,3.297c-3.953,1.359-7.766,2.938-12.734,4.906c-1.891,0.734-4.375,1.844-7.375,3.344 c-5.234,2.641-11.953,6.531-19.156,11.906C172.563,33.625,160.656,45,151.344,60.406c-4.641,7.719-8.625,16.406-11.406,26.156 c-2.813,9.734-4.438,20.5-4.438,32.266c0,7.328,0.625,15.078,2,23.172c0,0.594,0.031,1.109,0.063,1.656 c0.063,1.016,0.156,2.063,0.266,3.156c0.172,1.625,0.359,3.281,0.516,4.688c0.063,0.703,0.125,1.328,0.156,1.813 c0.031,0.25,0.047,0.453,0.047,0.594l0.016,0.172v0.047v0.938l1.984,8.813c-2.859,3.125-5.328,6.625-7.25,10.453 c-2.672,5.328-4.266,11.328-4.25,17.703c-0.016,2.813,0.313,5.688,0.969,8.594l0,0c1.578,6.969,3.641,13.063,6.109,18.359 c3.719,7.953,8.422,14.156,13.641,18.797c4.031,3.625,8.344,6.25,12.609,8.219c3.797,10.297,7.594,19.016,11.594,26.469 c4,7.438,8.203,13.625,12.828,18.844c1.563,7.313,2.781,14.5,2.781,22.75c0,2.813-0.141,5.719-0.469,8.844 c-0.313,3-0.984,5.594-1.922,7.938c-1.422,3.5-3.5,6.469-6.328,9.281c-2.813,2.781-6.406,5.391-10.672,7.813 c-4.328,2.438-9.328,4.719-14.781,6.922c-9.531,3.859-20.406,7.516-31.438,11.922c-8.266,3.297-16.625,7.047-24.625,11.75 c-5.984,3.531-11.75,7.594-17.031,12.438c-7.938,7.281-14.781,16.328-19.5,27.531c-4.75,11.219-7.375,24.5-7.375,40.172 c0,2.203,0.469,4.328,1.219,6.266c0.719,1.828,1.688,3.5,2.844,5.094c2.188,2.969,5,5.609,8.453,8.172 c6.031,4.453,14.078,8.641,24.484,12.563c15.578,5.891,36.484,11.141,63.5,15C182.953,509.594,216.078,512,256,512 c34.625,0,64.109-1.797,88.953-4.781c18.625-2.234,34.641-5.125,48.234-8.453c10.188-2.484,19.016-5.203,26.609-8.078 c5.688-2.156,10.656-4.406,14.984-6.719c3.25-1.719,6.125-3.5,8.672-5.328c3.797-2.75,6.859-5.609,9.188-8.828 c1.156-1.594,2.109-3.313,2.813-5.188c0.703-1.844,1.109-3.875,1.109-5.953C456.563,447.938,455.344,438.344,453.047,429.766z M327.125,358.406l-50.063,78.156l-5.563-38.359l14.188-15.047l-9.203-15.313l38.828-20.422c1.078,1.375,2.219,2.703,3.422,3.938 C321.297,354,324.125,356.313,327.125,358.406z M188.703,264.563c-3.922-7.281-7.828-16.375-11.828-27.688l-1.313-3.688 l-3.688-1.375c-2.563-0.938-5.047-2.141-7.438-3.75c-3.594-2.422-7.031-5.719-10.156-10.656 c-3.125-4.922-5.953-11.531-7.969-20.469l0,0c-0.375-1.688-0.563-3.313-0.563-4.906c0.016-3.578,0.875-6.969,2.5-10.234 c1.344-2.688,3.234-5.234,5.5-7.547c3.844,5.813,7.016,10.406,8.172,11.563c3.766,3.75,4.297-5.109,2.516-15.063 c-3.313-18.281,5.578-10.016,28.156-53.906c45.125,10.031,124-37.938,124-37.938s0.953,21.875,16,41.938 C346.875,139.891,355,184.563,355,184.563s1.938-3.688,4.828-8.625c1.734,2.031,3.172,4.219,4.234,6.5 c1.422,3.047,2.188,6.25,2.188,9.563c0,1.594-0.188,3.25-0.563,4.938c-1.344,5.953-3.047,10.875-4.953,14.969 c-2.859,6.094-6.172,10.313-9.609,13.406c-3.469,3.094-7.141,5.094-10.969,6.5l-3.688,1.344l-1.313,3.719 c-4.016,11.313-7.922,20.406-11.844,27.703s-7.828,12.766-11.875,17.047l-1.594,1.688l-0.5,2.281 c-1.828,8.344-3.625,17.563-3.625,28.469c0,3.375,0.172,6.875,0.547,10.563c0.453,4.344,1.438,8.406,2.922,12.156 c0.078,0.188,0.156,0.344,0.234,0.531L258.625,364l-56.281-26.094c1.734-4.063,2.906-8.5,3.391-13.281l0,0 c0.391-3.688,0.547-7.188,0.547-10.563c0.016-10.906-1.797-20.156-3.625-28.5l-0.484-2.25l-1.609-1.688 C196.531,277.328,192.609,271.859,188.703,264.563z M188.25,355.906c2.922-2.344,5.641-4.984,8.016-7.938l42.922,19.922 l-9.172,15.266l14.203,15.047l-5.25,36.125l-54.766-75.453C185.594,357.922,186.938,356.938,188.25,355.906z M439.422,459.531 c-0.563,0.938-1.875,2.5-4.078,4.281c-1.938,1.563-4.516,3.281-7.781,5.063c-5.703,3.125-13.453,6.391-23.281,9.469 c-14.766,4.656-34.234,8.906-58.813,11.969c-24.563,3.063-54.234,4.969-89.469,4.969c-34.031,0-62.875-1.781-86.953-4.656 c-18.063-2.172-33.422-4.969-46.266-8.094c-9.625-2.344-17.813-4.906-24.641-7.484c-5.125-1.953-9.469-3.922-13.047-5.813 c-2.688-1.438-4.938-2.859-6.781-4.172c-2.734-1.969-4.5-3.75-5.359-4.984c-0.438-0.609-0.656-1.047-0.75-1.297 c-0.031-0.094-0.047-0.156-0.047-0.172c0-9.359,1.063-17.359,2.891-24.328c1.609-6.094,3.828-11.375,6.516-16.047 c4.719-8.172,10.906-14.609,18.25-20.016c5.516-4.063,11.656-7.547,18.188-10.656c9.781-4.656,20.375-8.438,30.781-12.266 c8.75-3.234,17.359-6.484,25.281-10.484L260.563,484l76.625-119.594c3.828,1.969,7.813,3.781,11.906,5.469 c10.281,4.219,21.234,7.859,31.797,12.063c7.922,3.125,15.641,6.547,22.641,10.625c5.266,3.063,10.141,6.469,14.469,10.391 c6.531,5.891,11.844,12.859,15.688,21.797c3.813,8.938,6.156,19.906,6.156,33.875C439.828,458.688,439.719,459.031,439.422,459.531 z"/> 
                            <rect x="318.625" y="449.188" className="st0" width="66.875" height="11.719"/> 
                        </g> 
                    </g>
                </svg>
            </div>
        </div>
    )
}

const DoctorDetail = ({Ref , setPopup , session , Data}) => {

    const { lg } = useContext(DoctorProvider)

    const [getLoad , setLoad] = useState(true)

    useEffect(()=>{
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
        // console.log(Data)
        Check()
    } , [])

    const Check = async () => {
        const context = await clientMo.get('/api/doctor/name')
        if(context) setLoad(false)
        else session()
    }

    const close = () => {
        Ref.current.style.opacity = "0"
        Ref.current.style.visibility = "hidden"

        setTimeout(()=>{
            setPopup(<></>)
        })
    }

    return(
        !getLoad ?
            <section className="doctor-detail">
                <div className="head-detail">{Locals[lg]["details"]}</div>
                <div className="doctor-detail-body">
                    <div className="box-detail">
                        <div className="subject-detail">
                            {Locals[lg]["doctor_name"]}
                        </div>
                        <div className="value-detail">
                            {Data.name_doctor}
                        </div>
                    </div>
                    <div className="box-detail">
                        <div className="subject-detail">
                            {Locals[lg]["id"]}
                        </div>
                        <div className="value-detail">
                            {Data.id_doctor}
                        </div>
                    </div>
                </div>
                <div onClick={close} className="close">
                    {Locals[lg]["disable"]}
                </div>
            </section>
        : 
            <div style={{
                backgroundColor : "white",
                padding : "5px",
                borderRadius : "50%"
            }}>
                <Loading size={"50vw"} MaxSize={50} border={8} color="#22C7A9" animetion={true}/>
            </div>
    )
}

export {ListSuccess , ListReport , ListCheckForm , ListCheckPlant , DoctorDetail}