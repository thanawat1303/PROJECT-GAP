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

    componentDidMount() {
        if(this.props.state) {
            window.history.pushState({} , null , '/')
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
                clientMo.post('/login' , formData).then((context)=>{
                    if(context) {
                        this.props.main.setState({
                            body : <Admin main={this.props.main}/>
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
            document.querySelector('.Logo-App').setAttribute('style' , 'margin-bottom: 28px;')
        } else {
            document.querySelector('.Logo-App').removeAttribute('style')
            document.querySelector('.content-user .label-login').classList.remove('moveOn')
        }
    }

    changeValPw = (e) => {
        e.target.classList.remove('empty')
        if(e.target.value !== "") {
            document.querySelector('.content-pw').setAttribute('style' , 'margin: 22px 0px 5px 0px')
            document.querySelector('.content-pw .label-login').classList.add('moveOn')
        } else {
            document.querySelector('.content-pw').removeAttribute('style')
            document.querySelector('.content-pw .label-login').classList.remove('moveOn')
        }
    }

    render() {
        return (
            <div className="box-login">
                <form onSubmit={this.submitFrom} className="content-login">
                    <div className="Logo-App"><img width={150}  src="/logo.png"></img></div>
                    <label className="content-user">
                        <span className="label-login">Username</span>
                        <input onChange={this.changeValUs} className="inputForm" type="text" name="username" placeholder="Username"/>
                    </label>
                    <label className="content-pw">
                        <span className="label-login">Password</span>
                        <input onChange={this.changeValPw} className="inputForm" type="password" name="password" placeholder="Password"/>
                    </label>
                    <button type="submit">LOGIN</button>
                    <p className="error-login hide">Login Failed Please log in again.</p>
                </form>
            </div>
        )
    }
}