import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff"

const MapsJSX = (props) => {
    const [latitude , setLag] = useState(0)
    const [longtitude , setLng] = useState(0)

    useEffect(()=>{
        setLag(props.lat)
        setLng(props.lng)
        console.log(props.lat , props.lng)
    } , [])
    return(
        <iframe src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_API_KEY}&q=${latitude},${longtitude}&zoom=18&maptype=satellite`} 
           frameBorder={0} width={props.w} height={props.h} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    )
}

const DAYUTC = (props) => {
    const [DateOut , setDATE] = useState("")
    const DayWeek = [ 'วันอาทิตย์','วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัสบดี','วันศุกร์','วันเสาร์'] 
    const Mount = [ "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"] 

    useEffect(()=>{
        const DateIn = new Date(props.date)
        setDATE(`${DayWeek[DateIn.getUTCDay()]} ที่ ${DateIn.getUTCDate()} ${Mount[DateIn.getUTCMonth()]} ปี พ.ศ. ${DateIn.getUTCFullYear() + 543}`)
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

const Camera = (props) => {
    const [StatusCamera , setStatus] = useState(false)
    const [BodyCamera , setBody] = useState(<></>)
    const ContentCamera = useRef()
    const PreviewCamera = useRef()

    useEffect(()=>{
        props.control.current.addEventListener('click' , CameraOnOff)
        console.log(props.img)
    } , [])

    const CameraOnOff = () => {
        if(!StatusCamera) {
            ContentCamera.current.style.opacity = '1'
            ContentCamera.current.style.visibility = 'visible'
            setBody(<video ref={PreviewCamera}></video>)
            setStatus(true)
        } else {
            ContentCamera.current.style.opacity = '0'
            ContentCamera.current.style.visibility = 'hidden'
            setBody(<></>)
            setStatus(false)
        }
    }

    return(
        <div ref={ContentCamera} className="content-camera" style={{
            display:"flex",
            position:"absolute",
            justifyContent:"center",
            alignItems:"center",
            width:"100%",
            height:"100%",
            top:"0",
            bottom:"0",
            backgroundColor:"#000000c9",
            backdropFilter:"blur(8px)",
            zIndex:100,

            transition:"0.5s opacity , 0.5s visibility",
            opacity:0,
            visibility:"hidden"
        }} onClick={CameraOnOff}>
            {BodyCamera}
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

export {MapsJSX , DAYUTC , TIMEUTC , ClosePopUp , useLiff , Camera}