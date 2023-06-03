import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff"

const MapsJSX = (props) => {
    const [latitude , setLag] = useState(0)
    const [longtitude , setLng] = useState(0)

    useEffect(()=>{
        setLag(props.lat)
        setLng(props.lng)
    } , [])
    return(
        <iframe src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_API_KEY}&q=${latitude},${longtitude}&zoom=18&maptype=satellite`} 
           frameBorder={0} width={props.w} height={props.h} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    )
}

const DAYUTC = ({DATE , TYPE = "full"}) => {
    const [DateOut , setDATE] = useState("")
    const DayWeek = [ 'วันอาทิตย์','วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัสบดี','วันศุกร์','วันเสาร์'] 
    const Mount = [ "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"] 

    useEffect(()=>{
        const DateIn = new Date(DATE)
        if(TYPE === "full") setDATE(`${DayWeek[DateIn.getUTCDay()]} ที่ ${DateIn.getUTCDate()} ${Mount[DateIn.getUTCMonth()]} ปี พ.ศ. ${DateIn.getUTCFullYear() + 543}`)
        else setDATE(`วันที่ ${DateIn.getUTCDate()} ${Mount[DateIn.getUTCMonth()]} ${DateIn.getUTCFullYear() + 543}`)
    })

    return (<input readOnly value={DateOut}></input>)
}

const TIMEUTC = (props) => {
    const [Time , setTime] = useState("")

    useEffect(()=>{
        const TimeIn = new Date(props.time)
        setTime(`เวลา ${TimeIn.getUTCHours()} นาฬิกา ${TimeIn.getUTCMinutes()} นาที ${TimeIn.getUTCSeconds()} วินาที`)
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

const Loading = ({size , border , color="green"}) => {
    return (
        <div style={{
            width : `${size}px`,
            height : `${size}px`
        }} className="Loading">
            <div className="curcle"
                style={{
                    border: `${border}px solid ${color}`,
                    borderLeft : `${border}px solid transparent`,
                    borderRadius : "50%",
                    width : "100%",
                    height : "100%",
                    animation : "rotate-curcle 2s cubic-bezier(0, 0, 0, 0) 0s infinite"
                }}
            ></div>
        </div>
    )
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

export {MapsJSX , DAYUTC , TIMEUTC , ClosePopUp , useLiff , Camera , ResizeImg , Loading}