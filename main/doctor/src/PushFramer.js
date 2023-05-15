import React , {Component} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";
import { MapsJSX , DAYUTC, TIMEUTC} from "../../../src/assets/js/module";

import "./assets/style/Push.scss"

// import { ListProfileShow } from "./ListProfileCV";

export default class Push extends Component {

    constructor(){
        super()
        this.state = {
            body : <></>,
            detail : <></>,
        }
    }

    componentDidMount(){
        if(this.props.status == 1) window.history.pushState({}, null , '/doctor/push')
        this.setState({
            body : JSON.parse(this.props.list).map((listFm , index) =>
                        <div key={index} className="container-push" onClick={()=>this.showDetail(listFm['id_table'])}>
                            <img className="img-doctor" src={(listFm['img']['data'] != '') ? listFm['img']['data'] : '/farmer-svgrepo-com.svg'}></img>
                            <div className="detail-content-fm">
                                <div className="name-fm"><input readOnly value={`ชื่อเกษตรกร ${listFm['fullname']}`}></input></div>
                                <div className="date-fm"><DAYUTC date={listFm['date_register']}/></div>
                                <div className="date-fm"><TIMEUTC time={listFm['date_register']}/></div>
                            </div>
                        </div>
                    ) // use map is create element object
        })
    }

    showDetail = (id) => {
        clientMo.post("api/doctor/pull" , {id:id , type:false}).then((profile)=>{
            if(profile) {
                this.setState({
                    detail : <DetailConfirm bodyPush={this} profile={profile} id={id}/>
                })
            }
        })
    }

    close = (e) => {
        
        if(e.target.id == "detail-confirm") {
            document.getElementById('detail-confirm').removeAttribute('show')
            this.setState({
                detail : <></>
            })
        }
    }

    render(){
        return(
            <section id="page-push-doctor">
                <section id="detail-confirm" onClick={this.close}>
                    {this.state.detail}
                </section>
                <section id="list-push-doctor">
                    {this.state.body}
                </section>
            </section>
        )
    }
}

class DetailConfirm extends Component {
    constructor(){
        super()
        this.state = {
            img : <></>,
            detail : <></>,
            // listAll : <></>
        }
    }

    componentDidMount(){
        let profileP = JSON.parse(this.props.profile)
        this.setState({
            img : <img src={(profileP['img']['data'] != '') ? profileP['img']['data'] : '/farmer-svgrepo-com.svg'}></img>,
            detail : 
                    <>
                        <div id="id-profile-confirm">
                            <input type="text" defaultValue={profileP['id_farmer']} autoComplete="off" placeholder="กรอกรหัสประจำตัวเกษตรกร"></input>
                        </div>
                        <div id="fullname-profile-confirm">
                            <input readOnly value={profileP['fullname']}></input>
                        </div>
                        {/* <div id="station-profile-confirm">
                            <input readOnly value={profileP['fullname']}></input>
                        </div> */}
                        <div id="location-profile-confirm">
                            {<MapsJSX w={250} h={250} lat={profileP['location']['x']} lng={profileP['location']['y']}/>}
                        </div>
                        <div id="date-profile-confirm">
                            <div className="date-fm-confirm"><DAYUTC date={profileP['date_register']}/></div>
                            <div className="date-fm-confirm"><TIMEUTC time={profileP['date_register']}/></div>
                        </div>
                        <div id="password-confirm-fm-push">
                            <input autoComplete="off" placeholder="รหัสผ่านเพื่อยืนยัน" type="password"></input>
                        </div>
                        <div id="bt-action-confirm">
                            {/* <button className="cancel" onClick={(e)=>this.close(e,true)}>ยกเลิก</button> */}
                            <button className="cancel" onClick={()=>this.submit(false)}>ไม่อนุมัติ</button>
                            <button className="submit" onClick={()=>this.submit(true)}>อนุมัติ</button>
                        </div>
                    </>,
        })
        // clientMo.post('/api/doctor/listFarmer' , {type : 'list'}).then((farmer)=>{
        //     this.setState({
        //         listAll: <ListProfileShow farmer={JSON.parse(farmer)} DetailConfirm={this}/>
        //     })
        // })
    }

    onLoadComplete = () =>{
        document.getElementById('detail-confirm').setAttribute('show' , '')
        console.log("loadPush")
    }

    submit = async (ansIn) => {
        let id_farmer = document.querySelector("#id-profile-confirm input")
        let passwordDoctor = document.querySelector("#password-confirm-fm-push input")
        let ansConfirm = (ansIn) ? id_farmer.value && passwordDoctor.value : passwordDoctor.value
        if(ansConfirm) {
            const result = await clientMo.post('/doctor/api/doctor/confirmFm' , {
                id : this.props.id,
                farmer : id_farmer.value,
                password : passwordDoctor.value,
                ans : ansIn
            })
            console.log(result)
        } else {
            (!id_farmer.value) ? id_farmer.setAttribute('request' , '') : id_farmer.removeAttribute('request');
            (!passwordDoctor.value) ? passwordDoctor.setAttribute('request' , '') : passwordDoctor.removeAttribute('request');
        }
    }

    close = (e , on=false) => {
        if(e.target.id == "detail-fm-confirm" || e.target.id == "img-list-profile" || on) {
            document.getElementById('detail-confirm').removeAttribute('show')
            this.props.bodyPush.setState({
                detail : <></>
            })
        }
    }

    render() {
        return(
            <section id="detail-fm-confirm" onLoad={this.onLoadComplete} onClick={this.close}>
                <div id="img-list-profile">
                    <div id="img-fm-confirm">
                        {this.state.img}
                    </div>
                    {/* <div id="list-convert-confirm">
                        {this.state.listAll}
                    </div> */}
                </div>
                <div id="detail-profile-confirm">
                    {this.state.detail}
                </div>
            </section>
        )
    }
}