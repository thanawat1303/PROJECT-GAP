import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";

import Login from "./Login";

import './assets/style/Plus.scss'

export default class Plus extends Component {
    constructor(){
        super();
        this.state={
            bodyConfirm : <div></div>
        }
    }

    componentDidMount(){
        if(this.props.status == 1) window.history.pushState({}, null , '/plus')
        else {
            if(window.location.pathname == '/plus/confirm') {
                window.history.pushState({}, null , '/plus')
                // check session confirm docter 
            } else window.history.pushState({}, null , '/plus')
        }
    }

    changeFont = (e) => {
        if(e.target.value != "") e.target.setAttribute('style' , 'font-family: main-font; font-size:16pt')
        else e.target.removeAttribute('style')
    }

    ShowPassword = (e) => {
        let input = e.target.previousSibling
        if(input.value) {
            input.removeAttribute('style')
            input.setAttribute('type' , 'text')
        }
        e.target.setAttribute('src' , '/eye-open-svgrepo-com.svg')
    }

    hidePassword = (e) => {
        let input = e.target.previousSibling
        if(input.value) {
            input.setAttribute('style' , 'font-family: main-font; font-size:16pt')
            input.setAttribute('type' , 'password')
        }
        e.target.setAttribute('src' , '/eye-closed-svgrepo-com.svg')
    }

    Psubmit = (e) => {
        e.preventDefault()
        if(e.target[0].value && e.target[1].value && e.target[2].value)  {

            clientMo.post('/check').then((context)=>{
                if(context) {
                    this.setState({
                        bodyConfirm : <Confirm main={this.props.main} state={1} HeadForm={"เพิ่มข้อมูล"}/>
                    })
                    document.getElementById('popup-confirm').setAttribute('popup-show' , "")
                }
                
                else 
                    this.props.main.setState({
                        body : <Login main={this.props.main} state={true}/>
                    })

            })
        }
    }

    render() {
        return (
            <div id="content-plus">
                <form id="Pform" onSubmit={this.Psubmit}>
                    <Bot-head-form>เพิ่มบัญชีเจ้าหน้าที่ส่งเสริม</Bot-head-form>
                    <label id="id" className="textbox-Pform">
                        <input placeholder="รหัสประตัวผู้ส่งเสริม" id="user-id" type="text"></input>
                        {/* <img className="label-Pform" src="/user-svgrepo-com.svg"></img> */}
                    </label>
                    <label id="password-box" className="textbox-Pform">
                        <input placeholder="รหัสผ่านของผู้ส่งเสริม" id="password" type="password" onChange={this.changeFont}></input>
                        <img onMouseDown={this.ShowPassword} onMouseUp={this.hidePassword} className="label-Pform" id="action-password" src="/eye-closed-svgrepo-com.svg"></img>
                    </label>
                    <label id="password-box-again" className="textbox-Pform">
                        <input placeholder="รหัสผ่านอีกครั้ง" id="password-again" type="password" onChange={this.changeFont}></input>
                        {/* <img className="label-Pform" src="/key-svgrepo-com.svg"></img> */}
                    </label>
                    <button type="submit" className="bTplus bt-submit-form">
                        เพิ่มข้อมูล
                    </button>
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
            Head: ""
        }
    }

    componentDidMount(){
        if (this.props.state == 1) window.history.pushState({}, null , '/plus/confirm')
        else if (this.props.state == 2)window.history.replaceState({} , null , '/plus/confirm')
    }

    changeFont = (e) => {
        if(e.target.value != "") e.target.setAttribute('style' , 'font-family: main-font; font-size:18pt')
        else e.target.removeAttribute('style')
    }

    render(){
        return(
            <form id="plus-confirm">
                <bot-head-confirm>ยืนยันการเพิ่มข้อมูล</bot-head-confirm>
                <section id="bodyForm-confirm">
                    <input id="textbox-confirm" placeholder="รหัสผ่านผู้ดูแล" type="password" onChange={this.changeFont}></input>
                    <section id="bt-container-confirm">
                        <button id="cancal">ยกเลิก</button>
                        <button id="confirm-bt">ยืนยัน</button>
                    </section>
                </section>
            </form>
        )
    }
}