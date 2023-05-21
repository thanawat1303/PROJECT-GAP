import React , { useEffect , useRef, useState } from "react";
import { Camera, MapsJSX } from "../../src/assets/js/module";

import './assets/Signup.scss'
import { clientMo } from "../../src/assets/js/moduleClient";

const SignUp = (props) => {
    const ImageCerrent = useRef()
    const [PreviewImage , setPreview] = useState("/icons8-camera.svg")
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

    // const InputImage = (e) => {
    //     const file = e.target.files[0]

    //     if(file) {
    //         const reader = new FileReader()
    //         reader.onload = (e) => {
    //             if(new Date().getTime() - file.lastModified < 1000) {
    //                 setPreview(e.target.result)
    //             } 
    //             else {
    //                 alert('โปรดใช้รูปถ่ายปัจจุบัน')
    //                 setPreview("/icons8-camera.svg")
    //             }
    //         }
    //         reader.readAsDataURL(file)
    //     } else {
    //         setPreview("/icons8-camera.svg")
    //     }
    // }

    return (
        <section id="content-signup-farmer">
            <Camera control={ControlImage} img={Image}/>
            <div className="title">
                <p className="title-form">ทะเบียนเกษตรกร</p>
                <p className="subtitle">สมัครบัญชี</p>
            </div>
            <div className="form-sigup">
                <div id="preview-image">
                    <img ref={ImageCerrent} src={PreviewImage} width="60%" onClick={()=>ControlImage.current.click()}></img>
                    {/* <input ref={ControlImage} hidden type="file"  accept="image/*" capture="user" onInput={InputImage} ></input> */}
                    <span ref={ControlImage}></span>
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