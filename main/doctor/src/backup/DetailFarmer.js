import React , {useState , useEffect} from "react"
import { clientMo } from "../../../../src/assets/js/moduleClient"
import { DayJSX , TimeJSX , MapsJSX , ClosePopUp } from "../../../../src/assets/js/module"
import { ShowDetailDoctor } from "./DetailDoctor";

const ShowDetailFarmer = (props) => {
    const [fullname , setFullname] = useState("")
    const [date , setDate] = useState("")
    const [time , setTime] = useState("")
    const [img , setImg] = useState("")
    const [station , setStation] = useState("")
    const [maps , setMaps] = useState("")

    const [doctorID , setDoctorID] = useState("")
    const [Doctor , setDoctor] = useState("")

    useEffect(()=>{
        if(props.status == 1) window.history.pushState({}, null , `/doctor/list?${props.id}`)
        clientMo.post('/doctor/api/doctor/pull' , {
            id : JSON.parse(props.list)[0]['id_table'] , 
            type : true}).then((profile)=>{
                profile = JSON.parse(profile)
                setFullname(profile['fullname'])
                setImg((profile['img']['data'] != '') ? profile['img']['data'] : '/farmer-svgrepo-com.svg')
                setDate(<DayJSX date={profile['date_register']}/>)
                setTime(<TimeJSX time={profile['date_register']}/>)
                setDoctorID(profile['id_doctor'])
                setStation(profile['station'])

                setMaps(<MapsJSX w={200} h={200} lat={profile['location']['x']} lng={profile['location']['y']}/>)
                
                document.getElementById('popup-detail-farmer').setAttribute('show' , "")
            })

        document.getElementById('popup-detail-farmer').addEventListener('click' , ClosePage)

        return () => {
            document.getElementById('popup-detail-farmer').removeEventListener('click' , ClosePage)
            clientMo.post('/api/doctor/form/list')
        }
    } , [])

    const ClosePage = (e) => {
        ClosePopUp(e , "popup-detail-farmer" , ()=>props.listFarm.setState({DetailFarmer:<></>}) , true)
    }

    const ChangeProfile = (id_table) => {
        clientMo.post('/doctor/api/doctor/pull' , {
            id : id_table , 
            type : true}).then((profile)=>{
                profile = JSON.parse(profile)
                
                setFullname(profile['fullname'])
                setImg((profile['img']['data'] != '') ? profile['img']['data'] : '/farmer-svgrepo-com.svg')
                setDate(<DayJSX date={profile['date_register']}/>)
                setTime(<TimeJSX time={profile['date_register']}/>)
                setDoctorID(profile['id_doctor'])
                setStation(profile['station'])

                setMaps(<MapsJSX w={200} h={200} lat={profile['location']['x']} lng={profile['location']['y']}/>)
            })
    }

    const showDoctor = (id_doctor) => {
        clientMo.post('/api/doctor/farmer/approv' , {id:id_doctor}).then((profile)=>{
            setDoctor(<ShowDetailDoctor doctor={profile} id={id_doctor}/>)
        })
    } 

    const showFormFarmer = (id_farmer) => {
        // clientMo.post('/api/doctor/listform' , {id:id_farmer}).then((list)=>{
        //     setDoctor(<ShowFormFarmer list={list} id={id_farmer}/>)
        // })
        console.log(id_farmer)
    } 

    return(
        <>
            <section className="profile-popup">
                <div className="option-page" onClick={()=>window.history.back()}>ย้อนกลับ</div>
                <div className="id">{props.id}</div>
                <div className="profile-detail">
                    <div className="profile-left">
                        
                    </div>
                    <div className="profile-right">
                        <div className="img-profile">
                            <img src={img}></img>
                        </div>
                        <div className="fullname">{fullname}</div>
                        <div className="station">{station}</div>
                        <div className="date">
                            {date}
                        </div>
                        <div className="time">
                            {time}
                        </div>
                        <div className="maps-farm">
                            {maps}
                        </div>
                        <div className="option-farmer-all">
                            <div className="doctor" onClick={()=>showDoctor(doctorID)}>
                                DOCTOR
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="farmer-list-doctor-detail" onClick={(e)=> ClosePopUp(e,"farmer-list-doctor-detail",()=>setDoctor(<></>))}>
                {Doctor}
            </section>
        </>
    )
}

export {ShowDetailFarmer}