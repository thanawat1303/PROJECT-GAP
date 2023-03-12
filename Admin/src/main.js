import React, { Component } from "react";
import {clientMo}  from "./assets/js/moduleClient";
import Login from "./Login";


export default class Main extends Component {
    constructor(){
        super();
        this.state={
            body : <div></div>
        }
    }

    componentDidMount() {
        console.log(window.location.pathname)
        clientMo.post('/check' , {'session' : sessionStorage.getItem('hasID')}).then((context)=>{
            console.log(context)
            if(context) 
                this.setState({
                    body : <div>ADMIN</div>
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