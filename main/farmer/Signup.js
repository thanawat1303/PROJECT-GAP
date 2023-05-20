import React , { useEffect , useRef, useState } from "react";
import { Camera, MapsJSX } from "../../src/assets/js/module";

import './assets/Signup.scss'
import { clientMo } from "../../src/assets/js/moduleClient";

const SignUp = (props) => {
    const Image = useRef()
    const ControlImage = useRef()

    const Fullname = useRef()
    const Password = useRef()
    const Location = useRef()
    const Station = useRef()

    const LoadingMap = useRef()
    const Map = useRef()

    const [LocationCurrent , setCurrent] = useState(<></>)

    useEffect(()=>{
        PullMap()
    } , [])

    const PullMap = () => {
        LoadingMap.current.removeAttribute('hide','')
        Map.current.removeAttribute('show','')
        setCurrent(<></>)
        setTimeout(()=>{
            navigator.geolocation.getCurrentPosition((location)=>{
                LoadingMap.current.setAttribute('hide','')
                Map.current.setAttribute('show','')
                setCurrent(<MapsJSX lat={location.coords.latitude} lng={location.coords.longitude}/>)
            } , null , {
                enableHighAccuracy: true
            })
        } , 1000)
    }

    const reloadMap = () => {
        PullMap()
    }

    return (
        <section id="content-signup-farmer">
            <Camera control={ControlImage} img={Image}/>
            <div className="title">
                <p className="title-form">ทะเบียนเกษตรกร</p>
                <p className="subtitle">สมัครบัญชี</p>
            </div>
            <div className="form-sigup">
                <div id="preview-image">
                    <img src="/icons8-camera.svg" width="60%"></img>
                    <input ref={Image} type="file"></input>
                    <span ref={ControlImage}>อัปโหลดรูปภาพ</span>
                </div>
                <div className="detail-profile">
                    <label className="fullname">
                        ชื่อ-นามสกุล
                        <input ref={Fullname}></input> 
                    </label>
                    <label className="password">
                        รหัสผ่าน
                        <input ref={Password}></input> 
                    </label>
                    <label className="location">
                        ตำแหน่งแปลงที่ทำการเกษตร
                        <div className="warnning">* เพื่อการดึงข้อมูลที่ถูกต้อง โปรดอยู่ในตำแหน่งที่ทำการเกษตรกรของท่าน</div>
                        <div className="map-genarate">
                            <div ref={Map} className="map">
                                {LocationCurrent}
                            </div>
                            <div ref={LoadingMap} className="loading-map">
                                LOADIND
                            </div>
                        </div>
                        <div onClick={reloadMap}>โหลดแผนที่ใหม่</div>
                    </label>
                    <label className="station">
                        ศูนย์ที่เกษตรกรอยู่ในการดูแล
                        <input ref={Station}></input> 
                    </label>
                </div>
                {/* <video id="camera-preview"></video> */}
            </div>
        </section>
    )
}

export {SignUp}