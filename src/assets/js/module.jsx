import React, { useEffect, useState } from "react";

const MapsJSX = (props) => {
    return(
        <iframe src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_API_KEY}&q=${props.lat},${props.lng}&zoom=18&maptype=satellite`} 
            width={props.w} height={props.h} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" 
            onClick={Location}
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

export {MapsJSX , DAYUTC , TIMEUTC , ClosePopUp}