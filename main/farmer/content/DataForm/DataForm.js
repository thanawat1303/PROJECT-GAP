import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";

import "./assets/DataForm.scss"
import { DAYUTC } from "../../../../src/assets/js/module";
import MenuPlant from "../PlantList/MenuPlant";
import { validate } from "uuid";
const DataForm = ({ setBody , id_house , id_plant , liff , setPage , isClick = 0}) => {
    const [Data , setData] = useState([])
    const [Load , setLoad] = useState(false)
    const [StatusEdit , setStatusEdit] = useState(false)

    const ManageMenu = useRef()
    const BtManageMenu = {
        Frame : useRef(),
        Svg : useRef(),
        Path : useRef()
    }
    const DataContent = useRef()

    useEffect(()=>{
        setPage("DataForm")
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/d/${id_plant}`)
        window.addEventListener("touchstart" , CloseManageMenu)
        FetchData()

        return () => {
            window.removeEventListener("touchstart" , CloseManageMenu)
        }
    } , [])

    const FetchData = async () => {
        const result = await clientMo.post("/api/farmer/formplant/select" , {id_formplant : id_plant , id_farmhouse : id_house})
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            setData(Data[0])
            setLoad(true)
        }
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    }

    const ReturnPage = async () =>{
        const result = await clientMo.post("/api/farmer/account/check")
        if(await CloseAccount(result , setPage)) {
            setBody(<MenuPlant setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} isClick={1} liff={liff} />)
        }
    }

    const ShowMenuManageForm = () => {
        ManageMenu.current.toggleAttribute("show")
    }

    const CloseManageMenu = (e) => {
        if(e.target !== BtManageMenu.Frame.current 
            && e.target !== BtManageMenu.Svg.current 
            && e.target !== BtManageMenu.Path.current) ManageMenu.current.removeAttribute("show")
    }

    const EditForm = () => {
        setStatusEdit(true)
        DataContent.current.setAttribute("edit" , "")
        document.querySelectorAll("#data-form-page *[readonly='']").forEach((val)=>{
            if(val.getAttribute("date_dom") !== "") {
                val.removeAttribute("readonly")
            }
        })
    }

    const CancelEdit = () => {
        setLoad(false)
        setStatusEdit(false)
        DataContent.current.removeAttribute("edit")
        setTimeout(()=>{
            setLoad(true)
        } , 100)
    }

    return (
        <section className="data-form-page" id="data-form-page">
            <div className="head">
                <div className="return" onClick={ReturnPage}>
                    <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                        <g fill-rule="evenodd">
                            <path d="M1052 92.168 959.701 0-.234 959.935 959.701 1920l92.299-92.43-867.636-867.635L1052 92.168Z"/>
                            <path d="M1920 92.168 1827.7 0 867.766 959.935 1827.7 1920l92.3-92.43-867.64-867.635L1920 92.168Z"/>
                        </g>
                    </svg>
                </div>
                <span>ข้อมูลแบบบันทึก</span>
                <div className="manage-form" ref={BtManageMenu.Frame} onClick={ShowMenuManageForm}>
                    <svg ref={BtManageMenu.Svg} fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path ref={BtManageMenu.Path} d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM8 24h16v-4h-16v4zM8 18.016h16v-4h-16v4zM8 12h16v-4h-16v4z"></path>
                    </svg>
                </div>
                <div className="manage-menu" ref={ManageMenu}>
                    <div onClick={EditForm}>แก้ไขข้อมูล</div>
                    <div>ประวัติแก้ไข</div>
                </div>
            </div>
            <div className="form">
                <div className="data-content" ref={DataContent}>
                    <div className="frame-content">
                        { Load ? 
                            <div className="content">
                                <div className="step">
                                    <div className="num">1.</div>
                                    <div className="body">
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ชนิดพืช</span>
                                                <div className="input-select-popup">
                                                    <input type="text" readOnly defaultValue={Data.name_plant}></input>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>รุ่นที่ปลูก</span>
                                                <input type="number" readOnly defaultValue={Data.generation}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">วันที่เพาะกล้า</span>
                                                <div className="full">
                                                    <DAYUTC DATE={Data.date_glow} TYPE="normal"/>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">วันที่ปลูก</span>
                                                <div className="full">
                                                    <DAYUTC DATE={Data.date_plant} TYPE="normal"/>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <div className="full">ระยะการปลูก</div>
                                                <div className="choose">
                                                    <label className="choose">
                                                        กว้าง
                                                        <input readOnly type="text" defaultValue={Data.posi_w} ></input>
                                                    </label>
                                                    <label className="choose">
                                                        ยาว
                                                        <input readOnly type="text" defaultValue={Data.posi_h}></input>
                                                    </label>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>จำนวนต้น</span>
                                                <input readOnly type="text" defaultValue={Data.qty}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>พื้นที่</span>
                                                <input readOnly type="text" defaultValue={Data.area}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">วันที่คาดว่าจะเก็บเกี่ยว</span>
                                                <div className="full">
                                                <div className="full">
                                                    <DAYUTC DATE={Data.date_glow} TYPE="normal"/>
                                                </div>
                                                </div>
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
                                                <input readOnly type="text" defaultValue={Data.system_glow}></input>
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
                                                <input readOnly type="text" defaultValue={Data.water}></input>
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
                                                <input readOnly type="text" defaultValue={Data.water_flow}></input>
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
                                                <textarea readOnly defaultValue={Data.history}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>โรคและแมลงที่พบ</span>
                                                <input readOnly type="text" defaultValue={Data.insect}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ปริมาณการเกิดโรค และแมลงที่พบ</span>
                                                <input readOnly type="text" defaultValue={Data.qtyInsect}></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>การป้องกันกำจัด</span>
                                                <textarea readOnly defaultValue={Data.seft}></textarea>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div> : <></>
                        }
                    </div>
                </div>
                {
                    StatusEdit ? 
                    <div className="bt">
                        <button style={{backgroundColor : "red"}} onClick={CancelEdit}>ยกเลิก</button>
                        <button style={{backgroundColor : "green"}}>ยืนยัน</button>
                    </div>
                    : <></>
                }
            </div>
        </section>
    )
}

export default DataForm