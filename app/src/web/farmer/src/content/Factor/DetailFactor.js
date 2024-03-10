import React, { useRef , useEffect, useState} from "react";
import "./ListFertilizer.scss"
import { ConvertDate } from "../../../../../assets/js/module";

const DetailFactor = ({setPopup , RefPop , type_path , ReloadData , ObjectData}) => {
    useEffect(()=>{
        RefPop.current.setAttribute("show" , "");
    } , [])

    const cancel = () => {
        RefPop.current.removeAttribute("show")
        ReloadData()
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    return(
        <section className="popup-content-fertilizer">
            <div className="form">
                <div className="head-form">
                    {type_path === "z" ? <span>รายละเอียดปัจจัยการผลิต</span> : <span>รายละเอียดสารเคมี</span>}
                </div>
                <div className="body-content">
                    <div className="frame-content">
                        <div className="content">
                            <div className="step">
                                <div className="num">1.</div>
                                <div className="body">
                                    { type_path === "z" ?
                                        <>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.date == 2 ? " not" : ""}`}>
                                                <span>ว/ด/ป ที่ใช้</span>
                                                <input readOnly defaultValue={ConvertDate(ObjectData.date.split(" ")[0]).buddhistDate} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.name == 2 ? " not" : ""}`}>
                                                <span className="full">ชื่อสิ่งที่ใช้ (ชื่อการค้า, ตรา)</span>
                                                <div className="content-colume-input">
                                                    <div className="input-select-popup">
                                                        <input readOnly defaultValue={ObjectData.name} type="text"></input>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.formula_name == 2 ? " not" : ""}`}>
                                                <span>ชื่อสูตรปุ๋ย</span>
                                                <div className="input-select-other">
                                                    <input readOnly defaultValue={ObjectData.formula_name} type="text"></input>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.use_is == 2 ? " not" : ""}`}>
                                                <span className="full">วิธีการใช้</span>
                                                <textarea readOnly defaultValue={ObjectData.use_is} className="content-colume-input" style={{textAlign : "start"}}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.volume == 2 ? " not" : ""}`}>
                                                <span>ปริมาณที่ใช้</span>
                                                <input readOnly defaultValue={ObjectData.volume} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.source == 2 ? " not" : ""}`}>
                                                <span>แหล่งที่ซื้อ</span>
                                                <input readOnly defaultValue={ObjectData.source} type="text"></input>
                                            </label>
                                        </div>
                                        </> :
                                        <>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.date == 2 ? " not" : ""}`}>
                                                <span>ว/ด/ป ที่พ่นสาร</span>
                                                <input readOnly defaultValue={ConvertDate(ObjectData.date.split(" ")[0]).buddhistDate} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.name == 2 ? " not" : ""}`}>
                                                <span className="full">ชื่อสารเคมี (ชื่อการค้า, ตรา)</span>
                                                <div className="content-colume-input">
                                                    <div className="input-select-popup">
                                                        <input readOnly
                                                            defaultValue={ObjectData.name} type="text"></input>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.formula_name == 2 ? " not" : ""}`}>
                                                <span>ชื่อสามัญสารเคมี</span>
                                                <div className="input-select-other">
                                                    <input readOnly 
                                                        defaultValue={ObjectData.formula_name} type="text" ></input>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.insect == 2 ? " not" : ""}`}>
                                                <span>ศัตรูพืชที่พบ</span>
                                                <input readOnly 
                                                    defaultValue={ObjectData.insect} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox colume${ObjectData.subjectResult.use_is == 2 ? " not" : ""}`}>
                                                <span className="full">วิธีการใช้</span>
                                                <textarea readOnly className="content-colume-input" style={{textAlign : "start"}}
                                                    defaultValue={ObjectData.use_is}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.rate == 2 ? " not" : ""}`}>
                                                <span>อัตราที่ผสม</span>
                                                <div className="input-row">
                                                    <input readOnly 
                                                        defaultValue={ObjectData.rate} type="text"></input>
                                                    <div className="unit">/น้ำ20ล.</div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.volume == 2 ? " not" : ""}`}>
                                                <span>ปริมาณที่ใช้ทั้งหมด</span>
                                                <input readOnly defaultValue={ObjectData.volume} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.date_safe == 2 ? " not" : ""}`}>
                                                <span>วันที่ปลอดภัย</span>
                                                <input readOnly 
                                                    defaultValue={ConvertDate(ObjectData.date_safe.split(" ")[0]).buddhistDate} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className={`frame-textbox${ObjectData.subjectResult.source == 2 ? " not" : ""}`}>
                                                <span>แหล่งที่ซื้อ</span>
                                                <input readOnly 
                                                    defaultValue={ObjectData.source} type="text"></input>
                                            </label>
                                        </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bt-form">
                    <button style={{backgroundColor : "#FF8484"}} className="bt-confirm-factor" onClick={cancel}>ปิด</button>
                </div>
            </div>
        </section>
    )
}

export default DetailFactor