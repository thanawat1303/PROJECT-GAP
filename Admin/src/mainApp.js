import React, { Component } from "react";
import {clientMo}  from "./assets/js/moduleClient";
import Login from "./Login";
import Admin from "./Admin";


export default class MainApp extends Component {
    constructor(){
        super();
        this.state={
            body : <div></div>
        }
    }

    componentDidMount() {

        clientMo.post('/check').then((context)=>{
            console.log(context)
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