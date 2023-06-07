import React , {Component} from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";

import SessionOut from "../sesionOut";
import Feedback from "../Feedback";

import './assets/style/Plus.scss'

export default class Plus extends Component {
    constructor(){
        super();
        this.state={
            bodyConfirm : <div></div>,
        }
    }

    componentDidMount(){
        if(this.props.status == 1) window.history.pushState({}, null , '/admin/plus')
        else {
            // if(window.location.pathname == '/admin/plus/confirm') {
            //     window.history.pushState({}, null , '/admin/plus')
            //     // check session confirm doctor 
            // } else window.history.pushState({}, null , '/admin/plus')
        }
    }

    ShowPassword = (e) => {
        let input = e.target.previousSibling
        if(input.value) {
            input.removeAttribute('put')
            input.setAttribute('type' , 'text')
        }
        e.target.setAttribute('src' , '/eye-open-svgrepo-com.svg')
    }

    hidePassword = (e) => {
        let input = e.target.previousSibling
        if(input.value) {
            input.setAttribute('put' , '')
            input.setAttribute('type' , 'password')
        }
        e.target.setAttribute('src' , '/eye-closed-svgrepo-com.svg')
    }

    functionUserInput = (e) => {
        // if(e.target.value && document.querySelector('#Pform #password').value) {
        //     document.getElementById('password-again').removeAttribute('readOnly')
        // } else {
        //     let eleBox = document.getElementById('password-box-again')
        //     let eleInput = document.getElementById('password-again')
        //     eleBox.removeAttribute('requireded')
        //     eleInput.removeAttribute('style')
        //     eleInput.value = ""
        //     eleInput.setAttribute('readOnly' , "")
        // }

        e.target.parentElement.removeAttribute('requireded')
    }

    functionPasswordInput = (e) => {
        if(e.target.value) e.target.setAttribute('put' , '')
        else e.target.removeAttribute('put')

        if(e.target.type == "text") e.target.setAttribute('type' , 'password')
        // if(document.querySelector('#Pform #user-id').value && document.querySelector('#Pform #password').value) {
        //     document.getElementById('password-again').removeAttribute('readOnly')
        // } else {
        //     let eleBox = document.getElementById('password-box-again')
        //     let eleInput = document.getElementById('password-again')
        //     eleBox.removeAttribute('requireded')
        //     eleInput.removeAttribute('style')
        //     eleInput.value = ""
        //     document.getElementById('password-again').setAttribute('readOnly' , "")
        // }

        e.target.parentElement.removeAttribute('requireded')
    }

    // functionPasswordAgInput = (e) => {
    //     if(e.target.value != "") e.target.setAttribute('style' , 'font-family: main-font; font-size:16pt')
    //     else e.target.removeAttribute('style')
    // }

    Psubmit = (e) => {
        e.preventDefault()

        for(let x=0; x <= 1; x++)
                e.target[x].parentElement.removeAttribute('requireded')

        if(e.target[0].value && e.target[1].value 
            // && e.target[2].value
            )  {
            // if(e.target[1].value == e.target[2].value) {
                clientMo.post('/api/admin/chkOver' , { ID : e.target[0].value}).then((context)=>{
                    if(context === '1') {

                        // check user overlape
                        this.setState({
                            bodyConfirm : <Confirm main={this.props.main} body={this} state={1} user={e.target[0].value} password={e.target[1].value} bodyAdmin={this.props.bodyAdmin}/>
                        })

                        // reset border error
                        e.target[0].value = e.target[1].value = ""
                        // = e.target[2].value = ""
                        e.target[1].removeAttribute('put')

                        // document.getElementById('password-again').setAttribute('readOnly' , "")
                        // document.querySelector('#Pform .error-notM').removeAttribute('style')

                        document.getElementById('popup-confirm').setAttribute('popup-show' , "")
                    } else if (context === 'over') {
                        console.log('overlape')
                    } else if (context) {
                        console.log('system error')
                    }
                    
                    else 
                        {
                            this.props.bodyAdmin.setState({
                                session : <SessionOut main={this.props.main}/>
                            })
            
                            document.getElementById('session').setAttribute('show' , '')
                        }
    
                })
            // } else {
            //     e.target[2].parentElement.setAttribute('requireded' , "")
            //     document.querySelector('#Pform .error-notM').setAttribute('style' , 'opacity:1;visibility:visible;')
            // }
        } else {
            // if(document.getElementById('password-again').getAttribute('readOnly') == ""){

                // reset border
                for(let x=0; x <= 1; x++)
                    (e.target[x].value == "") ? e.target[x].parentElement.setAttribute('requireded' , "") : e.target[x].parentElement.removeAttribute('requireded')
            
            // } else {
            //     document.querySelector('#Pform .error-notM').removeAttribute('style')
            //     e.target[2].parentElement.setAttribute('requireded' , "")
            // }
        }
    }

    render() {
        return (
            <div id="content-plus">
                <form autoComplete="off" id="Pform" onSubmit={this.Psubmit}>
                    <Bot-head-form>เพิ่มบัญชีเจ้าหน้าที่ส่งเสริม</Bot-head-form>
                    <label id="id" className="textbox-Pform">
                        <input placeholder="รหัสประตัวผู้ส่งเสริม" id="user-id" type="text" onChange={this.functionUserInput}></input>
                        {/* <img className="label-Pform" src="/user-svgrepo-com.svg"></img> */}
                    </label>
                    <label id="password-box" className="textbox-Pform">
                        <input placeholder="รหัสผ่านของผู้ส่งเสริม" id="password" type="password" onChange={this.functionPasswordInput}></input>
                        <img onTouchStart={this.ShowPassword} onMouseDown={this.ShowPassword} onMouseUp={this.hidePassword} className="label-Pform" id="action-password" src="/eye-closed-svgrepo-com.svg"></img>
                    </label>
                    {/* <label id="password-box-again" className="textbox-Pform">
                        <input placeholder="รหัสผ่านอีกครั้ง" id="password-again" type="password" onChange={this.functionPasswordAgInput} readOnly></input>
                    </label> */}
                    <button type="submit" className="bTplus bt-submit-form">
                        เพิ่มข้อมูล
                    </button>
                    {/* <span className="error-notM">** รหัสผ่านไม่ตรงกัน **</span> */}
                </form>
                <section id="popup-confirm">
                    {this.state.bodyConfirm}
                </section>
            </div>
        )
    }
}

class Confirm extends Component {

    constructor(){
        super();
        this.state={
            Head: "",
            feedback : <Feedback/>,
            check: true,
        }
    }

    sizeFeedBack = () => {
        if(window.innerWidth <= 460) {
            let body = document.querySelector('#plus-confirm #bodyForm-confirm')
            let head = document.querySelector('#plus-confirm bot-head-confirm')
            let feedback = document.querySelector('#plus-confirm #feedback')

            feedback.setAttribute('style' , `
                width:${body.clientWidth}px;
                height:${body.clientHeight}px;
                margin-top:${head.clientHeight}px;
                padding-bottom:${head.clientHeight / 2}px;
                `)
        }
    }

    componentDidMount(){
        // if (this.props.state == 1) window.history.pushState({}, null , '/plus/confirm')
        // else if (this.props.state == 2)window.history.replaceState({} , null , '/plus/confirm')
        window.addEventListener('resize' , this.sizeFeedBack)
    }

    componentWillUnmount() {
        window.removeEventListener('resize' , this.sizeFeedBack)
    }

    functionPasswordInput = (e) => {
        if(e.target.value != "") e.target.setAttribute('style' , 'font-family: main-font; font-size:18pt')
        else e.target.removeAttribute('style')
    }

    cancal = (e) => {
        e.preventDefault()
        document.getElementById('popup-confirm').removeAttribute('popup-show')
        setTimeout(()=>{
            this.props.body.setState({
                bodyConfirm : ""
            })
        } , 1000)
    }

    showPassword = (e) => {
        e.target.innerHTML = this.props.password
    }

    hidePassword = (e) => {
        e.target.innerHTML = "[คลิกเพื่อแสดง]"
    }

    confirmForm = (e) => {
        e.preventDefault()

        let passwordAdmin = document.getElementById('textbox-confirm')

        console.log(passwordAdmin.value)
        if(passwordAdmin.value && this.props.user && this.props.password && this.state.check) {
            this.state.check = false
            passwordAdmin.removeAttribute('requireded')

            clientMo.post('/api/admin/checkUserAction' , {password : passwordAdmin.value , type : 'add'}).then((value)=>{
                console.log(value)
                if(value === '1') {
                    // action when add complete
                    let data = {
                        ID : this.props.user,
                        passwordDT : this.props.password,
                    }

                    document.getElementById('feedback').setAttribute('show' , '')
                    clientMo.post('/api/admin/add' , data).then((feedback)=>{
                        // feedback complete add doctor
                        if(feedback == '1') {
                            document.getElementById('img-feedback-correct').setAttribute('show' , '')

                            setTimeout(()=>{
                                document.getElementById('popup-confirm').removeAttribute('popup-show')
                                setTimeout(()=>{
                                    this.props.body.setState({
                                        bodyConfirm : ""
                                    })
                                } , 1000)
                            } , 1700)
                        } else {
                            document.getElementById('img-feedback-error').setAttribute('show' , '')

                            setTimeout(()=>{
                                document.getElementById('feedback').removeAttribute('show')
                            } , 1700)
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
            <section id="plus-confirm">
                <bot-head-confirm>ยืนยันการเพิ่มข้อมูล</bot-head-confirm>
                <section id="feedback" onLoad={this.sizeFeedBack}>
                    {this.state.feedback}
                </section>
                <section id="bodyForm-confirm">
                    <section id="detailNewDoctor">
                        <div id="content-username-box" className="content-again">
                            <div className="head-again">รหัสประจำตัวผู้ส่งเสริม:</div> 
                            <span className="data-again">
                                <span>{this.props.user}</span>
                            </span>
                        </div>
                        <div id="content-password-box" className="content-again">
                            <div className="head-again">รหัสผ่านของผู้ส่งเสริม:</div> 
                            <span className="data-again">
                                <span onTouchStart={this.showPassword} onMouseDown={this.showPassword} onMouseUp={this.hidePassword}>{"[คลิกเพื่อแสดง]"}</span>
                            </span>
                        </div>
                    </section>
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