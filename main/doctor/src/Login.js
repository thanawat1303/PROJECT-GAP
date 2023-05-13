import React, { Component } from "react";
import liff from "@line/liff"
import {clientMo}  from "../../../src/assets/js/moduleClient";
import './assets/style/Login.scss'

import Docter from "./Doctor";

export default class Login extends Component {
// this.props.main == Main app
    constructor(){
        super();
        this.state={
            body : <div></div>,
            inputUser : <input autoComplete="off" onChange={this.changeValUs} className="inputForm" type="text" name="username" placeholder="รหัสประจำตัวผู้ส่งเสริม"/>,
            formPersonal : <div></div>
        }
    }

    componentDidMount() {

        liff.init({
            liffId : "1661049098-dorebKYg"
        }).then(()=>{
            if(liff.isLoggedIn()) {
                clientMo.post("" , {id:liff.getAId()}).then((U_id)=>{
                    this.setState({
                        inputUser : <input defaultValue={U_id} autoComplete="off" onChange={this.changeValUs} className="inputForm" type="text" name="username" placeholder="รหัสประจำตัวผู้ส่งเสริม"/>
                    })
                })
            }
        }).catch((err)=>console.log(err))

        if(this.props.state) {
            window.history.pushState({} , null , '/doctor')
        }

        
        // else window.history.replaceState({} , null , '/')
    }

    submitFrom = (e) => {
        if(e.target[0].value != '' && e.target[1].value != ''){
            this.setState({formPersonal : <></>})
            clientMo.rmAction('#loading' , 'hide' , 0)
            const formData = {
                username : e.target[0].value,
                password : e.target[1].value
            }

            setTimeout(()=>{
                clientMo.post('/api/doctor/auth' , formData).then((context)=>{
                    let errorLogin = document.querySelector('.error-login')
                    errorLogin.classList.add('hide')
                    errorLogin.innerHTML = ""
                    if(context == "pass") {
                        this.props.main.setState({
                            body : <Docter main={this.props.main}/>
                        })
                        
                    } else if (context == "account") {
                        errorLogin.classList.remove('hide')
                        errorLogin.innerHTML = "บัญชีถูกระงับ กรุณาติดต่อผู้ดูแลระบบ"
                        for(let x = 0; x < e.target.length-1; x++) {
                            e.target[x].removeAttribute('style')
                            document.querySelector('.content-user .label-login').classList.remove('moveOn')
                            document.querySelector('.content-pw .label-login').classList.remove('moveOn')
                            document.querySelector('.content-pw').removeAttribute('style')
                            e.target[x].value = ''
                        }
                    } else if (context.indexOf("wait") >= 0) {
                        let id = context.split(':')
                        document.querySelector("#box-login-docter #form-personal").setAttribute("show" , "")
                        for(let x = 0; x < e.target.length-1; x++) {
                            e.target[x].removeAttribute('style')
                            document.querySelector('.content-user .label-login').classList.remove('moveOn')
                            document.querySelector('.content-pw .label-login').classList.remove('moveOn')
                            document.querySelector('.content-pw').removeAttribute('style')
                            e.target[x].value = ''
                        }
                        this.setState({
                            formPersonal : <FormPersonal id={id[1]} ele={this} main={this.props.main}/>
                        })
                    }
                    else {
                        errorLogin.classList.remove('hide')
                        errorLogin.innerHTML = "รหัสประจำตัวหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง."
                        for(let x = 0; x < e.target.length-1; x++) {
                            e.target[x].removeAttribute('style')
                            document.querySelector('.content-user .label-login').classList.remove('moveOn')
                            document.querySelector('.content-pw .label-login').classList.remove('moveOn')
                            document.querySelector('.content-pw').removeAttribute('style')
                            e.target[x].value = ''
                        }
                    }
                    clientMo.addAction('#loading' , 'hide' , 1500)
                })
            } , 1500)
        } else {
            for(let x = 0; x < e.target.length-1; x++) {
                (e.target[x].value == "") ? e.target[x].classList.add('empty') : e.target[x].classList.remove('empty');
            }
        }
        e.preventDefault()
    }

    changeValUs = (e) => {
        e.target.classList.remove('empty')
        if(e.target.value) {
            document.querySelector('.content-user .label-login').classList.add('moveOn')
            document.querySelector('.Logo-App').setAttribute('style' , 'margin-bottom: 32px;')
        } else {
            document.querySelector('.Logo-App').removeAttribute('style')
            document.querySelector('.content-user .label-login').classList.remove('moveOn')
        }
    }

    changeValPw = (e) => {
        e.target.classList.remove('empty')
        if(e.target.value !== "") {
            document.querySelector('.content-pw').setAttribute('style' , 'margin: 25px 0px 5px 0px')
            document.querySelector('.content-pw .label-login').classList.add('moveOn')
            e.target.setAttribute('style' , 'font-family: main-font;')
        } else {
            e.target.removeAttribute('style')
            document.querySelector('.content-pw').removeAttribute('style')
            document.querySelector('.content-pw .label-login').classList.remove('moveOn')
        }
    }

    render() {
        return (
            <div id="box-login-docter">
                <div id="form-personal">{this.state.formPersonal}</div>
                <form autoComplete="off" onSubmit={this.submitFrom} className="content-login">
                    <div className="Logo-App"><img width={150}  src="/logo2.png"></img></div>
                    <label className="content-user">
                        <span className="label-login">รหัสประจำตัวผู้ส่งเสริม</span>
                        {this.state.inputUser}
                    </label>
                    <label className="content-pw">
                        <span className="label-login">รหัสผ่าน</span>
                        <input autoComplete="off" onChange={this.changeValPw} className="inputForm" type="password" name="password" placeholder="รหัสผ่าน"/>
                    </label>
                    <button type="submit" className="bt-submit-form">เข้าสู่ระบบ</button>
                    <p className="error-login hide"></p>
                </form>
            </div>
        )
    }
}

class FormPersonal extends Component {
    constructor(){
        super();
        this.state = {
            error : <></>
        }
    }

    confirm = () => {
        let firstname = document.querySelector("#box-login-docter #form-personal #firstname")
        let lastname = document.querySelector("#box-login-docter #form-personal #lastname")
        let station = document.querySelector("#box-login-docter #form-personal #station")
        let password = document.querySelector("#box-login-docter #form-personal #password")

        if(firstname.value && lastname.value && station.value && password.value) {
            clientMo.rmAction('#loading' , 'hide' , 0)
            document.querySelectorAll("#box-login-docter #form-personal .field-personal").forEach((val , key) => {
                val.removeAttribute('request')
            })
            setTimeout(()=>{
                clientMo.post('/api/doctor/savePersonal' , {
                    firstname:firstname.value,
                    lastname:lastname.value,
                    station:station.value,
                    username:this.props.id,
                    password:password.value
                }).then((result)=>{
                    if(result === "pass"){
                        this.props.main.setState({
                            body : <Docter main={this.props.main}/>
                        })
                    } else if(result === "password") {
                        password.setAttribute('error' , "")
                        password.setAttribute('placeholder' , "รหัสผ่านไม่ถูกต้อง")
                        password.value = ""
                    } else if (result === "account") {
                        let eleError = document.querySelector('#box-login-docter #form-personal #account-error')
                        eleError.setAttribute("show" , "")
                        this.setState({
                            error : <ShowError ele={this}/>
                        })
                    }
    
                    clientMo.addAction('#loading' , 'hide' , 1000)
                })
            } , 1500)
        } else {
            document.querySelectorAll("#box-login-docter #form-personal .field-personal").forEach((val , key) => {
                (!val.value) ? val.setAttribute('request' , "") : val.removeAttribute('request')
            })
        }
    }

    cancel = () => {
        document.querySelector("#box-login-docter #form-personal").removeAttribute("show")
        setTimeout(()=>{
            this.props.ele.setState({
                formPersonal : <></>
            })
        } , 1000)
    }

    render(){
        return(
            <>
            <div id="account-error">
                {this.state.error}
            </div>
            <div id="form">
                <div id="id-docter">
                    รหัสประจำตัว
                    <input value={this.props.id} readOnly></input>
                </div>
                <div id="form-input">
                    <div id="fullname">
                        <div id="input-firstname">
                            <span>ชื่อ</span>
                            <input type="text" id="firstname" className="field-personal"></input>
                        </div>
                        <div id="input-lastname">
                            <span>นามสกุล</span>
                            <input type="text" id="lastname" className="field-personal"></input>
                        </div>
                    </div>
                    <div id="station-farm">
                        <span>ศูนย์ปฏิบัติหน้าที่</span>
                        <input type="text" id="station" className="field-personal"></input>
                    </div>
                </div>
                <div id="field-password">
                    <input id="password" placeholder="รหัสผ่าน" type="password" className="field-personal"></input>
                </div>
                <div id="confirm">
                    <button id="bt-cancel" onClick={this.cancel}>ยกเลิก</button>
                    <button id="bt-confirm" onClick={this.confirm}>บันทึกข้อมูล</button>
                </div>
            </div>
            </>
        )
    }
}

class ShowError extends Component {

    confirm = () => {
        document.querySelector("#box-login-docter #form-personal").removeAttribute("show")
        setTimeout(()=>{
            this.props.ele.setState({
                formPersonal : <></>
            })
        } , 1000)
    }

    render() {
        return(
            <div id="error-account">
                <div>บัญชีถูกระงับ กรุณาติดต่อผู้ดูแลระบบ</div>
                <button onClick={this.confirm}>ตกลง</button>
            </div>
        )
    }
}