import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/profile/Profile.scss"
import { Loading, ResizeImg } from "../../../../../src/assets/js/module";

const ProfilePage = ({RefPop , setPopup , session , returnToHome , FetchProfileReload}) => {
    const [getProfileOld , setProfileOld] = useState([])
    const [getProfile , setProfile] = useState([])

    const [LoadImage , setLoadImage] = useState(false)
    const [ListStation , setListStation] = useState([])
    const [StateEditName , setStateEditName] = useState(false)
    const [StateEditStation , setStateEditStation] = useState(false)
    const [StateEditPassword , setStateEditPassword] = useState(false)

    const [btEditNot , setbtEditNot] = useState(true)
    const [FetchEditLoad , setFetchEditLoad] = useState(true)

    const Image = useRef()
    const Fullname = useRef()
    const Station = useRef()
    const PasswordNew = useRef()
    const PasswordAgain = useRef()
    const Password = useRef()

    useEffect(()=>{
        setLoadImage(false)
        FetchProfile()
    } , [])

    const FetchProfile = async () => {
        const fetchProfile = await clientMo.get("/api/doctor/profile/get")
        if(fetchProfile) {
            RefPop.current.style.opacity = "1"
            RefPop.current.style.visibility = "visible"
            const dataProfile = JSON.parse(fetchProfile)
            setLoadImage(true)
            setProfile(dataProfile)
            setProfileOld(dataProfile)
        } else session()
    }

    const Close = () => {
        RefPop.current.style.opacity = "0"
        RefPop.current.style.visibility = "hidden"
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const getImageFromClient = async (e) => {
        const file = e.target.files[0]

        setLoadImage(false)
        const image = await ResizeImg(file , 600)
        if(getProfileOld.img_doctor !== image) {
            const resultEdit = await clientMo.postForm("/api/doctor/profile/image/edit" , {
                img : image
            })
            if(resultEdit) {
                setProfileOld((prevent)=>{
                    prevent.img_doctor = image
                    return prevent
                })
                setProfile((prevent)=>{
                    prevent.img_doctor = image
                    return prevent
                })
                FetchProfileReload()
            } else session()
        }
        setLoadImage(true)

        // reader.onload = async (e) => {
        //     const image = await ResizeImg(file , 600)
        //     if(getProfileOld.img_doctor !== image) {
        //         const resultEdit = await clientMo.postForm("/api/doctor/profile/image/edit" , {
        //             img : image
        //         })
        //         if(resultEdit) {
        //             setProfileOld((prevent)=>{
        //                 prevent.img_doctor = image
        //                 return prevent
        //             })
        //             setProfile((prevent)=>{
        //                 prevent.img_doctor = image
        //                 return prevent
        //             })
        //         } else session()
        //     }
        //     setLoadImage(true)
        // }

        // if(file) {
        //     reader.readAsDataURL(file)
        // }
    }

    const CheckEdit = () => {
        const check = 
                    StateEditName ? 
                        getProfileOld.fullname_doctor !== Fullname.current.value && Fullname.current.value && Password.current.value && /^[ก-๙a-zA-Z]+\s[ก-๙a-zA-Z]+$/.test(Fullname.current.value) :
                    StateEditStation ? 
                        getProfileOld.station_doctor !== Station.current.value && Station.current.value && Password.current.value :
                    StateEditPassword ? 
                        PasswordNew.current.value === PasswordAgain.current.value && PasswordNew.current.value && Password.current.value : false

        if(check) {
            setbtEditNot(false)
            return(
                StateEditName ? {
                    value : Fullname.current.value ,
                    password : Password.current.value,
                    type : "name"
                } :
                StateEditStation ? {
                    value : Station.current.value ,
                    password : Password.current.value,
                    type : "station"
                } :
                StateEditPassword ? {
                    value : PasswordNew.current.value ,
                    password : Password.current.value,
                    type : "passwordNew"
                } : {}
            )
        } else {
            setbtEditNot(true)
            return false
        }
    }

    const EnterEdit = async () => {
        const Data = CheckEdit()
        console.log(Data)
        if(Data) {
            setFetchEditLoad(false)
            setbtEditNot(true)
            const Edit = await clientMo.post("/api/doctor/profile/text/edit" , Data)
            if(Edit) {
                if(Edit === "1") {
                    returnToHome()
                    await FetchProfile()
                    FetchProfileReload()
                    setFetchEditLoad(true)
                    setStateEditName(false)
                    setStateEditStation(false)
                    setStateEditPassword(false)
                } else if(Edit === "password") {
                    Password.current.value = ""
                    Password.current.placeholder = "รหัสผ่านไม่ถูกต้อง"
                    if(PasswordNew && PasswordAgain) {
                        PasswordNew.current.value = ""
                        PasswordAgain.current.value = ""
                    }
                    setFetchEditLoad(true)
                }
            } else session()
        }
    }

    return(
        getProfile.length !== 0 ?
            <section className="profile-page">
                <div className="frame-profile">
                    <div className="profile-detail">
                        <div className="frame-head">
                            <span className="head">ข้อมูลส่วนตัว</span>
                            <a className="close" onClick={Close}>
                                <svg viewBox="0 0 30 30">    
                                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                                </svg>
                            </a>
                        </div>
                        <div className="frame-detail">
                            <div className="row-detail">
                                <span className="head-detail img">รูปโปรไฟล์</span>
                                <div className="detail-in-row img">
                                    <div className="frame-img">
                                        { LoadImage ?
                                            <>
                                            {
                                                getProfile.img_doctor ?
                                                <img src={getProfile.img_doctor}></img>
                                                :
                                                <svg viewBox="34 0 335 335">
                                                    <path d="M201.08,49.778c-38.794,0-70.355,31.561-70.355,70.355c0,18.828,7.425,40.193,19.862,57.151 c14.067,19.181,32,29.745,50.493,29.745c18.494,0,36.426-10.563,50.494-29.745c12.437-16.958,19.862-38.323,19.862-57.151 C271.436,81.339,239.874,49.778,201.08,49.778z M201.08,192.029c-13.396,0-27.391-8.607-38.397-23.616 c-10.46-14.262-16.958-32.762-16.958-48.28c0-30.523,24.832-55.355,55.355-55.355s55.355,24.832,55.355,55.355 C256.436,151.824,230.372,192.029,201.08,192.029z"></path> 
                                                    <path d="M201.08,0C109.387,0,34.788,74.598,34.788,166.292c0,91.693,74.598,166.292,166.292,166.292 s166.292-74.598,166.292-166.292C367.372,74.598,292.773,0,201.08,0z M201.08,317.584c-30.099-0.001-58.171-8.839-81.763-24.052 c0.82-22.969,11.218-44.503,28.824-59.454c6.996-5.941,17.212-6.59,25.422-1.615c8.868,5.374,18.127,8.099,27.52,8.099 c9.391,0,18.647-2.724,27.511-8.095c8.201-4.97,18.39-4.345,25.353,1.555c17.619,14.93,28.076,36.526,28.895,59.512 C259.25,308.746,231.178,317.584,201.08,317.584z M296.981,283.218c-3.239-23.483-15.011-45.111-33.337-60.64 c-11.89-10.074-29.1-11.256-42.824-2.939c-12.974,7.861-26.506,7.86-39.483-0.004c-13.74-8.327-30.981-7.116-42.906,3.01 c-18.31,15.549-30.035,37.115-33.265,60.563c-33.789-27.77-55.378-69.868-55.378-116.915C49.788,82.869,117.658,15,201.08,15 c83.423,0,151.292,67.869,151.292,151.292C352.372,213.345,330.778,255.448,296.981,283.218z"></path> 
                                                </svg>
                                            }
                                            <a className="edit-pic" title="แก้ไขรูปโปรไฟล์" onClick={()=>Image.current.click()}>
                                                <svg viewBox="0 0 528.899 528.899">
                                                    <g>
                                                        <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z"/>
                                                    </g>
                                                </svg>
                                            </a>
                                            <input type="file" capture="user" hidden ref={Image} accept="image/jpeg, image/png" onChange={getImageFromClient}></input>
                                            </>
                                            : <Loading size={30} border={4} color="#16836f" animetion={true}/>
                                        }
                                    </div> 
                                </div>
                            </div>
                            <div className="row-detail">
                                <div className="head-content">
                                    <span className="head-detail">ชื่อ - นามสกุล</span>
                                    { !StateEditName ?
                                        !StateEditStation && !StateEditPassword?
                                            <a onClick={()=>{
                                                setStateEditName(true)
                                                setStateEditStation(false)
                                                setStateEditPassword(false)
                                                setbtEditNot(true)
                                                if(Password.current) Password.current.value = ""
                                            }}>แก้ไข</a> : <></>
                                        : <a onClick={()=>setStateEditName(false)}>ยกเลิก</a>
                                    }
                                </div>
                                { StateEditName ?
                                    <input ref={Fullname} onChange={CheckEdit} className="detail-input" defaultValue={getProfile.fullname_doctor}></input>
                                    : 
                                    <div className="detail-in-row">
                                        {getProfile.fullname_doctor}
                                    </div>
                                }
                            </div>
                            <div className="row-detail not-bm">
                                <div className="head-content">
                                    <span className="head-detail">ศูนย์ที่ทำงาน</span>
                                    { !StateEditStation ?
                                        !StateEditName && !StateEditPassword ?
                                            <a onClick={async ()=>{
                                                setbtEditNot(true)
                                                if(Password.current) Password.current.value = ""
                                                const station = await clientMo.post("/api/doctor/station/list")
                                                if(station) {
                                                    setListStation(JSON.parse(station))
                                                    setStateEditStation(true)
                                                    setStateEditName(false)
                                                    setStateEditPassword(false)
                                                } else session()
                                            }}>แก้ไข</a> : <></>
                                        : <a onClick={()=>setStateEditStation(false)}>ยกเลิก</a>
                                    }
                                </div>
                                { StateEditStation ?
                                    <select ref={Station} className="detail-input" onChange={CheckEdit} defaultValue={getProfile.station_doctor}>
                                        <option disabled value={""}>เลือกศูนย์</option>
                                        { ListStation.map((val)=>
                                            <option key={val.id} value={val.id}>{val.name}</option>
                                        )
                                        }
                                    </select>
                                    :
                                    <div className="detail-in-row">
                                        {getProfile.name_station}
                                    </div>
                                }
                            </div>
                            { !StateEditName && !StateEditStation ?
                                <div className="row-detail not-bm head-bm">
                                    <div className="head-content right">
                                        { !StateEditPassword ?
                                            <a onClick={()=>{
                                                setStateEditName(false)
                                                setStateEditStation(false)
                                                setStateEditPassword(true)
                                                setbtEditNot(true)
                                                if(Password.current) Password.current.value = ""
                                            }}>เปลี่ยนรหัสผ่าน</a>
                                            : 
                                            <a onClick={()=>setStateEditPassword(false)}>ยกเลิก</a>
                                        }
                                    </div>
                                    { StateEditPassword ?
                                        <>
                                        <input className="input-password bt" onChange={CheckEdit} type="password" ref={PasswordNew} placeholder="รหัสผ่านใหม่" defaultValue={""}></input>
                                        <input className="input-password" onChange={CheckEdit} type="password" ref={PasswordAgain} placeholder="รหัสผ่านใหม่อีกครั้ง" defaultValue={""}></input>
                                        </>
                                        : <></>
                                    }
                                </div> : <></>
                            }
                        </div>
                        { StateEditName || StateEditStation || StateEditPassword ?
                            <div className="content-check-edit">
                                <div className="input-edit">
                                    <input className="input-password" onChange={CheckEdit} type="password" ref={Password} placeholder="รหัสผ่านเจ้าหน้าที่"></input>
                                </div>
                                <div className="bt-edit">
                                    { FetchEditLoad ?
                                        <button onClick={EnterEdit} no={btEditNot ? "" : null}>ยืนยัน</button> :
                                        <div className="bt-loading">
                                            <Loading size={20} border={3} color="white" animetion={true}/>
                                        </div>
                                    }
                                </div>
                            </div>
                            : <></>
                        }
                    </div>
                </div>
            </section> : 
            <Loading size={70} border={8} color="#16836f" animetion={true}/>
    )
}

export default ProfilePage