import React , { useEffect , useRef, useState } from "react";
import { Camera, MapsJSX } from "../../src/assets/js/module";

import './assets/Signup.scss'
import { clientMo } from "../../src/assets/js/moduleClient";

const SignUp = (props) => {
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
    const [step , setStep] = useState(1)
    const [stepOn , setstepOn] = useState(1)
    const [stepApprov , setApprov] = useState(1)

    const [ProfileData , setProfile] = useState(new Map([]))
    const DataProfile = new Map()

    const back = useRef()
    const next = useRef()
    const confirm = useRef()

    useEffect(()=>{
        selectStep(1)
    } , [])

    const changeStep = (type) => {
        let statusSelect = document.querySelector('.status-step span[select=""]')
        let stepInMedthod = 0
        if(type && (stepOn + 1) == stepApprov && statusSelect.nextSibling) {
            statusSelect.removeAttribute('select')
            statusSelect.nextSibling.setAttribute('select' , "")
            setstepOn(stepOn + 1)
            stepInMedthod = stepOn + 1
        } else if (!type && statusSelect.previousSibling){
            statusSelect.removeAttribute('select')
            statusSelect.previousSibling.setAttribute('select' , "")
            setstepOn(stepOn - 1)
            stepInMedthod = stepOn - 1
        }

        statusSelect = document.querySelector('.status-step span[select=""]')
        if(statusSelect.previousSibling) {
            back.current.removeAttribute('hide')
        } else {
            back.current.setAttribute('hide' , "")
        }

        if(statusSelect.nextSibling) {
            next.current.removeAttribute('hide')
            confirm.current.removeAttribute('show')
        } else {
            next.current.setAttribute('hide' , "")
            confirm.current.setAttribute('show' , "")
        }

        selectStep(stepInMedthod)
    }

    const selectStep = (stepInMedthod) => {
        console.log(ProfileData)
        switch(stepInMedthod) {
            case 1 :
                setStep(<StepOne stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile}/>)
                break;
            case 2 :
                setStep(<StepTwo stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile}/>)
                break;
            case 3 :
                setStep(<StepThree stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile}/>)
                break;
        }
    }

    return (
        <section id="content-signup-farmer">
            <div className="title">
                <p className="title-form">ทะเบียนเกษตรกร</p>
                <p className="subtitle">สมัครบัญชี</p>
            </div>
            <div className="form-sigup">
                <div className="detail-profile">
                    {step}
                </div>
            </div>
            <div className="button-step">
                <img ref={back} hide="" onClick={()=>changeStep(false)} className="back" src="/caret-back-circle-svgrepo-com.svg"></img>
                <div className="status-step">
                    <span select=""></span>
                    <span></span>
                    <span></span>
                </div>
                <div>
                    <img ref={confirm} className="confirm" src="/confirm-sf-svgrepo-com.svg"></img>
                    <img ref={next} onClick={()=>changeStep(true)} src="/caret-forward-circle-sharp-svgrepo-com.svg" className="next"></img>
                </div>
            </div>
        </section>
    )
}

const StepOne = (props) => {
    const Firstname = useRef()
    const Lastname = useRef()
    const Password = useRef()
    const OldID = useRef()

    useEffect(()=>{
        props.stepAp(1)
        checkData()
    } , [])

    const checkData = (e) =>{
        if(e) {
            props.data.set(e.target.getAttribute("data") , e.target.value)
            props.update(new Map([
                ...props.profile , 
                ...props.data
            ]))
        } 
        else {
            props.data.set("firstname" , Firstname.current.value)
            props.data.set("lastname" , Lastname.current.value)
            props.data.set("password" , Password.current.value)
            props.data.set("oldID" , OldID.current.value)
        }

        if(
            props.data.get("firstname") &&
            props.data.get("lastname") &&
            props.data.get("password") &&
            props.data.get("oldID")
            )
        {
            props.stepAp(2)
        } else {
            props.stepAp(1)
        }
    } 

    return (
        <section className="step-one">
            <div className="head-step">
                ข้อมูลส่วนตัว
            </div>
            <div className="detail-farmer">
                <label className="fullname">
                    <span>ชื่อ</span>
                    <input defaultValue={props.profile.get("firstname")} onChange={checkData} type="text" ref={Firstname} data="firstname"></input> 
                </label>
                <label className="fullname">
                    <span>นามสกุล</span>
                    <input defaultValue={props.profile.get("lastname")} onChange={checkData} type="text" ref={Lastname} data="lastname"></input> 
                </label>
                <label className="password">
                    <span>รหัสผ่าน</span>
                    <input defaultValue={props.profile.get("password")} onChange={checkData} type="password" ref={Password} data="password"></input> 
                </label>
                <label className="select-remember">
                    <span>รหัสประจำตัว * หากมีหรือจำได้</span>
                    <input defaultValue={props.profile.get("oldID")} onChange={checkData} type="text" ref={OldID} data="oldID"></input>
                </label>
            </div>
        </section>
    )
}

const StepTwo = (props) => {
    const Station = useRef()
    let timeOutLoad = null

    const LoadingMap = useRef()
    const MapEle = useRef()
    const HeadList = useRef()

    const [LocationCurrent , setCurrent] = useState(<></>)
    const [ListStation , setStation] = useState(<></>)
    const [Listready , setReady] = useState(false)
    const [Selected , setSelected] = useState(props.profile.get("station"))

    useEffect(()=>{
        props.stepAp(2)
        PullMap()

        clientMo.post("/api/farmer/listStation").then((list)=>{
            setStation(JSON.parse(list))
            setReady(true)
            if(props.profile.get("station") == undefined) HeadList.current.setAttribute("selected" , "")
        })

        return () => {
            clearTimeout(timeOutLoad)
        }
    } , [])

    const PullMap = () => {
        LoadingMap.current.removeAttribute('hide','')
        MapEle.current.removeAttribute('show','')
        setCurrent(<></>)
        timeOutLoad = setTimeout(
            ()=>{
                navigator.geolocation.getCurrentPosition((location)=>{
                    LoadingMap.current.setAttribute('hide','')
                    MapEle.current.setAttribute('show','')
                    props.data.set("latitude" , location.coords.latitude)
                    props.data.set("longitude" , location.coords.longitude)
                    CheckData()
                    setCurrent(<MapsJSX w={"100%"} lat={location.coords.latitude} lng={location.coords.longitude}/>)
                } , null , {
                    enableHighAccuracy: true
                })
            } , 1000)
    }

    const reloadMap = () => {
        PullMap()
    }

    const CheckData = (e) => {
        if(e) {
            setSelected(e.target.value)
        }

        props.data.set("station" , Station.current.value)
        props.update(new Map([
            ...props.profile , 
            ...props.data
        ]))

        console.log(props.data)

        if(props.data.get("station") 
            && props.data.get("latitude") 
            && props.data.get("longitude")) 
        {
            props.stepAp(3)
        } else {
            props.stepAp(2)
        }
    }

    return (
        <section className="step-two">
            <div className="detail-farmer">
                <label className="location">
                    ตำแหน่งแปลงที่ทำการเกษตร
                    <div className="warnning">* เพื่อการดึงข้อมูลที่ถูกต้อง โปรดอยู่ในตำแหน่งที่ทำการเกษตรกรของท่าน</div>
                    <div className="map-genarate">
                        <div ref={MapEle} className="map">
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
                    <select value={Selected} ref={Station} onChange={CheckData}>
                        <option ref={HeadList} value="" disabled>
                            {(Listready) ? "เลือกศูนย์" : "กำลังโหลด"}
                        </option>
                        {
                        (Listready) ? 
                            ListStation.map((val , index)=>
                                <option key={index} value={val['id_station']}>{val['name_station']}</option>
                            )
                            : <></>
                        }
                    </select> 
                </label>
            </div>
        </section>
    )
}

const StepThree = () => {
    const ImageCerrent = useRef()
    const [PreviewImage , setPreview] = useState("/icons8-camera.svg")
    const ControlImage = useRef()

    return (
        // <div id="preview-image">
        //     <Camera control={ControlImage} img={Image}/>
        //     <img ref={ImageCerrent} src={PreviewImage} width="60%" onClick={()=>ControlImage.current.click()}></img>
        //     {/* <input ref={ControlImage} hidden type="file"  accept="image/*" capture="user" onInput={InputImage} ></input> */}
        //     <span ref={ControlImage}></span>
        // </div>
        <></>
    )
}

export {SignUp}