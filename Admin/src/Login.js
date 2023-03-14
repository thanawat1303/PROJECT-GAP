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

    render() {
        return (
            <form onSubmit={this.submitFrom}>
                <label>
                    <input className="inputForm" type="text" name="username" placeholder="Username"/>
                </label>
                <label>
                    <input className="inputForm" type="password" name="password" placeholder="Password"/>
                </label>
                <button type="submit">LOGIN</button>
            </form>
        )
    }
}