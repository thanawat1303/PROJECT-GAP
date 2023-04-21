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
                            <div className="docter-detail">
                                <img className="img-docter" src={(listDT['Image_docter']['data'] != '') ? listDT['Image_docter']['data'] : '/doctor-svgrepo-com.svg'}></img>
                                <div className="content-detail">
                                    <div className="detail-name">
                                        <div className="detail">
                                            <span className="head-detail">ชื่อ - นามสกุล</span> :
                                            <span className="indetail">{(listDT['Fullname_docter']) ? listDT['Fullname_docter'] : 'ยังไม่ระบุ'}</span>
                                        </div>
                                    </div>
                                    <div className="detail-id">
                                        <div className="detail">
                                            <span className="head-detail">รหัสประจำตัว</span> :
                                            <span className="indetail">{listDT['id_docter']}</span>
                                        </div>
                                    </div>
                                    <div className="detail-contect">
                                        <span>{"ศูนย์ดูแล : " + ((listDT['Job_care_center']) ? listDT['Job_care_center'] : "ยังไม่ระบุ")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bt-manage">
                                <span className="box-status">
                                    <div className="status" status={listDT['Status_account']}>
                                        <span className="list-status" openState="">ON</span>
                                        <button 
                                            status={listDT['Status_account']} 
                                            className="bt-status"
                                            >
                                            {/* {(listDT['Status_account'] == 1) ? "ปิดบัญชี" : "เปิดบัญชี"} */}
                                        </button>
                                        <span className="list-status" closeState="">OFF</span>
                                    </div>
                                </span>
                                <button className="bt-delete">ลบบัญชี</button>
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