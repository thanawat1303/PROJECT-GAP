import React , {Component} from "react";
import {clientMo}  from "./assets/js/moduleClient";

import './assets/style/List.scss'

import SessionOut from "./sesionOut";
import Feedback from "./Feedback";


export default class List extends Component {
    
    constructor(){
        super();
        this.state={
            body : <></>,
            delete : <></>
            // list : []
        }
    }

    moreDetail = () => {
        let maxsize = document.querySelector('.docter-detail').clientWidth 
                - document.querySelector('.docter-detail .img-docter').clientWidth 
                - document.querySelector('.docter-detail .head-detail').clientWidth 
                - 10

        // document.querySelectorAll('.docter-detail .detail .indetail').forEach((v , index)=>{
        //     v.setAttribute('style' , `max-width:${maxsize}px`)
        // })
        
        console.log(document.querySelector('.docter-detail').clientWidth , document.querySelector('.docter-detail .img-docter').clientWidth , document.querySelector('.docter-detail .head-detail').clientWidth)
    }

    componentDidMount(){
        if (this.props.status == 0) window.history.replaceState({} , null , '/list' )
        else if(this.props.status == 1) window.history.pushState({}, null , '/list')

        window.addEventListener('resize',this.moreDetail)

        this.setState({
            body : JSON.parse(this.props.list).map((listDT , index) =>
                        <div key={index} className="container-docter" id={`list-${index}`}>
                            <div className="docter-detail">
                                <img className="img-docter" src={(listDT['Image_docter']['data'] != '') ? listDT['Image_docter']['data'] : '/doctor-svgrepo-com.svg'}></img>
                                <div className="content-detail">
                                    <div className="detail-box">
                                        <div className="detail">
                                            <div className="head-detail">ชื่อ - นามสกุล</div>
                                            <div className="indetail">
                                                <div className="text-detail">
                                                    {(listDT['Fullname_docter']) ? listDT['Fullname_docter'] : 'ยังไม่ระบุ'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-box">
                                        <div className="detail">
                                            <div className="head-detail">รหัสประจำตัว</div>
                                            <div className="indetail">
                                                <div className="text-detail">
                                                    {listDT['id_docter']}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-box">
                                        <div className="detail">
                                            <div className="head-detail">ศูนย์ดูแล</div>
                                            <div className="indetail">
                                                <div className="text-detail">{(listDT['Job_care_center']) ? listDT['Job_care_center'] : "ยังไม่ระบุ"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bt-manage">
                                <span className="box-status" onClick={() => this.changeStatus(listDT['id_docter'] , `status-${index}`)}>
                                    <div className="status" id={`status-${index}`} status={listDT['Status_account']}>
                                        <span className="list-status" openstate="">ON</span>
                                        <button 
                                            status={listDT['Status_account']} 
                                            className="bt-status"
                                            >
                                            {/* {(listDT['Status_account'] == 1) ? "ปิดบัญชี" : "เปิดบัญชี"} */}
                                        </button>
                                        <span className="list-status" closestate="">OFF</span>
                                    </div>
                                </span>
                                <button className="bt-delete" onClick={() => this.deleteAC(listDT['id_docter'] , index)}>ลบบัญชี</button>
                            </div>
                        </div>
                    ) // use map is create element object
        })

    }

    componentWillUnmount(){
        window.removeEventListener('resize' , this.moreDetail)
    }

    LoadMore = () => {
        // Load list docter more from database
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
            <section id="body-list-docter" onLoad={this.moreDetail}>
                <div id="popup-delete">
                    {this.state.delete}
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
                        // feedback complete add docter
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
                    <div id="detail-docter-delete">
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