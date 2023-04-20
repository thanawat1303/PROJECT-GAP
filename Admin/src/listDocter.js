import React , {Component} from "react";
import {clientMo}  from "./assets/js/moduleClient";

export default class List extends Component {
    
    constructor(){
        super();
        this.state={
            body : <></>,
            // list : []
        }
    }

    componentDidMount(){
        if (this.props.status == 0) window.history.replaceState({} , null , '/list' )
        else if(this.props.status == 1) window.history.pushState({}, null , '/list')

        this.setState({
            body : JSON.parse(this.props.list).map((listDT , index) =>
                        <div key={index}>
                            <p>{listDT['id_docter']}</p>
                        </div>
                    ) // use map is create element object
        })

    }

    LoadMore = () => {
        // Load list docter more from database
    }

    render() {
        return (
            <section id="body-list-docter">
                {this.state.body}
            </section>
        )
    }
}