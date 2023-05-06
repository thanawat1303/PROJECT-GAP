import React, { Component } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";
import Login from "./Login";
import Admin from "./Admin";

import './assets/style/main.scss'


export default class MainApp extends Component {
    constructor(){
        super();
        this.state={
            body : <div></div>
        }
    }

    componentDidMount() {

        clientMo.post('/api/admin/check').then((context)=>{
            if(context) 
                this.setState({
                    body : <Admin main={this}/>
                })
            else 
                this.setState({
                    body : <Login main={this}/>
                }) 
            
            clientMo.addAction('#loading' , 'hide' , 1000)
        })
        
    }

    render() {
        return (
            this.state.body
        )
    }
}