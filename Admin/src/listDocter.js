import React , {Component} from "react";
import {clientMo}  from "./assets/js/moduleClient";

export default class List extends Component {
    
    constructor(){
        super();
        this.state={
            body : <div></div>
        }
    }

    componentDidMount(){
        if (this.props.status == 0) window.history.replaceState({} , null , '/list' )
        else if(this.props.status == 1) window.history.pushState({}, null , '/list')

        clientMo.post('/admin/listDocter').then((list)=>{
            console.log(JSON.parse(list))
        })
    }

    render() {
        return (
            <section id="body-list-docter">
                {this.state.body}
            </section>
        )
    }
}