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
                        <div count={listFm['countFm']} key={index} className="container-push" onClick={()=>this.showDetail(listFm['id_table'])}>
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
        clientMo.post("api/docter/pull" , {id:id}).then((profile)=>{
            if(profile) {
                this.setState({
                    detail : <DetailConfirm bodyPush={this} profile={profile}/>
                })
            }
        })
    }

    close = (e) => {
        console.log(e.target.id)
        if(e.target.id == "detail-confirm") {
            document.getElementById('detail-confirm').removeAttribute('show')
            this.setState({
                detail : <></>
            })
        }
    }

    render(){
        return(
            <section id="page-push-docter">
                <section id="detail-confirm" onClick={this.close}>
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
    constructor(){
        super()
        this.state = {
            profileBody : <></>
        }
    }

    componentDidMount(){
        let profileP = JSON.parse(this.props.profile)
        this.setState({
            profileBody : 
                    <section id="detail-fm-confirm" onLoad={this.onLoadComplete}>
                        <div id="img-fm-confirm">
                            <img src={(profileP['img']['data'] != '') ? profileP['img']['data'] : '/farmer-svgrepo-com.svg'}></img>
                        </div>
                        <div id="detail-profile-confirm">
                            <div id="id-profile-confirm">
                                <input readOnly value={profileP['id_farmer']}></input>
                            </div>
                            <div id="fullname-profile-confirm">
                                <input readOnly value={profileP['fullname']}></input>
                            </div>
                            {/* <div id="station-profile-confirm">
                                <input readOnly value={profileP['fullname']}></input>
                            </div> */}
                            <div id="location-profile-confirm">
                                {<Maps lat={profileP['location']['x']} lng={profileP['location']['y']}/>}
                            </div>
                            <div id="date-profile-confirm">
                                <input readOnly type="date" value={profileP['date_register'].split('T')[0]}></input>
                            </div>
                        </div>
                    </section>
        })
        console.log(profileP)
    }

    onLoadComplete = () =>{
        document.getElementById('detail-confirm').setAttribute('show' , '')
        console.log("loadPush")
    }

    render() {
        return(
            this.state.profileBody
        )
    }
}

const Maps = (props) => {
    const Location = (e) => {
        console.log(e)
    }

    return(
        <iframe src={`https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_API_KEY}&center=${props.lat},${props.lng}&zoom=18&maptype=satellite`} 
            width="300" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" 
            onClick={Location}
        ></iframe>
    )
}