import React , {Component, useEffect, useState} from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { ClosePopUp } from "../../../../src/assets/js/module";

import './assets/style/ListFarmer.scss'
import { ShowDetailFarmer } from "./DetailFarmer";

export default class List extends Component {

    constructor(){
        super();
        this.state={
            body : <></>,
            delete : <></>,
            DetailFarmer : <></>
            // list : []
        }
    }

    componentDidMount() {
        window.addEventListener('popstate', this.checkPage)
        this.checkPage()

        this.setState({
            body : JSON.parse(this.props.list).map((listFm , index) =>
                        <div key={index} className="container-fm" onClick={()=>this.ShowDetail(listFm['id_farmer'] , 1)}>
                            <div className="img-list-farmer">
                                <img width={70} src={(listFm['img']['data'] != '') ? listFm['img']['data'] : '/farmer-svgrepo-com.svg'}></img>
                            </div>
                            <div className="detail-list-farmer">
                                <input className="id" readOnly value={listFm['id_farmer']}></input>
                                <input className="fullname" readOnly value={listFm['fullname']}></input>
                            </div>
                            <div className="count-account-list-farmer">
                                {listFm['CountFM']}
                            </div>
                        </div>
                    ) // use map is create element object
        })
    }

    componentWillUnmount(){
        window.removeEventListener('popstate', this.checkPage)
    }

    checkPage = () => {
        if(window.location.href.split('?')[1] == undefined) {
            if (this.props.status == 0) window.history.replaceState({} , null , '/doctor/list')
            else if(this.props.status == 1) window.history.pushState({}, null , '/doctor/list')
            this.setState({
                DetailFarmer:<></>
            })

            document.getElementById('popup-detail-farmer').removeAttribute('show')
        } else {
            this.ShowDetail(window.location.href.split('?')[1] , 0)
        }
    }

    ShowDetail = async (id , status) => {
        const result = await clientMo.post('/api/doctor/farmer/list' , {
            type:'profile',
            farmer : id
        })

        this.setState({
            DetailFarmer : <ShowDetailFarmer list={result} status={status} main={this.props.main} id={id} listFarm={this}/>
        })
    }

    render() {
        return(
            <div id="list-farmer-success">
                <div id="list">
                    {this.state.body}
                </div>
                <div id="popup-detail-farmer">
                    {this.state.DetailFarmer}
                </div>
            </div>
        )
    }
}