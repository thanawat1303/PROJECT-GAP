import React , {Component} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";

import "./assets/style/Push.scss"

export default class Push extends Component {

    constructor(){
        super()
        this.state = {
            body : <></>,
            detail : <></>
        }
    }

    componentDidMount(){
        if(this.props.status == 1) window.history.pushState({}, null , '/docter/push')

        this.setState({
            body : JSON.parse(this.props.list).map((listFm , index) =>
                        <div key={index} className="container-push" onClick={()=>this.showDetail(listFm['id_farmer'])}>
                            <img className="img-docter" src={(listFm['img']['data'] != '') ? listFm['img']['data'] : '/farmer-svgrepo-com.svg'}></img>
                            <div className="detail-content-fm">
                                <div className="id-fm">{listFm['id_farmer']}</div>
                                <div className="name-fm">ชื่อเกษตรกร {listFm['fullname']}</div>
                            </div>
                        </div>
                    ) // use map is create element object
        })
    }

    showDetail = (id) => {
        clientMo.post("/api/docter/pull" , {id:id}).then((profile)=>{
            if(profile) {
                this.setState({
                    detail : <DetailConfirm bodyPush={this} profile={profile}/>
                })
            }
        })
    }

    render(){
        return(
            <section id="page-push-docter">
                <section id="detail-confirm">
                    {this.state.detail}
                </section>
                <section id="list-push-docter">
                    {this.state.body}
                </section>
            </section>
        )
    }
}

class DetailConfirm extends Component {
    render() {
        return(
            <></>
        )
    }
}