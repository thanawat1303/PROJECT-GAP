import React, { useRef , useEffect, useState} from "react";
import "./assets/ListFertilizer.scss"

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
                                            <label className="frame-textbox">
                                                <span>ว/ด/ป ที่ใช้</span>
                                                <input readOnly defaultValue={ObjectData.date.split(" ")[0]} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">ชื่อสิ่งที่ใช้ (ชื่อการค้า, ตรา)</span>
                                                <div className="content-colume-input">
                                                    <div className="input-select-popup">
                                                        <input readOnly defaultValue={ObjectData.name} type="text"></input>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ชื่อสูตรปุ๋ย</span>
                                                <div className="input-select-other">
                                                    <input readOnly defaultValue={ObjectData.formula_name} type="text"></input>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">วิธีการใช้</span>
                                                <textarea readOnly defaultValue={ObjectData.use_is} className="content-colume-input" style={{textAlign : "start"}}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ปริมาณที่ใช้</span>
                                                <input readOnly defaultValue={ObjectData.volume} type="number"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>แหล่งที่ซื้อ</span>
                                                <input readOnly defaultValue={ObjectData.source} type="text"></input>
                                            </label>
                                        </div>
                                        </> :
                                        <>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ว/ด/ป ที่ใช้</span>
                                                <input readOnly defaultValue={ObjectData.date.split(" ")[0]} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
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
                                            <label className="frame-textbox">
                                                <span>ชื่อสามัญสารเคมี</span>
                                                <div className="input-select-other">
                                                    <input readOnly 
                                                        defaultValue={ObjectData.formula_name} type="text" ></input>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ศัตรูพืชที่พบ</span>
                                                <input readOnly 
                                                    defaultValue={ObjectData.insect} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox colume">
                                                <span className="full">วิธีการใช้</span>
                                                <textarea readOnly className="content-colume-input" style={{textAlign : "start"}}
                                                    defaultValue={ObjectData.use_is}></textarea>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>อัตราที่ผสม</span>
                                                <input readOnly 
                                                    defaultValue={ObjectData.rate} type="text"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>ปริมาณที่ใช้ทั้งหมด</span>
                                                <input readOnly 
                                                    defaultValue={ObjectData.volume} type="number"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
                                                <span>วันที่ปลอดภัย</span>
                                                <input readOnly 
                                                    defaultValue={ObjectData.date_safe.split(" ")[0]} type="date"></input>
                                            </label>
                                        </div>
                                        <div className="row">
                                            <label className="frame-textbox">
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
                    <button style={{backgroundColor : "#FF8484"}} onClick={cancel}>ปิด</button>
                </div>
            </div>
        </section>
    )
}

export default DetailFactor