import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";
import Login from "./Login";

import NavAdmin from "./navAdmin";

import './assets/style/Admin.scss'

export default class Admin extends Component {
    constructor(){
        super();
        this.state={
            nav: <div></div> ,
            body: <div></div>,
            session: <div></div>,
            timeOld : 0
        }
    }

    componentDidMount() {
        this.setState({
            nav : <NavAdmin bodyAdmin={this} main={this.props.main}/>
        })
        window.addEventListener('resize' , this.checkSize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize' , this.checkSize)
    }

    checkSize = (e) => {
        // e.target.innerHeight 
        let list = document.querySelectorAll('.nav-menu .list-menu-nav')
        if(e.target.innerWidth <= 500) {
            list.forEach((el) => {
                el.setAttribute('mini-nav' , '')
                el.setAttribute('mini-nav-action' , '')
            })
        } else {
            list.forEach((el) => {
                el.removeAttribute('mini-nav')
                el.removeAttribute('mini-nav-action')
            })
        }
    }

    Logout = (e) => {
        e.target.parentElement.classList.toggle('hide')
        clientMo.rmAction('#loading' , 'hide' , 0)
        setTimeout(()=>{
            clientMo.get('/api/admin/logout').then(()=>{
                this.props.main.setState({
                    body : <Login main={this.props.main} state={true}/>
                })
                clientMo.addAction('#loading' , 'hide' , 1500)
            })
        } , 2000)
    }

    Menu = () => {
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

            console.log(document.querySelector('.nav-menu .list-menu-nav').clientWidth)
        }
    }

    showOption = () => {
        document.getElementById('profile-otion').classList.toggle('display')
        document.querySelector('.profile-icon').classList.toggle('select')
    }

    hidePopUp = (e) => {
        if(document.querySelector('#profile-otion.display')) {
            let hide = true 
            if(e.target == document.querySelector('.profile-icon #icon')) hide = false
            if(e.target == document.querySelector('.profile-icon')) hide = false
            if(e.target == document.querySelector('#profile-otion')) hide = false            
            if(e.target == document.querySelector('#profile-otion #icon')) hide = false            

            if(hide) {
                document.querySelector('#profile-otion').classList.remove('display')
                document.querySelector('.profile-icon').classList.remove('select')
            }

        }  
    }

    render() {
        return (
            <div className="admin" onMouseDown={this.hidePopUp} onContextMenu={this.hidePopUp}>
                <section className="tab-bar">
                    <span className="pg-action">
                        <span className="nav-menu">
                            <span onClick={this.Menu} className="bg-icon">
                                <img src="/menu-1-svgrepo-com-green.svg"></img>
                            </span>
                        </span>
                        <a className="Logo" href="/" title="หมอพืช">
                            หมอพืช
                            <img  src="/logo2.png"></img>
                        </a>
                    </span>
                    <span className="bt-action">
                        <a className="alarm">
                            <img src="/alarm-svgrepo-com.svg"></img>
                        </a>
                        <section className="profile">
                            <a onClick={this.showOption} className="profile-icon">
                                <img id="icon" src="/profile-svgrepo-com-white.svg"></img>
                            </a>
                            <div id="profile-otion">
                                <a onClick={this.Logout} id="logout">
                                    LOGOUT
                                </a>
                            </div>
                        </section>
                    </span>
                </section>
                <section className="container-body-admin">
                    {this.state.nav}
                    <bot-main>
                        <bot-content>
                            {this.state.body}
                        </bot-content>
                    </bot-main>
                </section>
                {/* feedBack */}
                <section id="session">
                    {this.state.session}
                </section>
            </div>
        )
    }
}