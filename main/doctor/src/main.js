import React, { Component } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";

import Login from "./Login";
import Doctor from "./Doctor";

import './assets/style/main.scss'

export default class MainDoctor extends Component {
    constructor(){
        super();
        this.state={
            body : <div></div>
        }
    }

    componentDidMount() {

        clientMo.post('/api/doctor/check').then((context)=>{
            console.log(context)
            if(context) 
                this.setState({
                    body : <Doctor main={this}/>
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