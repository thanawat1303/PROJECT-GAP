import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff"

const MapsJSX = ({lat , lng , w , h}) => {
    const [latitude , setLag] = useState(0)
    const [longtitude , setLng] = useState(0)

    useEffect(()=>{
        setLag(lat)
        setLng(lng)
    } , [lat , lng])
    return(
        <iframe src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_API_KEY}&q=${latitude},${longtitude}&zoom=18&maptype=satellite`} 
           frameBorder={0} width={w} height={h} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    )
}

const DayJSX = ({REF , DATE , TYPE = "full" , TEXT = ""}) => {
    const [DateOut , setDATE] = useState("")
    const DayWeek = [ 'วันอาทิตย์','วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัสบดี','วันศุกร์','วันเสาร์'] 
    const Mount = [ "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"] 

    useEffect(()=>{
        if(DATE.indexOf("#") < 0) {
            const clientTimezoneOffset = new Date().getTimezoneOffset();
            const DateIn = new Date(new Date(DATE) - (clientTimezoneOffset * 60000));

            if(TYPE === "full") setDATE(`${DayWeek[DateIn.getDay()]} ที่ ${DateIn.getDate()} ${Mount[DateIn.getMonth()]} ปี พ.ศ. ${DateIn.getFullYear() + 543}`)
            else if (TYPE === "small") setDATE(`${TEXT ? `${TEXT} ` : ""}${DateIn.getDate()} ${Mount[DateIn.getMonth()]} ${DateIn.getFullYear() + 543}`)
            else setDATE(`วันที่ ${DateIn.getDate()} ${Mount[DateIn.getMonth()]} ${DateIn.getFullYear() + 543}`)
        } else {
            const DateSet = DATE.split("-")
            console.log(DateSet)
            setDATE(`${DateSet[2] != "##" ? `วันที่ ${DateSet[2]} ` : ""}${DateSet[1] != "##" ? `เดือน ${Mount[DateSet[1]]} ` : ""}${DateSet[0] != "##" ? `ปี ${parseInt(DateSet[0]) + 543}` : ""}`)
        }
    })

    return (<input date_dom="" ref={REF} readOnly value={DateOut}></input>)
}

const TimeJSX = ({DATE , MAX = true}) => {
    const [Time , setTime] = useState("")

    useEffect(()=>{
        const clientTimezoneOffset = new Date().getTimezoneOffset();
        const TimeIn = new Date(new Date(DATE) - (clientTimezoneOffset * 60000));
        
        if(MAX) setTime(`เวลา ${TimeIn.getUTCHours()} นาฬิกา ${TimeIn.getMinutes()} นาที ${TimeIn.getSeconds()} วินาที`)
        else setTime(`เวลา ${TimeIn.getUTCHours()}:${TimeIn.getMinutes() >= 10 ? TimeIn.getMinutes() : `0${TimeIn.getMinutes()}`}`)
    } , [])

    return(<input readOnly value={Time}></input>)
}

const TimeDiff = ({DATE}) => {
    const [Time , setTime] = useState("")

    useEffect(()=>{
        // const clientTimezoneOffset = new Date().getTimezoneOffset();
        // const TimeIn = new Date(new Date(DATE) - (clientTimezoneOffset * 60000));
        const TimeIn = new Date(DATE)
        const NowTime = new Date().getTime()
        const DiffTime = (NowTime - TimeIn.getTime())
        // console.log(TimeIn , new Date())
        const NewTime = parseInt(DiffTime / (1000)) < 60 ? `${parseInt(DiffTime / (1000))} วินาทีที่แล้ว` :
                        parseInt(DiffTime / (1000 * 60)) < 60 ? `${parseInt(DiffTime / (1000 * 60))} นาทีที่แล้ว` :
                        parseInt(DiffTime / (1000 * 60 * 60)) < 24 ? `${parseInt(DiffTime / (1000 * 60 * 60))} ชั่วโมงที่แล้ว` :
                        parseInt(DiffTime / (1000 * 60 * 60 * 24)) < 3 ? `${parseInt(DiffTime / (1000 * 60 * 60 * 24))} วันที่แล้ว` :
                        `วันที่ ${TimeIn.getDate()}:${TimeIn.getMonth()}:${TimeIn.getFullYear()}`
        setTime(NewTime)
    } , [])

    return(<input readOnly value={Time}></input>)
}

const ClosePopUp = (e , id , stateChange , back=false) => {
    if(e.target.id === id) {
        document.getElementById(id).removeAttribute('show')
        stateChange()
    }

    if(e.target.id === id && back) {
        window.history.back()
    }
}

const Socket = (eventSc , message) => {
    const socket = new WebSocket(`ws://${window.location.href}:3000`);
}

const useLiff = (idLiff) => {
    const Liff = liff
    const init = Liff.init({liffId:idLiff})
    return [init , Liff];
}

import "../style/camera.scss"
const Camera = (props) => { // ยังไม่เสร็จ
    const [StatusCamera , setStatus] = useState(false)
    const [BodyCamera , setBody] = useState(<></>)
    const ContentCamera = useRef()

    useEffect(()=>{
        props.control.current.addEventListener('click' , CameraOnOff)
        console.log(props.img)
        return () => {
            props.control.current.removeEventListener('click' , CameraOnOff)
        }
    } , [])

    const CameraOnOff = () => {
        if(!StatusCamera) {
            ContentCamera.current.setAttribute("show" , "")
            setBody(<CameraOpen/>)
            setStatus(true)
        } else {
            ContentCamera.current.removeAttribute("show")
            setBody(<></>)
            setStatus(false)
        }
    }

    const CameraOpen = () => {
        const PreviewCamera = useRef()
        let Stream = null
        const ObNavigor = navigator.mediaDevices

        useEffect(()=>{
            OpenCamera()
            return () => {
                StopCamera()
            }
        })

        const OpenCamera = () => {
            ObNavigor.getUserMedia({
                video:{
                    width:{ideal: 260 },
                    height: {ideal: 260}
                },
                audio:false
            }).then((stream)=>{
                Stream = stream //set stream video
                PreviewCamera.current.srcObject = Stream //add Object stream
                stream = null //set stream off
            }).catch((err)=>{
                alert(err)
            })
        }

        const StopCamera = () => {
            if(Stream) {
                Stream.getTracks().forEach(track => {
                    track.stop();
                })
                Stream = null
            }
        }

        return(
            <section className="frame-camera">
                <canvas id="result-camera-capture"></canvas>
                <video ref={PreviewCamera} autoPlay></video>
            </section>
        )
    }

    return(
        <div ref={ContentCamera} className="content-camera" onClick={CameraOnOff}>
            {BodyCamera}
            <button>CAPTURE</button>
        </div>
    )
}

const ResizeImg = (file , MaxSize) => {
    return new Promise((resole , reject)=>{
        const image = new Image();

        image.onload = function () {
            let width = image.width;
            let height = image.height;
            
            if(width > MaxSize || height > MaxSize) {
                if(width < height) {
                    height = (MaxSize / width) * height;
                    width = MaxSize;
                } else if(width > height) {
                    width = (MaxSize / height) * width
                    height = MaxSize
                }
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            // ctx.imageSmoothingEnabled = false
            // ctx.imageSmoothingQuality = true
            ctx.drawImage(image, 0, 0, width, height);

            resole(canvas.toDataURL('image/jpeg'))
        };

        image.src = URL.createObjectURL(file);
    })
}

const Loading = ({size , MaxSize = 0 , border , color="green" , animetion = false}) => {
    return (
        <div className="loading-dom-module" style={{
            display : "flex",
            justifyContent : "center",
            alignContent : "center",
            width : isNaN(size) ? size : `${size}px`,
            height : isNaN(size) ? size : `${size}px`,
            maxWidth : MaxSize ? `${MaxSize}px` : "",
            maxHeight : MaxSize ? `${MaxSize}px` : "",
            // overflow : "hidden"
        }}>
            <div className="curcle"
                style={{
                    border: `${isNaN(border) ? border : `${border}px`} solid ${color}`,
                    borderLeft : `${isNaN(border) ? border : `${border}px`} solid transparent`,
                    borderRadius : "50%",
                    width : "98%",
                    height : "98%",
                    animation : animetion ? "rotate-curcle 2s cubic-bezier(0, 0, 0, 0) 0s infinite" : "none"
                }}
            ></div>
        </div>
    )
}

const ButtonMenu = ({type , textRow1 , textRow2 , action}) => {
    return(
        <div onClick={action} className={`bt-menu-frame ${type}`}>
            <img src={`/iconBt/icon-bt-${type}.png`}></img>
            <div className="text-one">{textRow1}</div>
            <div className="text-two">{textRow2}</div>
            <div className="action">
                <button>คลิก</button>
            </div>
        </div>
    )
}

const ReportAction = ({Open , Text , Status , setText , setStatus , setOpen , sizeLoad , BorderLoad , color , action = null}) => {
    const Control = useRef()

    const [state , setstate] = useState(false)

    let Time = 0

    useEffect(()=>{
        clearTimeout(Time)
        if(Open) {
            setstate(false) 
        }
    } , [Open])

    const confirm = () => {
        if(Status != 0) {
            setOpen(0)
            Time = setTimeout(()=>{
                setText("")
                setStatus(0)
            } , 500)
        }
    }

    const ShowStatus = () => {
        setstate(true)
    }
    return (
        <Report-Dom ref={Control} style={{
            display: "flex" ,
            justifyContent : "center",
            alignItems:"center",
            flexDirection : "column" ,
            zIndex : Open ? "15" : -10 ,
            width : "100%",
            height : "100%",
            position : "absolute" ,
            backgroundColor : "transparent" ,
            backdropFilter : "blur(8px)" ,
            opacity : Open ? "1" : "0" ,
            visibility : Open ? "visible" : "hidden",
            top : 0,
            transition : "0.5s opacity , 0.5s visibility , 0.5s z-index"
        }}>
            <Body-Report style={{
                display: "flex" ,
                justifyContent : "center",
                alignItems:"center",
                flexDirection : "column" ,
                backgroundColor: "transparent",
                // boxShadow : "0px 0px 15px green",
            }}>
                <Text-Report>
                    {Text ? state ? Text : "กำลังตรวจสอบ" : "กำลังตรวจสอบ"}
                </Text-Report>
                <Status-Report style={{
                    display : "flex",
                    justifyContent : "center",
                    alignItems:"center",
                }} onLoad={ShowStatus}>
                    {
                        Status ? 
                            (Status == 1) ? 
                                <img style={{
                                    position : "absolute",
                                    opacity : state ? 1 : "0",
                                    width : sizeLoad ,
                                    visibility : state ? "visible" : "hidden",
                                    transition : "0.5s opacity , 0.5s visibility",
                                    backgroundColor : "transparent",
                                    backdropFilter : "blur(8px)",
                                    borderRadius : "50%"
                                }} src="/correct-icon-green.svg"></img> 
                                :
                                <img style={{
                                    position : "absolute",
                                    width : sizeLoad ,
                                    opacity : state ? 1 : "0",
                                    visibility : state ? "visible" : "hidden",
                                    transition : "0.5s opacity , 0.5s visibility"
                                }} src="/error-cross-svgrepo-com.svg"></img>
                        : <></>
                    }
                    <div style={{
                        opacity : !state ? 1 : "0",
                        visibility : !state ? "visible" : "hidden",
                        transition : "0.5s opacity , 0.5s visibility"
                    }}>
                        <Loading size={sizeLoad} border={BorderLoad} color={color} animetion={Open}/>
                    </div>
                </Status-Report>
                <BoxButton-Report>
                    <button
                        style={{
                            border : "0",
                            opacity : (Status == 0) ? 0 : 1,
                            visibility : (Status == 0) ? "hidden" : "visible",
                            transition : "0.5s opacity , 0.5s visibility"
                        }}
                        onClick={action ?? confirm}>ตกลง</button>
                </BoxButton-Report>
            </Body-Report>
        </Report-Dom>
    )
}

const PopupDom = ({Ref , Body , zIndex , positionEdit = false , Background = "transparent"}) => {
    return (
        <section ref={Ref} style={{
            display : "flex",
            justifyContent : positionEdit ? "normal" : "center" ,
            alignItems : positionEdit ? "normal" : "center" ,
            backgroundColor : Background ,
            backdropFilter : "blur(8px)",
            position : "fixed" ,
            width : "100vw",
            height : "100vh",
            top : "0" ,
            left : "0" ,
            zIndex : zIndex ,
            opacity : "0" ,
            visibility : "hidden" ,
            transition : "0.5s opacity , 0.5s visibility"
        }}>
            {Body}
        </section>
    )
}

const LoadOtherDom = ({Fetch , count , setCount , Limit , style = {
    backgroundColor : "",
    fontSize : "18px",
    sizeLoading : "31.2px",
}}) => {
    const [Load , setLoad] = useState(true)
    const Other = async () => {
        const newCount = count + Limit
        setLoad(false)
        // if((await Fetch(newCount)).length === newCount) setCount(newCount)
        setCount((await Fetch(newCount)).length)
        setLoad(true)
    }

    return (
        <div style={{
            display : "flex",
            justifyContent : "center",
            alignItems : "center",
            width : "100%",
            marginTop : "5px"
        }}>
            {Load ? 
                <button style={{
                    backgroundColor : style.backgroundColor,
                    outline : 0,
                    border : 0,
                    borderRadius : "15px",
                    color : "white",
                    fontFamily : "Sans-font",
                    fontWeight : "900",
                    fontSize : style.fontSize ? style.fontSize : "18px",
                    padding : "2px 15px"
                }} onClick={Other}>โหลดเพิ่มเติม</button>
                : 
                <div style={{
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center",
                    width : "100%",
                    overflow : "hidden"
                }}>
                    <Loading size={style.sizeLoading ? style.sizeLoading : "31.2px"} border={7} color={style.backgroundColor} animetion={true}/>
                </div>

            }
        </div>
    )
}

const LoadOtherOffset = ({Fetch , Data , setRow , Limit , style = {
    backgroundColor : "",
    fontSize : "18px",
    sizeLoading : "31.2px",
}}) => {
    const [Load , setLoad] = useState(true)
    const Other = async () => {
        setLoad(false)
        const Row = await Fetch(Data.length , Limit)
        if(Row.length !== 0) setRow(Row.length)
        setLoad(true)
    }

    return (
        <div style={{
            display : "flex",
            justifyContent : "center",
            alignItems : "center",
            width : "100%",
            marginTop : "5px"
        }}>
            {Load ? 
                <button style={{
                    backgroundColor : style.backgroundColor,
                    outline : 0,
                    border : 0,
                    borderRadius : "15px",
                    color : "white",
                    fontFamily : "Sans-font",
                    fontWeight : "900",
                    fontSize : style.fontSize ? style.fontSize : "18px",
                    padding : "2px 15px"
                }} onClick={Other}>โหลดเพิ่มเติม</button>
                : <Loading size={style.sizeLoading ? style.sizeLoading : "31.2px"} border={7} color={style.backgroundColor} animetion={true}/>

            }
        </div>
    )
}

const PatternCheck = (value) => {
    return ({
        fullname : /^[ก-ฮะ-์]+\s[ก-ฮะ-์]+$/.test(value),
        thaiName : /^[ก-ฮะ-์]+$/.test(value)
    })
}

const DownLoadImage = ({className , stroke = "#000000" , fileName , DataImageBase64}) => {
    const aTag = useRef()

    const DownLoad = () => {
        var img = new Image();
        img.src = DataImageBase64;
        img.onload = () => Onload(img);
    }

    const Onload = (img) => {
        const date = `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`
        aTag.current.href = img.src
        aTag.current.download = `${fileName}_${date}.jpg`
        aTag.current.click()
        img.removeEventListener("load" , ()=>Onload(img))
    }

    return (
        <>
        <a className={className} title="ดาวโหลดรูปภาพ" onClick={DownLoad}>
            <svg viewBox="0 0 24 24" fill="white">
                <path d="M5.25589 16C3.8899 15.0291 3 13.4422 3 11.6493C3 9.20008 4.8 6.9375 7.5 6.5C8.34694 4.48637 10.3514 3 12.6893 3C15.684 3 18.1317 5.32251 18.3 8.25C19.8893 8.94488 21 10.6503 21 12.4969C21 14.0582 20.206 15.4339 19 16.2417M12 21V11M12 21L9 18M12 21L15 18" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </a>
        <a hidden ref={aTag}></a>
        </>
    )
}

const SetMaxLength = (e , setQty , max) => {
    e.target.value = e.target.value.slice(0 , max)
    setQty(e.target.value.length)
}

const DateSelect = ({RefDate , Value , methodCheckValue}) => {
    const Mount = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]
    const YearCurrent = new Date().getFullYear()

    const [getDefault , setDefault] = useState(new Date(Value) != "Invalid Date" ? new Date(Value) : "")
    const [getDay , setDay] = useState([])
    const [getYearSelect , setYearSelect] = useState([])

    const RefDay = useRef()
    const RefMount = useRef()
    const RefYear = useRef()

    useEffect(()=>{
        const newYear = new Array
        for(let year = YearCurrent - 50; year <= YearCurrent; year++) {
            newYear.push(year)
        }
        setYearSelect(newYear.reverse())
    } , [])

    useEffect(()=>{
        setDefault(new Date(Value) != "Invalid Date" ? new Date(Value) : "")
        RefDay.current.value = getDefault ? getDefault.getDate() : ""
        RefMount.current.value = getDefault ? getDefault.getDate() : ""
        RefYear.current.value = getDefault ? getDefault.getFullYear() : ""

        SetDay()
        console.log(Value)
    } , [Value])

    const SetDay = () => {
        const targetMonth = getDefault ? getDefault.getMonth() : ""; 
        const targetYear = getDefault ? getDefault.getFullYear() : "";
        const startDate = new Date(targetYear, targetMonth, 1);
        const nextMonthDate = new Date(targetYear, targetMonth + 1, 1);
        console.log((nextMonthDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        if(startDate != "Invalid Date" && nextMonthDate != "Invalid Date") {
            const daysInMonth = (nextMonthDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            const newDay = new Array
            for(let day = 1; day <= daysInMonth; day++) {
                newDay.push(day)
            }
            setDay(newDay)
        }
    }

    const SelectSetDay = (Mount , Year) => {
        const targetMonth = parseInt(Mount); 
        const targetYear = parseInt(Year);
        const startDate = new Date(targetYear, targetMonth, 1);
        const nextMonthDate = new Date(targetYear, targetMonth + 1, 1);
        console.log((nextMonthDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        if(startDate != "Invalid Date" && nextMonthDate != "Invalid Date") {
            const daysInMonth = (nextMonthDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            const newDay = new Array
            for(let day = 1; day <= daysInMonth; day++) {
                newDay.push(day)
            }
            setDay(newDay)
        }
    }

    const ChangeDate = (day , mount , year) => {
        RefDate.current.value = `${year}-${mount ? mount : "##"}-${day ? day : "##"}`
        methodCheckValue()
    }

    return(
        <div className="date-select">
            <select className="list-date-select" defaultValue={getDefault ? getDefault.getDate() : ""} ref={RefDay} onChange={(e)=>{
                ChangeDate(e.target.value , RefMount.current.value , RefYear.current.value)
            }}>
                <option value={""}>วันที่</option>
                { 
                    getDay.map((val , key)=>
                        <option value={val} key={key}>{val}</option>
                    )
                }
            </select>
            <select className="list-date-select" defaultValue={getDefault ? getDefault.getMonth() : ""} ref={RefMount} onChange={(e)=>{
                SelectSetDay(e.target.value , RefYear.current.value)
                ChangeDate(RefDay.current.value , e.target.value , RefYear.current.value)
            }}>
                <option value={""}>เดือน</option>
                { 
                    Mount.map((val , key)=>
                        <option value={key} key={key}>{val}</option>
                    )
                }
            </select>
            <select className="list-date-select" defaultValue={getDefault ? getDefault.getFullYear() : ""} ref={RefYear} onChange={(e)=>{
                SelectSetDay(RefMount.current.value , e.target.value)
                ChangeDate(RefDay.current.value , RefMount.current.value , e.target.value)
            }}>
                <option disabled value={""}>ปี</option>
                { 
                    getYearSelect.map((val , key)=>
                        <option value={val} key={key}>{val + 543}</option>
                    )
                }
            </select>
            <input hidden ref={RefDate}></input>
        </div>
    )
}

class TabLoad {
    constructor(Ref) {
        this.timeOut = new Array();
        this.TabRef = Ref
    }

    start() {
        this.timeOut.forEach(val=>{
            clearTimeout(val)
        })

        const num = Math.random()
        this.TabRef.current.removeAttribute("style")
        this.TabRef.current.style.display = `flex`
        this.TabRef.current.style.width = `${20 + (num * 40)}%`
    }

    end() {
        this.TabRef.current.style.width = `100%`
        return setTimeout(()=>{
            this.TabRef.current.removeAttribute("style")
            this.TabRef.current.style.display = `none`
        } , 500)
    }

    addTimeOut(id) {
        this.timeOut.push(id)
    }

    getTime() {
        return this.timeOut
    }
}

class HrefData {
    constructor(start) {
        this.Href = start;
    }

    get() {
        return this.Href
    }

    set(href) {
        this.Href = href
    }
}

// const useAPI = (props) => {
//     const [ Data , SetURL ] = useState(null)
//     const [ Error , SetError] = useState(null)

//     useEffect( async ()=>{

//         const Request = (props.type == "post") ? 
//                         {
//                             method: 'post',
//                             headers: {
//                                 'content-type': 'application/json'
//                             },
//                             body: JSON.stringify(props.data)
//                         } : 
//                         (props.type == "get") ?
//                         {
//                             headers: {
//                                 'content-type': 'application/json'
//                             },
//                         } : {}

//         const Api = await fetch(props.url, )
//     })
// }

export {MapsJSX , DayJSX , TimeJSX , TimeDiff , ClosePopUp , useLiff , Camera , ResizeImg , Loading , ButtonMenu , ReportAction , PopupDom , LoadOtherDom , LoadOtherOffset , PatternCheck , DownLoadImage , SetMaxLength , DateSelect , TabLoad , HrefData}