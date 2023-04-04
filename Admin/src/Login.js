import React, { Component } from "react";
import {clientMo}  from "./assets/js/moduleClient";
import './assets/style/Login.scss'

import Admin from "./Admin";

export default class Login extends Component {
// this.props.main == Main app
    constructor(){
        super();
        this.state={
            body : <div></div>
        }
    }

    submitFrom = (e) => {
        if(e.target[0].value != '' && e.target[1].value != ''){
            clientMo.rmAction('#loading' , 'hide' , 0)
            const formData = {
                username : e.target[0].value,
                password : e.target[1].value
            }
            setTimeout(()=>{
                clientMo.post('/login' , formData).then((context)=>{
                    if(context) {
                        this.props.main.setState({
                            body : <Admin main={this.props.main}/>
                        })
                        sessionStorage.setItem('hasID' , '1')
                    }
                    clientMo.addAction('#loading' , 'hide' , 1500)
                })
            } , 1500)
        } else {

        }
        e.preventDefault()
    }

    changeValUs = (e) => {
        console.log(e.target.value)
        if(e.target.value) {
            document.querySelector('.content-user .label-login').classList.add('moveOn')
        } else {
            document.querySelector('.content-user .label-login').classList.remove('moveOn')
        }
    }

    changeValPw = (e) => {
        if(e.target.value !== "") {
            e.target.setAttribute('style' , 'font-family: unset;padding: 3.5px 10px;')
            document.querySelector('.content-pw').setAttribute('style' , 'margin: 22px 0px 5px 0px')
            document.querySelector('.content-pw .label-login').classList.add('moveOn')
        } else {
            e.target.removeAttribute('style')
            document.querySelector('.content-pw').removeAttribute('style')
            document.querySelector('.content-pw .label-login').classList.remove('moveOn')
        }
    }

    render() {
        return (
            <div className="box-login">
                <form onSubmit={this.submitFrom} className="content-login">
                    <label className="content-user">
                        <span className="label-login">Username</span>
                        <input onChange={this.changeValUs} className="inputForm" type="text" name="username" placeholder="Username"/>
                    </label>
                    <label className="content-pw">
                        <span className="label-login">Password</span>
                        <input onChange={this.changeValPw} className="inputForm" type="password" name="password" placeholder="Password"/>
                    </label>
                    <button type="submit">LOGIN</button>
                </form>
            </div>
        )
    }
}