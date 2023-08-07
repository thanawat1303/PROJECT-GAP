import React, { useEffect, useRef, useState } from "react";
import { MapsJSX, PatternCheck } from "../../../../../../src/assets/js/module";
import { clientMo } from "../../../../../../src/assets/js/moduleClient";

const EditProfile = ({DataProfile , session , CheckEditFun}) => {
    const [Lag , setLag] = useState(0)
    const [Lng , setLng] = useState(0)

    const [getListStation , setListStation] = useState([])

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

        const ckID = id_farmer.current.value && id_farmer.current.value != DataProfile.id_farmer
        const ckName = PatternCheck(fullname.current.value).fullname && fullname.current.value && fullname.current.value != DataProfile.fullname
        const ckLocation = lagIn != 0 && lngIn != 0 
                            && (lagIn != DataProfile.location.x || lngIn != DataProfile.location.y)
        const ckStation = station.current.value && station.current.value != DataProfile.station
        const ckPassword = newPassword.current.value

        if(ckID || ckName || ckLocation || ckStation || ckPassword) {
            const DataUpdate = {
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

            CheckEditFun(DataUpdate)
        } else {
            CheckEditFun("")
        }
    }

    return(
        <div className="detail-account-data edit">
            <div className="img">
                <img src={DataProfile.img.data ? String.fromCharCode(...DataProfile.img.data) : "/doctor-svgrepo-com.svg"}></img>
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