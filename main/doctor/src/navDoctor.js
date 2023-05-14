import React , {Component} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";

import Login from "./Login";

import List from "./listFramer";
import Push from "./PushFramer";

import SessionOut from "./sesionOut";

export default class NavDoctor extends Component {

    componentDidMount() {
        this.checkPath()
        window.addEventListener('popstate' , this.changePage)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate' , this.changePage)
    }

    changePage = () => {
        this.checkPath(-1)
    }

    checkPath = (statusLoad = 0) =>{
        let path = window.location.pathname.split('/');
        if(path[1] + "/" + path[2] == 'doctor/list' || path[1] + "/" + path[2] == 'doctor/undefined')
        {
            clientMo.post('/api/doctor/listFarmer'  , {type:'list'}).then((list)=>{
                if(list) {
                    this.props.bodyDoctor.setState({body : <List status={statusLoad} main={this.props.main} bodyDoctor={this.props.bodyDoctor} list={list}/>})
                    if(document.querySelector('a[nav-select=""]')) document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                    document.getElementById('account').setAttribute('nav-select' , '')
                } else this.sessionoff(true)

            })
        }
        else if (path[1] + "/" + path[2] == 'doctor/push')
        {
            clientMo.post('/api/doctor/listFarmer' , {type:'push'}).then((list)=>{
                if(list) {
                    this.props.bodyDoctor.setState({body : <Push status={1} main={this.props.main} bodyDoctor={this.props.bodyDoctor} list={list}/>})
                    if(document.querySelector('a[nav-select=""]')) document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                    document.getElementById("pAccount").setAttribute('nav-select' , '')
                }
                else this.sessionoff()
            })
        }
    }

    sessionoff = (type = false) => {
        if(type) {
            this.props.main.setState({
                body : <Login main={this.props.main} state={true}/>
            })
        } else {
            this.props.bodyDoctor.setState({
                session : <SessionOut main={this.props.main}/>
            })
    
            document.getElementById('session').setAttribute('show' , '')
        }
    } 

    selectMenu = (e , ele) => {
        e.preventDefault()

        if(ele == 'account') {
            clientMo.post('/api/doctor/listFarmer' , {type:'list'}).then((list)=>{
                if(list) {
                    this.props.bodyDoctor.setState({body : <List status={1} main={this.props.main} bodyDoctor={this.props.bodyDoctor} list={list}/>})
                    document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                    document.getElementById(ele).setAttribute('nav-select' , '')
                } 
                else this.sessionoff()
            })
        }
        else if (ele == 'pAccount') {
            clientMo.post('/api/doctor/listFarmer' , {type:'push'}).then((list)=>{
                console.log(list)
                if(list) {
                    this.props.bodyDoctor.setState({body : <Push status={1} main={this.props.main} bodyDoctor={this.props.bodyDoctor} list={list}/>})
                    document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                    document.getElementById(ele).setAttribute('nav-select' , '')
                }
                else this.sessionoff()
            })
            
        }
        
    }

    render() {
        return(
            <nav className="nav-menu">
                <a onClick={e => this.selectMenu(e , 'account')} className="list-menu-nav" id="account" title="บัญชี" href="list" >
                    <bot-bt-nav>
                        <bot-gap-nav-icon>
                            <img src="/people-svgrepo-com.svg"></img>
                        </bot-gap-nav-icon>
                        <bot-gap-string>
                            <bot-string>บัญชี</bot-string>
                            <bot-string>เกษตรกร</bot-string>    
                        </bot-gap-string>
                    </bot-bt-nav>
                </a>
                <a onClick={e => this.selectMenu(e , 'pAccount')} className="list-menu-nav" id="pAccount" title="เพิ่มบัญชี" href="plus">
                    <bot-bt-nav>
                        <bot-gap-nav-icon>
                            <img src="/plus-user-svgrepo-com.svg"></img>
                        </bot-gap-nav-icon>
                        <bot-gap-string>
                            <bot-string>เกษตรกร</bot-string>
                            <bot-string>ลงทะเบียน</bot-string>    
                        </bot-gap-string>
                    </bot-bt-nav>
                </a>
                <a onClick={e => this.selectMenu(e , 'formSaveFm')} className="list-menu-nav" id="pAccount" title="เพิ่มบัญชี" href="plus">
                    <bot-bt-nav>
                        <bot-gap-nav-icon>
                            <img src="/plus-user-svgrepo-com.svg"></img>
                        </bot-gap-nav-icon>
                        <bot-gap-string>
                            <bot-string>Export</bot-string>
                            <bot-string>ข้อมูล</bot-string>    
                        </bot-gap-string>
                    </bot-bt-nav>
                </a>
            </nav>
        )
    }
}