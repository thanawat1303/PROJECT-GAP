import React , {Component} from "react";
import {clientMo}  from "./assets/js/moduleClient";

import './assets/style/List.scss'


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

        console.log(JSON.parse(this.props.list))
        this.setState({
            body : JSON.parse(this.props.list).map((listDT , index) =>
                        <div key={index} className="container-docter">
                            <img className="img-docter" src={(listDT['Image_docter']['data'] != '') ? listDT['Image_docter']['data'] : '/doctor-svgrepo-com.svg'}></img>
                            <div className="content-detail">
                                <div className="detail-private">
                                    <span>{(listDT['Fullname_docter']) ? listDT['Fullname_docter'] : 'ไม่ระบุชื่อ' }</span>
                                    <span>{listDT['id_docter']}</span>
                                </div>
                            </div>
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