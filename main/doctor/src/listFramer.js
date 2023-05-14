import React , {Component, useEffect, useState} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";
import { DAYUTC, MapsJSX, TIMEUTC } from "../../../src/assets/js/module";

import './assets/style/ListFarmer.scss'

const closePopUp = (e , id , stateChange , back=false) => {
    if(e.target.id === id) {
        document.getElementById(id).removeAttribute('show')
        stateChange()
    }

    if(e.target.id === id && back) {
        window.history.back()
    }
}

export default class List extends Component {

    constructor(){
        super();
        this.state={
            body : <></>,
            delete : <></>,
            DetailFarmer : <></>
            // list : []
        }
    }

    componentDidMount() {
        window.addEventListener('popstate', this.checkPage)
        this.checkPage()

        this.setState({
            body : JSON.parse(this.props.list).map((listFm , index) =>
                        <div key={index} className="container-fm" onClick={()=>this.ShowDetail(listFm['id_farmer'] , 1)}>
                            <div className="img-list-farmer">
                                <img width={70} src={(listFm['img']['data'] != '') ? listFm['img']['data'] : '/farmer-svgrepo-com.svg'}></img>
                            </div>
                            <div className="detail-list-farmer">
                                <input className="id" readOnly value={listFm['id_farmer']}></input>
                                <input className="fullname" readOnly value={listFm['fullname']}></input>
                            </div>
                            <div className="count-account-list-farmer">
                                {listFm['CountFM']}
                            </div>
                        </div>
                    ) // use map is create element object
        })
    }

    componentWillUnmount(){
        window.removeEventListener('popstate', this.checkPage)
    }

    checkPage = () => {
        if(window.location.href.split('?')[1] == undefined) {
            if (this.props.status == 0) window.history.replaceState({} , null , '/doctor/list')
            else if(this.props.status == 1) window.history.pushState({}, null , '/doctor/list')
            this.setState({
                DetailFarmer:<></>
            })

            document.getElementById('popup-detail-farmer').removeAttribute('show')
        } else {
            this.ShowDetail(window.location.href.split('?')[1] , 0)
        }
    }

    ShowDetail = async (id , status) => {
        const result = await clientMo.post('/api/doctor/listFarmer' , {
            type:'profile',
            farmer : id
        })

        this.setState({
            DetailFarmer : <ShowDetailFarmer list={result} status={status} main={this.props.main} id={id}/>
        })
    }

    render() {
        return(
            <div id="list-farmer-success">
                <div id="list">
                    {this.state.body}
                </div>
                <div id="popup-detail-farmer" onClick={(e)=>closePopUp(e , "popup-detail-farmer" , ()=>this.setState({DetailFarmer:<></>}) , true)}>
                    {this.state.DetailFarmer}
                </div>
            </div>
        )
    }
}

const ShowDetailFarmer = (props) => {
    const [fullname , setFullname] = useState("")
    const [date , setDate] = useState("")
    const [time , setTime] = useState("")
    const [img , setImg] = useState("")
    const [maps , setMaps] = useState("")

    const [doctorID , setDoctorID] = useState("")
    const [Doctor , setDoctor] = useState("")
    const [SelectList , setList] = useState("")

    useEffect(()=>{
        if(props.status == 1) window.history.pushState({}, null , `/doctor/list?${props.id}`)
        clientMo.post('/doctor/api/doctor/pull' , {
            id : JSON.parse(props.list)[0]['id_table'] , 
            type : true}).then((profile)=>{
                profile = JSON.parse(profile)
                setFullname(profile['fullname'])
                setImg((profile['img']['data'] != '') ? profile['img']['data'] : '/farmer-svgrepo-com.svg')
                setDate(<DAYUTC date={profile['date_register']}/>)
                setTime(<TIMEUTC time={profile['date_register']}/>)
                setDoctorID(profile['id_doctor'])

                setMaps(<MapsJSX w={200} h={200} lat={profile['location']['x']} lng={profile['location']['y']}/>)
                
                document.getElementById('popup-detail-farmer').setAttribute('show' , "")
            })
    } , [])

    const ChangeProfile = (id_table) => {
        clientMo.post('/doctor/api/doctor/pull' , {
            id : id_table , 
            type : true}).then((profile)=>{
                profile = JSON.parse(profile)
                
                setFullname(profile['fullname'])
                setImg((profile['img']['data'] != '') ? profile['img']['data'] : '/farmer-svgrepo-com.svg')
                setDate(<DAYUTC date={profile['date_register']}/>)
                setTime(<TIMEUTC time={profile['date_register']}/>)
                setDoctorID(profile['id_doctor'])

                setMaps(<MapsJSX w={200} h={200} lat={profile['location']['x']} lng={profile['location']['y']}/>)
            })
    }

    const showDoctor = (id_doctor) => {
        clientMo.post('/api/doctor/profileDoctor' , {id:id_doctor}).then((profile)=>{
            setDoctor(<ShowDetailDoctor doctor={profile} id={id_doctor}/>)
        })
    } 

    return(
        <>
            <section className="profile-popup">
                <div className="option-page">ย้อนกลับ</div>
                <div className="id">{props.id}</div>
                <div className="profile-detail">
                    <div className="profile-left">
                        <div className="list-select">
                            {
                                JSON.parse(props.list).map((list , index)=>
                                    <div key={index} onClick={()=>ChangeProfile(list['id_table'])}>
                                        {(index == 0) ? "ล่าสุด" : index + 1}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="profile-right">
                        <div className="img-profile">
                            <img src={img}></img>
                        </div>
                        <div className="fullname">{fullname}</div>
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
                            <div className="form-farmer">
                                FORM
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="farmer-list-doctor-detail" onClick={(e)=> closePopUp(e,"farmer-list-doctor-detail",()=>setDoctor(<></>))}>
                {Doctor}
            </section>
        </>
    )
}

const ShowDetailDoctor = (props) => {

    const [List , setList] = useState("")

    useEffect(()=>{
        let profile = JSON.parse(props.doctor)[0]
        setList(
        <>
            <div className="img">
                <img src={(profile['img_doctor']['data'] != '') ? profile['img_doctor']['data'] : '/doctor-svgrepo-com.svg'}></img>
            </div>
            <div className="detail-doctor">
                <div className="id">
                    {props.id}
                </div>
                <div className="fullname">
                    {profile['fullname_doctor']}
                </div>
            </div>
        </>
        )
        document.getElementById('farmer-list-doctor-detail').setAttribute('show' , "")
    } , [])

    return(
        <section className="profile-doctor">
            {List}
        </section>
    )
}