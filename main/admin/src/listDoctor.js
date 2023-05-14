import React , {Component} from "react";
import ResizeObserver from "resize-observer-polyfill";
import {clientMo}  from "../../../src/assets/js/moduleClient";

import './assets/style/List.scss'

import SessionOut from "./sesionOut";
import Feedback from "./Feedback";


export default class List extends Component {
    
    constructor(){
        super();
        this.state={
            body : <></>,
            delete : <></>,
            textDetail : <></>
            // list : []
        }
    }

    LoadDetailInput = () => {
        document.querySelectorAll('.doctor-detail .indetail .text-detail').forEach((ele)=>{
            let icon = ele.nextElementSibling
            if(ele.scrollWidth > ele.clientWidth && ele.getAttribute('checktext') == 1 && icon.className == "bt-showDetail") icon.setAttribute('show' , '')
            else icon.removeAttribute('show')
        })
    }

    ShowDetailInput = (e = document.getElementById(''), text) => {
        // check user login
        
        let show = document.getElementById('popup-detail-doctor')
        show.setAttribute('show' , '')
        document.getElementById('popup-detail-doctor').setAttribute(
            'style' 
            , `max-width:${window.innerWidth * 0.8}px; 
                transform: translate(${e.offsetWidth + show.offsetWidth}px, ${e.offsetHeight - show.offsetHeight}px);`)
        console.log()
        this.setState({
            textDetail : <ShowDetail text={text} body={this}/>
        })
    }

    componentDidMount(){
        if (this.props.status == 0) window.history.replaceState({} , null , '/admin/list' )
        else if(this.props.status == 1) window.history.pushState({}, null , '/admin/list')

        this.LoadDetailInput()

        document.getElementById('popup-detail-doctor').setAttribute('style' , `max-width:${window.innerWidth * 0.8}px`)

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.LoadDetailInput()
            });
        });
        resizeObserver.observe(document.getElementById('body-list-doctor'))

        this.setState({
            body : JSON.parse(this.props.list).map((listDT , index) =>
                        <div key={index} className="container-doctor" id={`list-${index}`}>
                            <div className="doctor-detail">
                                <img className="img-doctor" src={(listDT['img_doctor']['data'] != '') ? listDT['img_doctor']['data'] : '/doctor-svgrepo-com.svg'}></img>
                                <div className="content-detail">
                                    <div className="detail-box">
                                        <div className="detail">
                                            <div className="head-detail">ชื่อ - นามสกุล</div>
                                            <div className="indetail">
                                                <input checktext={(listDT['fullname_doctor']) ? 1 : 0} readOnly className="text-detail" value={(listDT['fullname_doctor']) ? listDT['fullname_doctor'] : 'ยังไม่ระบุ'}></input>
                                                <span className="bt-showDetail">
                                                    <img className="img-icon" src="/user-card-id-svgrepo-com.svg" onClick={e => this.ShowDetailInput(e.target , listDT['fullname_doctor'])}></img>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-box">
                                        <div className="detail">
                                            <div className="head-detail">รหัสประจำตัว</div>
                                            <div className="indetail">
                                                <input readOnly className="text-detail" value={listDT['id_doctor']}></input>
                                                <span className="bt-showDetail">
                                                    <img className="img-icon" src="/user-card-id-svgrepo-com.svg" onClick={e => this.ShowDetailInput(e.target , listDT['fullname_doctor'])}></img>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-box">
                                        <div className="detail">
                                            <div className="head-detail">ศูนย์ดูแล</div>
                                            <div className="indetail">
                                                <input readOnly className="text-detail" value={(listDT['station_doctor']) ? listDT['station_doctor'] : "ยังไม่ระบุ"}></input>
                                                <span className="bt-showDetail">
                                                    <img className="img-icon" src="/user-card-id-svgrepo-com.svg" onClick={e => this.ShowDetailInput(e.target , listDT['fullname_doctor'])}></img>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bt-manage">
                                <span className="box-status" onClick={() => this.changeStatus(listDT['id_doctor'] , `status-${index}`)}>
                                    <div className="status" id={`status-${index}`} status={listDT['status_account']}>
                                        <span className="list-status" openstate="">ON</span>
                                        <button 
                                            status={listDT['status_account']} 
                                            className="bt-status"
                                            >
                                            {/* {(listDT['status_account'] == 1) ? "ปิดบัญชี" : "เปิดบัญชี"} */}
                                        </button>
                                        <span className="list-status" closestate="">OFF</span>
                                    </div>
                                </span>
                                <button className="bt-delete" onClick={() => this.deleteAC(listDT['id_doctor'] , index)}>ลบบัญชี</button>
                            </div>
                        </div>
                    ) // use map is create element object
        })

    }

    componentWillUnmount(){
        
    }

    LoadMore = () => {
        // Load list doctor more from DATABASE_DEV
    }

    changeStatus = (id , ele) => {
        let status = document.getElementById(ele).getAttribute('status')
        clientMo.post('/api/admin/changeState' , {ID : id , status:status}).then((result)=>{
            if(result == 1) {
                document.getElementById(ele).setAttribute('status' , (status == 1) ? 0 : 1)
                document.querySelector(`#${ele} button`).setAttribute('status' , (status == 1) ? 0 : 1)
            } else {
                console.log(result)
                if(result == '') {
                    this.props.bodyAdmin.setState({
                        session : <SessionOut main={this.props.main}/>
                    })
    
                    document.getElementById('session').setAttribute('show' , '')
                }
            }
        })
    }

    deleteAC = (id , index) => {
        if(id != "") {
            clientMo.post('/api/admin/check').then((result)=>{
                if(result) {
                    document.getElementById('popup-delete').setAttribute('popup-show' , '')
                    console.log(result)
                    this.setState({
                        delete : <ConfirmDelete main={this.props.main} bodyAdmin={this.props.bodyAdmin} id={id} body={this} index={index}/>
                    })
                } else {
                    this.props.bodyAdmin.setState({
                        session : <SessionOut main={this.props.main}/>
                    })
    
                    document.getElementById('session').setAttribute('show' , '')
                }
            })
        } else {
            
        }
    }

    render() {
        return (
            <section id="body-list-doctor">
                <div id="popup-delete">
                    {this.state.delete}
                </div>
                <div id="popup-detail-doctor">
                    {this.state.textDetail}
                </div>
                {this.state.body}
            </section>
        )
    }
}

class ConfirmDelete extends Component {
    constructor(){
        super();
        this.state={
            Head: "",
            feedback : <Feedback/>,
            check: true,
        }
    }

    functionPasswordInput = (e) => {
        if(e.target.value != "") e.target.setAttribute('style' , 'font-family: main-font; font-size:18pt')
        else e.target.removeAttribute('style')
    }

    cancal = (e) => {
        e.preventDefault()
        document.getElementById('popup-delete').removeAttribute('popup-show')
        setTimeout(()=>{
            this.props.body.setState({
                delete : ""
            })
        } , 1000)
    }

    confirmForm = (e) => {
        e.preventDefault()

        let passwordAdmin = document.getElementById('textbox-confirm')

        if(passwordAdmin.value && this.props.id && this.state.check) {
            this.state.check = false
            passwordAdmin.removeAttribute('requireded')

            clientMo.post('/api/admin/checkUserAction' , {password : passwordAdmin.value , type : 'delete'}).then((value)=>{
                console.log(value)
                if(value === '1') {
                    // action when add complete

                    document.getElementById('feedback').setAttribute('show' , '')
                    clientMo.post('/api/admin/delete' , {ID : this.props.id}).then((feedback)=>{
                        // feedback complete add doctor
                        console.log(feedback)
                        if(feedback == '1') {
                            document.getElementById('img-feedback-correct').setAttribute('show' , '')

                            setTimeout(()=>{
                                document.getElementById('popup-delete').removeAttribute('popup-show')
                                setTimeout(()=>{
                                    this.props.body.setState({
                                        delete : ""
                                    })
                                } , 1000)
                                document.querySelector(`#list-${this.props.index}`).setAttribute('delete' , '')
                                setTimeout(()=>{
                                    document.querySelector(`#list-${this.props.index}`).remove()
                                } , 1100)
                            } , 1700)
                        } else {
                            document.getElementById('img-feedback-error').setAttribute('show' , '')
                        }
                    })
                } else if (value === 'incorrect') {
                    passwordAdmin.setAttribute('placeholder' , 'รหัสผ่านไม่ถูกต้อง')
                    passwordAdmin.setAttribute('requireded' , '')
                    passwordAdmin.value = ""
                    passwordAdmin.removeAttribute('style')
                } else {

                    this.props.bodyAdmin.setState({
                        session : <SessionOut main={this.props.main}/>
                    })
    
                    document.getElementById('session').setAttribute('show' , '')

                }
                this.state.check = true
            })
        } else {
            passwordAdmin.setAttribute('requireded' , '')
        }
    }

    render(){
        return(
            <section id="delete-confirm">
                <bot-head-confirm>ยืนยันการลบบัญชี</bot-head-confirm>
                <section id="feedback">
                    {this.state.feedback}
                </section>
                <section id="bodyForm-confirm">
                    <div id="detail-doctor-delete">
                        <div id="detail-id">
                            {/* <div id="head-id">ID</div> */}
                            <div id="id">{this.props.id}</div>
                        </div>
                        <div id="detail-text">กู้คืนบัญชีได้ภายใน 7 วัน</div>
                    </div>
                    <input id="textbox-confirm" placeholder="รหัสผ่านผู้ดูแล" type="password" onChange={this.functionPasswordInput}></input>
                    <section id="bt-container-confirm">
                        <button type="" id="cancal" onClick={this.cancal}>ยกเลิก</button>
                        <button id="confirm-bt" onClick={this.confirmForm}>ยืนยัน</button>
                    </section>
                </section>
            </section>
        )
    }
}

class ShowDetail extends Component {
    constructor(){
        super()
        this.state = {
            textDetail : ""
        }
    }

    componentDidMount() {
        window.addEventListener('mousedown' , this.removePopup)
        this.setState({
            textDetail : this.props.text
        })
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown' , this.removePopup)
    }

    removePopup = (e) => {
        document.getElementById('popup-detail-doctor').removeAttribute('show')
        if(e.target.id != "show-popup-detail") this.props.body.setState({
            textDetail : <></>
        })
    }

    render() {
        return(
            <div id="show-popup-detail">
                {this.state.textDetail}
            </div>
        )
    }
}