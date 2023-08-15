import React , { useEffect , useRef, useState } from "react";
import { Loading, MapsJSX, PatternCheck, ReportAction, ResizeImg } from "../../../src/assets/js/module";

import './assets/Signup.scss'
import {clientMo}  from "../../../src/assets/js/moduleClient";
import { CloseAccount } from "../method";

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
    const LoadingPreview = useRef()

    const [PositionBt , setBt] = useState(window.innerHeight - ((window.innerHeight * 15/100) + 20))
    const [animetion , setAnimetion] = useState(false)

    const [btNext , setbtNext] = useState(false)

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
        setbtNext(false)
        switch(stepInMedthod) {
            case 1 :
                setStep(<StepOne stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile} btnext={setbtNext}/>)
                break;
            case 2 :
                setStep(<StepTwo stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile} btnext={setbtNext}/>)
                break;
            case 3 :
                setStep(<StepThree setAnimetion={setAnimetion} LoadingPreview={LoadingPreview} liff={liff} previewData={setPreviewData} detailBody={DetailProfile} confirm={confirm} stepAp={setApprov} data={DataProfile} profile={ProfileData} update={setProfile} btnext={setbtNext}/>)
                break;
        }
    }

    const LoadPage = (e) => {
        clientMo.unLoadingPage()
    }

    return (
        <section id="content-signup-farmer" onLoad={LoadPage}>
            {PreviewData}
            <div className="Loading-preview" ref={LoadingPreview}>
                <Loading size={80} border={8} animetion={animetion}/>
            </div>
            <div className="title">
                <div className="title-form">ทะเบียนเกษตรกร</div>
                <div className="subtitle">สมัครบัญชี</div>
            </div>
            <div className="form-sigup">
                <div className="detail-profile" ref={DetailProfile}>
                    {step}
                </div>
            </div>
            <div className="button-step" style={{
                top : `${PositionBt}px`
            }}>
                <img ref={back} hide="" onClick={()=>changeStep(false)} className="back" src="/caret-back-circle-svgrepo-com.svg"></img>
                <div className="status-step">
                    <span select=""></span>
                    <span></span>
                    <span></span>
                </div>
                <div>
                    <svg ref={confirm} className="confirm" viewBox="0 0 32.00 32.00" xmlns="http://www.w3.org/2000/svg" strokeWidth="0.00032">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.192"/>
                        <g id="SVGRepo_iconCarrier">
                            <path d="m16 0c8.836556 0 16 7.163444 16 16s-7.163444 16-16 16-16-7.163444-16-16 7.163444-16 16-16zm5.7279221 11-7.0710679 7.0710678-4.2426406-4.2426407-1.4142136 1.4142136 5.6568542 5.6568542 8.4852814-8.4852813z" 
                                fillRule="evenodd"/>
                        </g>    
                    </svg>
                    <svg ref={next} unclick={btNext ? null : ""} onClick={()=>changeStep(true)} src="/caret-forward-circle-sharp-svgrepo-com.svg" className="next" viewBox="0 0 512 512" >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                        <g id="SVGRepo_iconCarrier">
                            <title>ionicons-v5-b</title>
                            <path d="M464,256c0-114.87-93.13-208-208-208S48,141.13,48,256s93.13,208,208,208S464,370.87,464,256ZM212,147.73,342.09,256,212,364.27Z"/>
                        </g>
                    </svg>
                    {/* fill="#009919" */}
                    {/* <img src="/confirm-sf-svgrepo-com.svg"></img> */}
                    {/* <img ref={next} unclick={btNext ? null : ""} onClick={()=>changeStep(true)} src="/caret-forward-circle-sharp-svgrepo-com.svg" className="next"></img> */}
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
            ( props.data.get("firstname") && PatternCheck(props.data.get("firstname")).thaiName ) &&
            ( props.data.get("lastname") && PatternCheck(props.data.get("lastname")).thaiName ) &&
            props.data.get("password")
            )
        {
            props.btnext(true)
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
                    <input autoComplete="false" placeholder="กรอกชื่อภาษาไทย" defaultValue={props.profile.get("firstname")} onChange={checkData} type="text" ref={Firstname} data="firstname"></input> 
                </label>
                <label className="fullname">
                    <span>
                        <span>นามสกุล</span><span className="dot">*</span>
                    </span>
                    <input autoComplete="false" placeholder="กรอกนามสกุลภาษาไทย" defaultValue={props.profile.get("lastname")} onChange={checkData} type="text" ref={Lastname} data="lastname"></input> 
                </label>
                <label className="password">
                    <span>
                        <span>รหัสผ่าน</span><span className="dot">*</span>
                    </span>
                    <input autoComplete="false" defaultValue={props.profile.get("password")} onChange={checkData} type="password" ref={Password} data="password"></input> 
                </label>
                <label className="select-remember">
                    <span>
                        <span>รหัสเกษตรกร</span><span className="dot">หากมีหรือจำได้</span>
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

    const [LoadingState , setLoading] = useState(<></>)
    
    useEffect(()=>{
        props.stepAp(2)
        PullMap()

        return () => {
            clearTimeout(timeOutLoad)
        }
    } , [])

    const PullMap = () => {
        LoadingMap.current.removeAttribute('hide','')
        setLoading(<Loading size={50} border={8} animetion={true}/>)
        MapEle.current.removeAttribute('show','')
        setCurrent(<></>)
        timeOutLoad = setTimeout(
            ()=>{
                pullMapEJS()
                // if ('geolocation' in navigator) {
                //     navigator.permissions.query({ name: 'geolocation' })
                //         .then(permissionStatus => {
                //             if (permissionStatus.state === 'granted') {
                //                 pullMapEJS()
                //             } else if (permissionStatus.state === 'prompt') {
                //                 permissionStatus.onchange = () => {
                //                     if (permissionStatus.state === 'granted') {
                //                         pullMapEJS()
                //                     } else {
                                        
                //                     }
                //                 };
                //             } else {
                                
                //             }
                //         })
                //         .catch(error => {
                            
                //         });
                // } else {
                    
                // }
            } , 1000)
    }

    const pullMapEJS = () => {
        navigator.geolocation.getCurrentPosition((location)=>{
            MapEle.current.setAttribute('show','')
            
            props.data.set("latitude" , location.coords.latitude)
            props.data.set("longitude" , location.coords.longitude)
            clientMo.post("/api/farmer/station/search").then((list)=>{

                const search = new Array
                const sortMap = new Map
                try {
                    JSON.parse(list).map(val=>{
                        let lag = Math.abs(location.coords.latitude - val.location.x)
                        let lng = Math.abs(location.coords.longitude - val.location.y)
                        search.push({id : val.id , name : val.name , dist : lag + lng})
                    })
                    
                    setStation(search.sort((a , b)=>a.dist - b.dist).slice(0 , 2))
                    setReady(true)
                } catch (e) {
                    CloseAccount(list , "")
                }
                // if(props.profile.get("station") == undefined) HeadList.current.setAttribute("selected" , "")
            })
            CheckData()
            setCurrent(<MapsJSX w={"100%"} lat={location.coords.latitude} lng={location.coords.longitude}/>)
        } , null , {
            enableHighAccuracy: true
        })
    }

    const reloadMap = () => {
        PullMap()
    }

    const CheckData = (e) => {
        if(e) {
            setSelected(e.target.value)
        }

        if(Station.current) props.data.set("station" , Station.current.value)
        else props.data.set("station" , props.profile.get("station"))
        props.update(new Map([
            ...props.profile , 
            ...props.data
        ]))

        console.log(props.data)

        if(props.data.get("station") 
            && props.data.get("latitude") 
            && props.data.get("longitude")) 
        {
            props.btnext(true)
            props.stepAp(3)
        } else {
            props.stepAp(2)
        }
    }

    const MapLoad = () => {
        LoadingMap.current.setAttribute('hide','')
        setLoading(<></>)
    }

    return (
        <section className="step-two">
            <div className="head-step">
                ตำแหน่ง
            </div>
            <div className="detail-farmer">
                <label className="location">
                    <div className="head-map">ตำแหน่งแปลงที่อยู่</div>
                    <div className="warning">* เพื่อการดึงข้อมูลที่ถูกต้อง โปรดอยู่ในตำแหน่งที่ทำการเกษตรกรของท่าน</div>
                    <div className="map-genarate">
                        <div onLoad={MapLoad} ref={MapEle} className="map">
                            {LocationCurrent}
                        </div>
                        <div ref={LoadingMap} className="loading-map">
                            {LoadingState}
                        </div>
                    </div>
                    <div className="box-bt">
                        <button className="bt-map-reload" onClick={reloadMap}>โหลดพิกัด</button>
                    </div>
                </label>
                <label className="station">
                    <div className="content-station">
                        <div className="head-station">ศูนย์ที่เกษตรกรอยู่ในการดูแล</div>
                        {(Listready) ?
                            <div className="content-select">
                                <select value={Selected ?? ""} ref={Station} onChange={CheckData}>
                                    <option value="" disabled>
                                        เลือกศูนย์
                                    </option>
                                    {
                                    (Listready) ? 
                                        ListStation.map((val , index)=>
                                            <option key={index} value={val['id']}>{val['name']}</option>
                                        )
                                        : <></>
                                    }
                                </select> 
                            </div>
                            : 
                            <div className="loading-content">
                                <Loading size={25} border={4} animetion={true}/><span>โหลดตัวเลือกศูนย์</span>  
                            </div>}
                    </div>
                </label>
            </div>
        </section>
    )
}

const StepThree = (props) => {
    const ImageCurrent = useRef()
    const [PreviewImage , setPreview] = useState(props.profile.get('dataImgState') ?? "/view-preview-img.svg")
    const ControlImage = useRef()
    const Frame = useRef()
    const LoadingEle = useRef()
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
        LoadingEle.current.style.width = `${props.detailBody.current.clientWidth * 0.8}px`
        LoadingEle.current.style.height = `${props.detailBody.current.clientWidth * 0.8}px`

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

        ImageCurrent.current.removeAttribute("style")
        ImageCurrent.current.removeAttribute("size")
        setCurrentP({
            x : 0,
            y : 0
        })
        if(file) {
            if(new Date().getTime() - file.lastModified < 8000
                ) {
                ResizeImg(file , 600).then((imageResult)=>{
                    setPreview(imageResult)
                    props.data.set("dataImgState" , imageResult)
                    props.data.set("xImgState" , 0)
                    props.data.set("yImgState" , 0)
                    updateData()
                })
            } 
            else {
                setLoading(true)
                setPreview("/view-preview-img.svg")
                ImageCurrent.current.setAttribute("size" , "w")
                alert('โปรดใช้รูปถ่ายปัจจุบัน')
            }
        } else {
            setLoading(true)
            setPreview("/view-preview-img.svg")
        }
    }

    const movePicture = (e = document.getElementById("")) => {
        if(PreviewImage != "/view-preview-img.svg") {
            const P = PositionMouse

            let x = xM + ((e.touches[0].clientX - P.x) / frameLate) // ค่าที่เลื่อนรูปบนแกน x
            let y = yM + ((e.touches[0].clientY - P.y) / frameLate) // ค่าที่เลื่อนรูปบนแกน y

            setX(x) // set ค่า เพื่อนำไปตรวจสอบว่ามีการเลื่อนรูปเกินขอบหรือไม่ ตอนที่ปล่อยรูป
            setY(y) // set ค่า เพื่อนำไปตรวจสอบว่ามีการเลื่อนรูปเกินขอบหรือไม่ ตอนที่ปล่อยรูป

            ImageCurrent.current.style.transform = `translate(${x}px , ${y}px)` // action ตอนเลื่อน
        }

    }

    const setStartMove = (e) => {
        if(PreviewImage != "/view-preview-img.svg") {
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
        if(PreviewImage != "/view-preview-img.svg") {
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
    
        if(PreviewImage != "/view-preview-img.svg") props.confirm.current.style.fill = "#009919"
        else props.confirm.current.style.fill = "#5b896eb5"
        setLoading(true); 
    }

    const CropImageToData = () => {
        if(ImageCurrent.current.src.indexOf("/view-preview-img.svg") < 0) {
            const context = CropImg.current.getContext('2d')
            const FrameIn = Frame.current
            const Img = ImageCurrent.current

            const sizeImgW = parseFloat(CropImg.current.getAttribute("w"))
            const sizeImgH = parseFloat(CropImg.current.getAttribute("H"))
            const Pox = parseFloat(Img.getAttribute("pox"))
            const Poy = parseFloat(Img.getAttribute("poy"))

            const scaleW = sizeImgW / Img.width
            const scaleH = sizeImgH / Img.height

            console.log(scaleH)
            console.log(((FrameIn.offsetTop - Img.offsetTop) * scaleH) - (Poy * scaleH))

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
        props.LoadingPreview.current.setAttribute("show" , "")
        props.setAnimetion(true)
        if(ImageCurrent.current.src.indexOf("/view-preview-img.svg") < 0) {
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
                props.previewData(<PopUpPreview setAnimetion={props.setAnimetion} LoadingPreview={props.LoadingPreview} data={data} previewData={props.previewData} liff={props.liff}/>)
            } else {
                props.LoadingPreview.current.removeAttribute("show")
            }
        } else {
            props.LoadingPreview.current.removeAttribute("show")
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
            <div className="head-step">
                รูปประจำตัว
            </div>
            <div onLoad={LoadPic} ref={Frame} className="frame-picture">
                {(LoadingImg) ? 
                    <div ref={LoadingEle}></div>
                    :
                    <div ref={LoadingEle} className="Loading-img">
                        <Loading size={70} border={8} color="green" animetion={true}/>
                    </div>
                }
                <img pox={CurrentP.x} poy={CurrentP.y} onTouchEnd={setCurrent} onTouchStart={setStartMove} onTouchMove={movePicture} ref={ImageCurrent} src={PreviewImage}></img>
            </div>
            <div className="content-bt">
                <div onClick={()=>ControlImage.current.click()} className="bt-upload">ถ่ายรูป</div>
            </div>
            <input ref={ControlImage} hidden type="file"  accept="image/*" capture="user" onInput={InputImage} ></input>
            <canvas w={sizeWidthImg} h={sizeHeightImg} hidden ref={CropImg}></canvas>
        </div>
    )
}

const PopUpPreview = (props) => {
    const Control = useRef()
    const Content = useRef()
    const FrameBody = useRef()
    const [Feedback , setFeed] = useState(<></>)

    const [Station , setStation] = useState("")

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

    const LoadContent = async (e) => {
        loadNum++
        if(loadNum == 2) {
            const name = JSON.parse(await clientMo.post("/api/farmer/station/get" , {id_station : props.data['station']}))[0].name

            FrameBody.current.style.overflow = "scroll"
            Control.current.style.opacity = "1"
            Control.current.style.visibility = "visible"
            Content.current.style.opacity = "1"
            Content.current.style.visibility = "visible"
            setStation(name)
            props.LoadingPreview.current.removeAttribute("show")
            setTimeout(()=>{
                props.setAnimetion(false)
            } , 500)
            loadNum = 0
        }
        console.log(e)
    }

    const confirmArert = () => {
        if(Result != 0) {
            if(Result == 1 || Result == 2) {
                props.liff.closeWindow()
            } else {
                setText("")
                setResult(0)
                setOpenPop(0)
            }
        }
    }

    return (
        <section onLoad={LoadContent} className="popUpPreview" ref={Control}>
            {/* {<PopupAlert liff={props.liff} textData={TextData} result={Result} open={OpenPop} 
                setOpen={setOpenPop} setResult={setResult} setText={setText}/>} */}
            <ReportAction Open={OpenPop} Text={TextData} Status={Result}
                            setOpen={setOpenPop} setText={setText} setStatus={setResult} 
                            sizeLoad={90} BorderLoad={10} color="white" action={confirmArert}/>
            <div className="content" ref={Content}>
                <div className="head">เช็คข้อมูล</div>
                <div className="body">
                    <div ref={FrameBody} className="frame-body">
                        <div className="detail">
                            <div className="frame-image">
                                <img width={"100%"} src={props.data['Img']}></img>
                            </div>
                            <div className="text-detail">
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
                                    <input type="password" readOnly value={props.data['password']}></input>
                                </div>
                                <div className="oldID">
                                    <div>รหัสเกษตรกร</div>
                                    <input readOnly value={(props.data['oldID']) ? props.data['oldID'] : "ไม่ระบุ"}></input>
                                </div>
                                <div className="station">
                                    <div>ศูนย์ที่อยู่ในการดูแล</div>
                                    <input readOnly value={Station}></input>
                                </div>
                            </div>
                        </div>
                        <div className="google-map">
                            <MapsJSX w={"100%"} lat={props.data['lat']} lng={props.data['lng']}/>
                        </div>
                    </div>
                </div>
                <div className="action">
                    <div className="cancel" onClick={()=>props.previewData(<></>)}>ยกเลิก</div>
                    <div className="submit" onClick={ConfirmSave}>ยืนยัน</div>
                </div>
            </div>
        </section>
    )
}

export default SignUp