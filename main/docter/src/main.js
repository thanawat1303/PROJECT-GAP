import React, { Component } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";

export default class MainDocter extends Component {
    constructor(){
        super();
        this.state={
            body : <div>555</div>
        }
    }

    componentDidMount() {

        // clientMo.post('/api/admin/check').then((context)=>{
        //     console.log(context)
        //     if(context) 
        //         this.setState({
        //             body : <Admin main={this}/>
        //         })
        //     else 
        //         this.setState({
        //             body : <Login main={this}/>
        //         }) 
            
        //     clientMo.addAction('#loading' , 'hide' , 1000)
        // })
        
    }

    render() {
        return (
            this.state.body
        )
    }
}