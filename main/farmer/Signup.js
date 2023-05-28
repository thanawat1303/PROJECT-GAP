import React , { useEffect , useRef, useState } from "react";
import { Camera, MapsJSX, ResizeImg } from "../../src/assets/js/module";

import './assets/Signup.scss'
import {clientMo}  from "../../src/assets/js/moduleClient";
import { PopupAlert } from "./PopupAlert";

const SignUp = ({liff}) => {
    const [step , setStep] = useState(1)
    const [stepOn , setstepOn] = useState(1)
    const [stepApprov , setApprov] = useState(1)
    const [PreviewData , setPreviewData] = useState(<></>)

    const [ProfileData , setProfile] = useState(new Map([]))
    const DataProfile = new Map()

    const back = useRef()
    const next = useRef()
    const confirm = useRef()
    const DetailProfile = useRef()

    useEffect(()=>{
        selectStep(stepApprov)
        document.title = "ลงทะเบียนเกษตรกร"
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
        switch(stepInMedthod) {
            case 1 :
                setStep(<StepOne stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile}/>)
                break;
            case 2 :
                setStep(<StepTwo stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile}/>)
                break;
            case 3 :
                setStep(<StepThree liff={liff} previewData={setPreviewData} detailBody={DetailProfile} confirm={confirm} stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile}/>)
                break;
        }
    }

    return (
        <section id="content-signup-farmer">
            {PreviewData}
            <div className="title">
                <div className="title-form">ทะเบียนเกษตรกร</div>
                <div className="subtitle">สมัครบัญชี</div>
            </div>
            <div className="form-sigup">
                <div className="detail-profile" ref={DetailProfile}>
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
            props.data.get("password")
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
                    <span>
                        <span>ชื่อ</span><span className="dot">*</span>
                    </span>
                    <input autoComplete="false" defaultValue={props.profile.get("firstname")} onChange={checkData} type="text" ref={Firstname} data="firstname"></input> 
                </label>
                <label className="fullname">
                    <span>
                        <span>นามสกุล</span><span className="dot">*</span>
                    </span>
                    <input autoComplete="false" defaultValue={props.profile.get("lastname")} onChange={checkData} type="text" ref={Lastname} data="lastname"></input> 
                </label>
                <label className="password">
                    <span>
                        <span>รหัสผ่าน</span><span className="dot">*</span>
                    </span>
                    <input autoComplete="false" defaultValue={props.profile.get("password")} onChange={checkData} type="password" ref={Password} data="password"></input> 
                </label>
                <label className="select-remember">
                    <span>
                        <span>รหัสประจำตัว</span><span className="dot">* หากมีหรือจำได้</span>
                    </span>
                    <input autoComplete="false" defaultValue={props.profile.get("oldID")} onChange={checkData} type="text" ref={OldID} data="oldID"></input>
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
            // if(props.profile.get("station") == undefined) HeadList.current.setAttribute("selected" , "")
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
                    <div className="head-map">ตำแหน่งแปลงที่ทำการเกษตร</div>
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
                    {(Listready) ?
                        <select value={Selected ?? ""} ref={Station} onChange={CheckData}>
                            <option value="" disabled>
                                เลือกศูนย์
                            </option>
                            {
                            (Listready) ? 
                                ListStation.map((val , index)=>
                                    <option key={index} value={val['id_station']}>{val['name_station']}</option>
                                )
                                : <></>
                            }
                        </select> 
                        : "กำลังโหลด"}
                </label>
            </div>
        </section>
    )
}

const StepThree = (props) => {
    const ImageCurrent = useRef()
    const [PreviewImage , setPreview] = useState(props.profile.get('dataImgState') ?? "/icons8-camera.svg")
    const ControlImage = useRef()
    const Frame = useRef()
    const Loading = useRef()
    const CropImg = useRef()

    const [PositionMouse,setPosition] = useState(0)
    const [PoX,setX] = useState(0)
    const [PoY,setY] = useState(0)
    const [xM,setXM] = useState(0)
    const [yM,setYM] = useState(0)
    const [CurrentP,setCurrentP] = useState({
        x : props.profile.get('xImgState') ?? 0,
        y : props.profile.get('yImgState') ?? 0
    })

    const [LoadingImg , setLoading] = useState(false) 

    const [sizeWidthImg , setWidthImg] = useState(0)
    const [sizeHeightImg , setHeightImg] = useState(0)

    const frameLate = 1
    let TimeOut = new Set()

    useEffect(()=>{
        Frame.current.style.width = `${props.detailBody.current.clientWidth * 0.8}px`
        Frame.current.style.height = `${props.detailBody.current.clientWidth * 0.8}px`
        Loading.current.style.width = `${props.detailBody.current.clientWidth * 0.8}px`
        Loading.current.style.height = `${props.detailBody.current.clientWidth * 0.8}px`

        props.stepAp(3)
        console.log(props.detailBody.current.clientWidth)
        ImageCurrent.current.style.transform = `translate(${CurrentP.x}px , ${CurrentP.y}px)`
        props.confirm.current.addEventListener("click" , confirmData)
        props.previewData(<></>)
        return () => {
            props.confirm.current.removeEventListener("click" , confirmData)
        }
    } , [])

    const InputImage = (e) => {
        const file = e.target.files[0]
        setLoading(false)
        props.data.delete("dataImgState")
        props.data.delete("xImgState")
        props.data.delete("yImgState")
        if(file) {
            // const reader = new FileReader()
            // reader.onload = (e) => {
            //     if(new Date().getTime() - file.lastModified < 1000) {
            //         setPreview(e.target.result)
            //         props.data.set("dataImgState" , e.target.result)
            //         props.data.set("xImgState" , 0)
            //         props.data.set("yImgState" , 0)
            //         updateData()
            //     } 
            //     else {
            //         setLoading(true)
            //         alert('โปรดใช้รูปถ่ายปัจจุบัน')
            //         setPreview("/icons8-camera.svg")
            //     }
            // }
            // reader.readAsDataURL(file)
            if(new Date().getTime() - file.lastModified < 1000
                ) {
                ResizeImg(file , 300).then((imageResult)=>{
                    setPreview(imageResult)
                    props.data.set("dataImgState" , imageResult)
                    props.data.set("xImgState" , 0)
                    props.data.set("yImgState" , 0)
                    updateData()
                })
            } 
            else {
                setLoading(true)
                alert('โปรดใช้รูปถ่ายปัจจุบัน')
                setPreview("/icons8-camera.svg")
            }
        } else {
            setPreview("/icons8-camera.svg")
        }
        ImageCurrent.current.removeAttribute("style")
        ImageCurrent.current.removeAttribute("size")
        setCurrentP({
            x : 0,
            y : 0
        })
    }

    const movePicture = (e = document.getElementById("")) => {
        if(ImageCurrent.current.getAttribute("src") != "/icons8-camera.svg") {
            const P = PositionMouse

            let x = xM + ((e.touches[0].clientX - P.x) / frameLate) // ค่าที่เลื่อนรูปบนแกน x
            let y = yM + ((e.touches[0].clientY - P.y) / frameLate) // ค่าที่เลื่อนรูปบนแกน y

            setX(x) // set ค่า เพื่อนำไปตรวจสอบว่ามีการเลื่อนรูปเกินขอบหรือไม่ ตอนที่ปล่อยรูป
            setY(y) // set ค่า เพื่อนำไปตรวจสอบว่ามีการเลื่อนรูปเกินขอบหรือไม่ ตอนที่ปล่อยรูป

            ImageCurrent.current.style.transform = `translate(${x}px , ${y}px)` // action ตอนเลื่อน
        }

    }

    const setStartMove = (e) => {
        if(ImageCurrent.current.getAttribute("src") != "/icons8-camera.svg") {
            let frame = Frame.current

            let oldX = e.target.offsetLeft // ระยะขอบซ้ายรูปกับระยะขอบซ้ายหน้าจอ เพื่อหาตำแหน่งของรูปบนหน้าจอ
            let oldY = e.target.offsetTop // ระยะขอบบนรูปกับระยะขอบบนหน้าจอ เพื่อหาตำแหน่งของรูปบนหน้าจอ
            
        // หาระยะห่างรูปกับกรอบ เพื่อให้ได้ค่า มากสุดที่รูปสามารถเลื่อนไปได้
            let OffsetLeft = frame.offsetLeft - oldX // ค่าหลัก ผลต่าง ขอบซ้าย
            let OffsetTop = frame.offsetTop - oldY // ค่าหลัก ผลต่าง ขอบบน

            let OffsetRight = -1 * OffsetLeft // ค่าลอง ขอบขวา
            let OffsetBottom = -1 * OffsetTop // ค่าลอง ขอบล่าง

            setXM(parseFloat(CurrentP.x)) //set ค่าตำแหน่งรูปปัจจุบัน
            setYM(parseFloat(CurrentP.y)) //set ค่าตำแหน่งรูปปัจจุบัน

            ImageCurrent.current.style.transition = `0s` // เอา action เวลาเลื่อนออก
            setPosition({
                x : e.touches[0].clientX,
                y : e.touches[0].clientY,
                xp : OffsetLeft,
                xn : OffsetRight,
                yp : OffsetTop,
                yn : OffsetBottom
            })
        }
    }

    const setCurrent = (e) => {
        if(ImageCurrent.current.getAttribute("src") != "/icons8-camera.svg") {
            const P = PositionMouse
            let x = 0
            let y = 0
            if(P.xn < PoX && PoX < P.xp) { // เช็คว่ารูปอยู่ในขอบเขต
                x = PoX
            } else if (P.xn > PoX || PoX > P.xp) { // เช็ครูปเกินขอบเขต
                if(P.xn > PoX) { // เมื่อเกินขอบเขตด้าน ซ้าย แกน x 
                    x = P.xn
                } else { // เมื่อเกินขอบเขตด้าน ขวา แกน x 
                    x = P.xp
                }
            }

            if(P.yn < PoY && PoY < P.yp) {
                y = PoY
            } else if (P.yn > PoY || PoY > P.yp) {
                if(P.yn > PoY) { // เมื่อเกินขอบเขตด้าน ล่าง แกน x 
                    y = P.yn
                } else { // เมื่อเกินขอบเขตด้าน บน แกน x 
                    y = P.yp
                }
            }

            setCurrentP({
                x : x,
                y : y
            })

            props.data.set("xImgState" , x)
            props.data.set("yImgState" , y)
            updateData()

            ImageCurrent.current.style.transition = `0.5s`
            ImageCurrent.current.style.transform = `translate(${x}px , ${y}px)`
        }
    }

    const LoadPic = (e) => {
        setWidthImg(ImageCurrent.current.width)
        setHeightImg(ImageCurrent.current.height)
        
        if(ImageCurrent.current.width > ImageCurrent.current.height) {
            CropImg.current.width = ImageCurrent.current.height
            CropImg.current.height = ImageCurrent.current.height
            ImageCurrent.current.setAttribute("size" , "h")
        } else {
            CropImg.current.width = ImageCurrent.current.width
            CropImg.current.height = ImageCurrent.current.width
            ImageCurrent.current.setAttribute("size" , "w")
        }
        
        setLoading(true); 
        // TimeOut.add(
        //     setTimeout(()=>{
        //         (e.target.width > e.target.height) ?
        //             e.target.setAttribute("size" , "h") : e.target.setAttribute("size" , "w")
        //     } , 100)
        // )
    }

    const CropImageToData = () => {
        if(ImageCurrent.current.getAttribute("src") != "/icons8-camera.svg") {
            const context = CropImg.current.getContext('2d')
            const FrameIn = Frame.current
            const Img = ImageCurrent.current

            const sizeImgW = parseFloat(CropImg.current.getAttribute("w"))
            const sizeImgH = parseFloat(CropImg.current.getAttribute("H"))
            const Pox = parseFloat(Img.getAttribute("pox"))
            const Poy = parseFloat(Img.getAttribute("poy"))

            const scaleW = sizeImgW / Img.width
            const scaleH = sizeImgH / Img.height

            console.log(sizeImgW , sizeImgH)
            context.drawImage(
                Img,
                ((FrameIn.offsetLeft - Img.offsetLeft) * scaleW) - (Pox * scaleW),
                ((FrameIn.offsetTop - Img.offsetTop) * scaleH) - (Poy * scaleH),
                sizeImgW,
                sizeImgH,
                0,
                0,
                sizeImgW,
                sizeImgH,
            )

            return CropImg.current.toDataURL('image/jpeg')
        }
    }

    const confirmData = () => {
        if(ImageCurrent.current.getAttribute("src") != "/icons8-camera.svg") {
            let CropImage = CropImageToData()
            props.data.set("Image" , CropImage)
            updateData()

            let data = {
                "firstname" : props.profile.get("firstname"),
                "lastname" : props.profile.get("lastname"),
                "password" : props.profile.get("password"),
                "oldID" : props.profile.get("oldID"),                
                "lat" : props.profile.get("latitude"),                
                "lng" : props.profile.get("longitude"),                
                "station" : props.profile.get("station"),                
                "Img" : props.data.get("Image"),                
            }
            if(data.firstname && data.lastname && data.password && data.lat && data.lng && data.station && data.Img) {
                props.previewData(<PopUpPreview data={data} previewData={props.previewData} liff={props.liff}/>)
            }
        }
    } 

    const updateData = () => {
        props.update(new Map([
            ...props.profile , 
            ...props.data
        ]))
    }

    return (
        <div className="step-three">
            {/* <Camera control={ControlImage} img={Image}/> */}
            <div onLoad={LoadPic} ref={Frame} className="frame-picture">
                {(LoadingImg) ? 
                    <div ref={Loading}></div>
                    :
                    <div ref={Loading} className="Loading-img">LOAD</div>
                }
                <img pox={CurrentP.x} poy={CurrentP.y} onTouchEnd={setCurrent} onTouchStart={setStartMove} onTouchMove={movePicture} ref={ImageCurrent} src={PreviewImage}></img>
            </div>
            <input ref={ControlImage} hidden type="file"  accept="image/*" capture="user" onInput={InputImage} ></input>
            <div onClick={()=>ControlImage.current.click()} className="bt-upload">อัปโหลด</div>
            <canvas w={sizeWidthImg} h={sizeHeightImg} hidden ref={CropImg}></canvas>
            {/* <span ref={ControlImage}></span> */}
        </div>
    )
}

const PopUpPreview = (props) => {
    const Control = useRef()
    const Content = useRef()
    const [Feedback , setFeed] = useState(<></>)

    const [TextData , setText] = useState("")
    const [Result , setResult] = useState(0)
    const [OpenPop , setOpenPop] = useState(false)

    let loadNum = 0

    const ConfirmSave = () => {
        setOpenPop(true)
        clientMo.postForm("/api/farmer/signup" , props.data).then((result)=>{
            if(result === "insert complete"){
                setText("เพิ่มสำเร็จ")
                setResult(1)
            } else if (result === "search") {
                setText("บัญชีรอการตรวจสอบ")
                setResult(2)
            } else if (result === "error") {
                setText("SERVER ERROR")
                setResult(3)
            } else {
                setText("ข้อผิดพลาดการดึงข้อมูล")
                setResult(4)
            }
        })
    }

    const LoadContent = () => {
        loadNum++
        if(loadNum == 2) {
            Content.current.style.opacity = "1"
            Content.current.style.visibility = "visible"
            loadNum = 0
        }
    }

    const LoadBackground = () => {
        Control.current.style.opacity = "1"
        Control.current.style.visibility = "visible"
    }

    return (
        <section onLoad={LoadBackground} className="popUpPreview" ref={Control}>
            {<PopupAlert liff={props.liff} textData={TextData} result={Result} open={OpenPop}/>}
            <div onLoad={LoadContent} className="content" ref={Content}>
                <div className="head">เช็คข้อมูล</div>
                <div className="body">
                    <div className="detail">
                        <div className="firstname">
                            <div>ชื่อ</div>
                            <input readOnly value={props.data['firstname']}></input>
                        </div>
                        <div className="lastname">
                            <div>นามสกุล</div>
                            <input readOnly value={props.data['lastname']}></input>
                        </div>
                        <div className="password">
                            <div>รหัสผ่าน</div>
                            <input readOnly value={props.data['password']}></input>
                        </div>
                        <div className="oldID">
                            <div>รหัสประจำตัว</div>
                            <input readOnly value={props.data['oldID'] ?? "ไม่ระบุ"}></input>
                        </div>
                        <div className="station">
                            <div>ศูนย์ที่อยู่ในการดูแล</div>
                            <input readOnly value={props.data['station']}></input>
                        </div>
                    </div>
                    <div className="detail-other">
                        <div className="google-map">
                            <MapsJSX w={"100%"} lat={props.data['lat']} lng={props.data['lng']}/>
                        </div>
                        <div className="frame-image">
                            <img width={"100%"} src={props.data['Img']}></img>
                        </div>
                    </div>
                </div>
                <div className="action">
                    <div onClick={()=>props.previewData(<></>)}>ยกเลิก</div>
                    <div onClick={ConfirmSave}>ยืนยัน</div>
                </div>
            </div>
        </section>
    )
}

export {SignUp}