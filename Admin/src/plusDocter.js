import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";

import Confirm from "./confirmPage";
import Login from "./Login";

import './assets/style/Plus.scss'

export default class Plus extends Component {
    constructor() {
        super();
        this.state={
            body: <div></div>
        }
    }

    componentDidMount(){
        this.setState({
            body : <FormPlus main={this.props.main} body={this}/>
        })
        
        if(this.props.status == 1) window.history.pushState({}, null , '/plus')
        else {
            if(window.location.pathname == '/plus/confirm') {
                console.log('Page confirm')
            }
        }
    }

    render() {
        return (
            this.state.body
        )
    }
}

class FormPlus extends Component {

    changeFont = (e) => {
        if(e.target.value != "") e.target.setAttribute('style' , 'font-family: main-font; font-size:16pt')
        else e.target.removeAttribute('style')
    }

    Psubmit = (e) => {
        e.preventDefault()

        clientMo.post('/check').then((context)=>{
            if(context) {
                if(e.target[0].value != "" && e.target[1].value != "") {
                    this.props.body.setState({
                        body : <Confirm main={this.props.main} state={true}/>
                    })
                }
            }
            
            else 
                this.props.main.setState({
                    body : <Login main={this.props.main} state={true}/>
                })
        })
    }

    render(){
        return (
            <div id="content-plus">
                <form id="Pform" onSubmit={this.Psubmit}>
                    <Bot-head-form>เพิ่มบัญชีเจ้าหน้าที่ส่งเสริม</Bot-head-form>
                    <label id="id" className="textbox-Pform">
                        <input placeholder="รหัสประตัวผู้ส่งเสริม" id="user-id" type="text"></input>
                        <img className="label-Pform" src="/user-svgrepo-com.svg"></img>
                    </label>
                    <label id="password" className="textbox-Pform">
                        <input placeholder="รหัสผ่าน" id="password" type="password" onChange={this.changeFont}></input>
                        <img className="label-Pform" src="/key-svgrepo-com.svg"></img>
                    </label>
                    <button type="submit" className="bTplus bt-submit-form">
                        เพิ่มข้อมูล
                    </button>
                </form>
            </div>
        )
    }
}