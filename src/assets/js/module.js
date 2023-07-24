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
        const DateIn = new Date(DATE)
        if(TYPE === "full") setDATE(`${DayWeek[DateIn.getDay()]} ที่ ${DateIn.getDate()} ${Mount[DateIn.getMonth()]} ปี พ.ศ. ${DateIn.getFullYear() + 543}`)
        else if (TYPE === "small") setDATE(`${TEXT ? `${TEXT} ` : ""}${DateIn.getUTCDate()} ${Mount[DateIn.getMonth()]} ${DateIn.getFullYear() + 543}`)
        else setDATE(`วันที่ ${DateIn.getDate()} ${Mount[DateIn.getMonth()]} ${DateIn.getFullYear() + 543}`)
    })

    return (<input date_dom="" ref={REF} readOnly value={DateOut}></input>)
}

const TimeJSX = ({DATE , MAX = true}) => {
    const [Time , setTime] = useState("")

    useEffect(()=>{
        const TimeIn = new Date(DATE)
        if(MAX) setTime(`เวลา ${TimeIn.getUTCHours()} นาฬิกา ${TimeIn.getMinutes()} นาที ${TimeIn.getSeconds()} วินาที`)
        else setTime(`เวลา ${TimeIn.getUTCHours()}:${TimeIn.getMinutes() >= 10 ? TimeIn.getMinutes() : `0${TimeIn.getMinutes()}`}`)
    })

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

const Loading = ({size , border , color="green" , animetion = false}) => {
    return (
        <div style={{
            width : isNaN(size) ? size : `${size}px`,
            height : isNaN(size) ? size : `${size}px`,
            overflow : "hidden"
        }}>
            <div className="curcle"
                style={{
                    border: `${isNaN(border) ? border : `${border}px`} solid ${color}`,
                    borderLeft : `${isNaN(border) ? border : `${border}px`} solid transparent`,
                    borderRadius : "50%",
                    width : "100%",
                    height : "100%",
                    animation : animetion ? "rotate-curcle 2s cubic-bezier(0, 0, 0, 0) 0s infinite" : "none"
                }}
            ></div>
        </div>
    )
}

import * as FileSaver from "file-saver"
import XLSX from "sheetjs-style"

const ExportExcel = ({ excelData , fileName , nameBT}) => {
    const filetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = ".xlsx"

    const exportToExcel = async () => {
        const DataExport = new Map()
        const NameSheet = new Array()
        for(let key in excelData){
            let ws = XLSX.utils.json_to_sheet(excelData[key])
            NameSheet.push(key)
            DataExport.set(key , ws)
        }

        const JsonExport = Object.fromEntries(Array.from(DataExport));
        const wb = {Sheets : JsonExport , SheetNames : NameSheet}
        const excelBuffer = XLSX.write(wb , {bookType : "xlsx" , type : "array"})

        
        const data = new Blob([excelBuffer] , {type : filetype})
        FileSaver.saveAs(data , fileName , fileExtension)
    }

    return (
        <button onClick={(e)=>exportToExcel(fileName)}>{nameBT}</button>
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

const PopupDom = ({Ref , Body , zIndex}) => {
    return (
        <section ref={Ref} style={{
            display : "flex",
            justifyContent : "center" ,
            alignItems : "center" ,
            backgroundColor : "transparent" ,
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
        if((await Fetch(newCount)).length === newCount) setCount(newCount)
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

const LoadOtherOffset = ({Fetch , Data , setRow , style = {
    backgroundColor : "",
    fontSize : "18px",
    sizeLoading : "31.2px",
}}) => {
    const [Load , setLoad] = useState(true)
    const Other = async () => {
        setLoad(false)
        const Row = await Fetch(Data.length)
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

export {MapsJSX , DayJSX , TimeJSX , ClosePopUp , useLiff , Camera , ResizeImg , Loading , ExportExcel , ButtonMenu , ReportAction , PopupDom , LoadOtherDom , LoadOtherOffset , TabLoad , HrefData}