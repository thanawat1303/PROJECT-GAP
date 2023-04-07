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
            body: <div></div>,
            timeOld : 0
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

    actionMenu = () => {
        let list = document.querySelectorAll('.nav-menu .list-menu-nav')
        let time = new Date()

        if (time.getTime() - this.state.timeOld > 500) {
            this.state.timeOld = time.getTime()
            list.forEach((el , index) => {
            
                if(el.getAttribute('mini-nav') == '') {
                    el.removeAttribute('mini-nav')
                    setTimeout(()=>{el.removeAttribute('mini-nav-action')}, 300)
                }
                else {
                    el.setAttribute('mini-nav' , '')
                    setTimeout(()=>{el.setAttribute('mini-nav-action' , '')}, 300)
                }
                
            })
        }
    }

    render() {
        return (
            <div className="admin">
                <section className="tab-bar">
                    <span className="pg-action">
                        <span className="nav-menu">
                            <span onClick={this.actionMenu} className="bg-icon">
                                <img src="menu-1-svgrepo-com-green.svg"></img>
                            </span>
                        </span>
                        <span className="Logo">
                            หมอพืช
                            <img  src="/logo.png"></img>
                        </span>
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