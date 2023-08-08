import React, { useEffect, useRef, useState } from "react";
import { MapsJSX, PatternCheck } from "../../../../../../src/assets/js/module";
import { clientMo } from "../../../../../../src/assets/js/moduleClient";

const EditProfile = ({DataProfile , session , CheckEditFun}) => {
    const [Lag , setLag] = useState(0)
    const [Lng , setLng] = useState(0)

    const [getListStation , setListStation] = useState([])

    const Image = useRef()
    const ImageSh = useRef()
    const id_farmer = useRef()
    const fullname = useRef()
    // const lagRef = useRef()
    // const lngRef = useRef()
    const station = useRef()
    const newPassword = useRef()

    useEffect(()=>{
        FetchStation()
    } , [])

    const FetchStation = async () => {
        setLag(DataProfile.location.x)
        setLng(DataProfile.location.y)
        const StationFetch = await clientMo.post("/api/doctor/station/list")
        try {
            const search = new Array
            JSON.parse(StationFetch).map(val=>{
                let lag = Math.abs(DataProfile.location.x - val.location.x)
                let lng = Math.abs(DataProfile.location.y - val.location.y)
                search.push({id : val.id , name : val.name , dist : lag + lng})
            })
            
            setListStation(search.sort((a , b)=>a.dist - b.dist).slice(0 , 2))
        } catch(e) { session() }
    }

    const getMapAndStation = async (e) => {
        try {
            let Location = e.target.value.split("/").filter((val)=>val.indexOf("data") >= 0)
            if(Location[0]) {
                Location = Location[0].split("!").filter((val)=>val.indexOf("3d") >= 0 || val.indexOf("4d") >= 0).reverse().slice(0 , 2)
            }
            if(Location.length == 2) {
                let lag = Location[1].split(".")
                lag[0] = lag[0].replace("3d" , "")
                for(let x=7; x>=4 ; x--) {
                    lag[1] = lag[1].slice(0 , x)
                    if(!isNaN(lag[1])) break
                }
        
                let lng = Location[0].split(".")
                lng[0] = lng[0].replace("4d" , "")
                for(let x=7; x>=4 ; x--) {
                    lng[1] = lng[1].slice(0 , x)
                    if(!isNaN(lng[1])) break
                }
        
                const Lagitude = lag.join(".")
                const Longitude = lng.join(".")
                if(!isNaN(Lagitude) && !isNaN(Longitude)) {
                    setLag(Lagitude)
                    setLng(Longitude)
                    // setListStation([])
                    const StationFetch = await clientMo.post("/api/doctor/station/list")
                    const search = new Array
                    JSON.parse(StationFetch).map(val=>{
                        let lag = Math.abs(Lagitude - val.location.x)
                        let lng = Math.abs(Longitude - val.location.y)
                        search.push({id : val.id , name : val.name , dist : lag + lng})
                    })
                    
                    setListStation(search.sort((a , b)=>a.dist - b.dist).slice(0 , 2))
                    return { lag : Lagitude , lng : Longitude }
                }
            } else {
                setLag(DataProfile.location.x)
                setLng(DataProfile.location.y)
                // setListStation([])
                return { lag : DataProfile.location.x , lng : DataProfile.location.y }
            }
        } catch(e) { session() }
    }

    const CheckEdit = (Position) => {

        const lagIn = Position ? Position.lag : Lag
        const lngIn = Position ? Position.lng : Lng

        const ckImage = Image.current.files[0] && UpdateImageClient(Image.current) != String.fromCharCode(...DataProfile.img.data)
        const ckID = id_farmer.current.value && id_farmer.current.value != DataProfile.id_farmer
        const ckName = PatternCheck(fullname.current.value).fullname && fullname.current.value && fullname.current.value != DataProfile.fullname
        const ckLocation = lagIn != 0 && lngIn != 0 
                            && (lagIn != DataProfile.location.x || lngIn != DataProfile.location.y)
        const ckStation = station.current.value && station.current.value != DataProfile.station
        const ckPassword = newPassword.current.value

        if(ckID || ckName || ckLocation || ckStation || ckPassword || ckImage) {
            const DataUpdate = {
                img : Image.current.files[0],
                id_farmer : id_farmer.current.value,
                fullname : fullname.current.value,
                lag : lagIn,
                lng : lngIn,
                station : station.current.value,
                newPassword : newPassword.current.value,
            }

            if(!ckID) delete DataUpdate.id_farmer
            if(!ckName) delete DataUpdate.fullname
            if(!ckLocation) { 
                delete DataUpdate.lag 
                delete DataUpdate.lng
            }
            if(!ckStation) delete DataUpdate.station
            if(!ckPassword) delete DataUpdate.newPassword
            if(!ckImage) delete DataUpdate.img

            CheckEditFun(DataUpdate)
        } else {
            CheckEditFun("")
        }
    }

    const UpdateImageClient = (e) => {
        const file = e.files[0]
        if(file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                ImageSh.current.src = e.target.result
                return e.target.result
            }
            reader.readAsDataURL(file)
        }
    }

    return(
        <div className="detail-account-data edit">
            <div className="img">
                <div className="frame-img">
                    <img ref={ImageSh} src={DataProfile.img.data ? String.fromCharCode(...DataProfile.img.data) : "/doctor-svgrepo-com.svg"}></img>
                    <a className="edit-pic" title="แก้ไขรูปโปรไฟล์" onClick={()=>Image.current.click()}>
                        <svg viewBox="0 0 528.899 528.899">
                            <g>
                                <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z"/>
                            </g>
                        </svg>
                    </a>
                    <input type="file" onChange={(e)=>{
                        CheckEdit("")
                        UpdateImageClient(e.target)
                    }} hidden ref={Image} accept="image/jpeg, image/png"></input>
                </div>
            </div>
            <div className="text-detail">
                <span>รหัสประจำตัวเกษตรกร</span>
                <div className="frame-text">
                    <input onChange={()=>CheckEdit("")} placeholder="เช่น 11630500" ref={id_farmer} defaultValue={DataProfile.id_farmer}></input>
                </div>
            </div>
            <div className="text-detail">
                <span>ชื่อ - นามสกุล</span>
                <div className="frame-text">
                    <input onChange={()=>CheckEdit("")} placeholder="เช่น สมชาย ใจดี" ref={fullname} defaultValue={DataProfile.fullname}></input>
                </div>
            </div>
            <div className="text-detail">
                <span>ที่อยู่ปัจจุบัน</span>
                <div>
                    <MapsJSX lat={Lag} lng={Lng} w={"100%"} h={"10%"}/>
                </div>
                <div className="frame-text">
                    <input onChange={ async (e)=>{
                        const Position = await getMapAndStation(e)
                        CheckEdit(Position)
                    }} placeholder="Url ที่ปักหมุดแดง" defaultValue={""}></input>
                </div>
            </div>
            <div className="text-detail">
                <span>ศูนย์ที่อยู่ในการดูแล</span>
                <div className="frame-text">
                    { getListStation.length != 0 ?
                        <select onChange={()=>CheckEdit("")} defaultValue={DataProfile.station} ref={station}>
                            <option value={""}>เลือกศูนย์</option>
                            { 
                                getListStation.map(val=>
                                    <option key={val.id} value={val.id}>{val.name}</option>
                                )
                            }
                        </select>
                        : <></>
                    }
                </div>
            </div>
            <div className="text-detail">
                <span>รหัสผ่านเกษตกร</span>
                <div className="frame-text">
                    <input onChange={()=>CheckEdit("")} placeholder="กรอกรหัสผ่านใหม่" type="password" ref={newPassword} defaultValue={""}></input>
                </div>
            </div>
        </div>
    )
}

export default EditProfile