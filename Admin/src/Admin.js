import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";
import Login from "./Login";
import NavAdmin from "./navAdmin";
import './assets/style/Admin.scss'

export default class Admin extends Component {
    constructor(){
        super();
        this.state={
            nav: <NavAdmin bodyAdmin={this}/> ,
            body: <div></div>
        }
    }

    Logout = () => {
        clientMo.rmAction('#loading' , 'hide' , 0)
        setTimeout(()=>{
            clientMo.get('logout').then(()=>{
                this.props.main.setState({
                    body : <Login main={this.props.main}/>
                })
                clientMo.addAction('#loading' , 'hide' , 1500)
            })
        } , 1500)
    }

    render() {
        return (
            <div className="admin">
                <section className="tab-bar">
                    <span className="Logo">
                        หมอพืช
                        <img  src="/logo.png"></img>
                    </span>
                    <span className="bt-action">
                        <a className="alarm">
                            <img src="alarm-svgrepo-com.svg"></img>
                        </a>
                        <a className="profile">
                            <img src="profile-svgrepo-com-white.svg"></img>
                        </a>
                        {/* <button onClick={this.Logout}>LOGOUT</button> */}
                    </span>
                </section>
                <section className="container-body-admin">
                    {this.state.nav}
                    {this.state.body}
                </section>
            </div>
        )
    }
}