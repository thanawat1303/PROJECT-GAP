import React, { Component } from "react";
import liff from "@line/liff"
import {clientMo}  from "../../../src/assets/js/moduleClient";
import './assets/style/Login.scss'

import Docter from "./Docter";

export default class Login extends Component {
// this.props.main == Main app
    constructor(){
        super();
        this.state={
            body : <div></div>,
            inputUser : <input autoComplete="off" onChange={this.changeValUs} className="inputForm" type="text" name="username" placeholder="รหัสประจำตัวผู้ส่งเสริม"/>,
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
            window.history.pushState({} , null , '/docter')
        }

        
        // else window.history.replaceState({} , null , '/')
    }

    submitFrom = (e) => {
        if(e.target[0].value != '' && e.target[1].value != ''){
            clientMo.rmAction('#loading' , 'hide' , 0)
            const formData = {
                username : e.target[0].value,
                password : e.target[1].value
            }

            setTimeout(()=>{
                clientMo.post('/api/docter/auth' , formData).then((context)=>{
                    if(context) {
                        this.props.main.setState({
                            body : <Docter main={this.props.main}/>
                        })
                        
                    } else {
                        document.querySelector('.error-login').classList.remove('hide')
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
            <div className="box-login">
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
                    <p className="error-login hide">ไม่สามารถเข้าสู่ระบบได้ กรุณาลองอีกครั้ง.</p>
                </form>
            </div>
        )
    }
}

class FormPersonal extends Component {

}