import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";

import List from "./listDocter";
import Plus from "./plusDocter";
import Login from "./Login";
import SessionOut from "./sesionOut";

export default class NavAdmin extends Component {

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
        if(path[1] == 'list' || path[1] == '')
        {
            clientMo.post('/admin/listDocter').then((list)=>{
                if(list) {
                    this.props.bodyAdmin.setState({body : <List status={statusLoad} main={this.props.main} bodyAdmin={this.props.bodyAdmin} list={list}/>})
                    if(document.querySelector('a[nav-select=""]')) document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                    document.getElementById('account').setAttribute('nav-select' , '')
                } else this.sessionoff(true)

            })
        }
        else if (path[1] == 'plus')
        {
            clientMo.post('/admin/check').then((context)=>{
                if(context) {
                    this.props.bodyAdmin.setState({body : <Plus status={statusLoad} main={this.props.main} bodyAdmin={this.props.bodyAdmin}/>})
                    if(document.querySelector('a[nav-select=""]')) document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                    document.getElementById('pAccount').setAttribute('nav-select' , '')
                }
                
                else this.sessionoff(true)
                    
            })
        }
    }

    sessionoff = (type = false) => {
        if(type) {
            this.props.main.setState({
                body : <Login main={this.props.main} state={true}/>
            })
        } else {
            this.props.bodyAdmin.setState({
                session : <SessionOut main={this.props.main}/>
            })
    
            document.getElementById('session').setAttribute('show' , '')
        }
    } 

    selectMenu = (e) => {
        e.preventDefault() 
        let ele = e.target
        while(ele.tagName != 'A') ele = ele.parentElement

        ele = ele.id

        if(ele == 'account') {
            clientMo.post('/admin/listDocter').then((list)=>{
                if(list) {
                    this.props.bodyAdmin.setState({body : <List status={1} main={this.props.main} bodyAdmin={this.props.bodyAdmin} list={list}/>})
                    document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                    document.getElementById(ele).setAttribute('nav-select' , '')
                } else this.sessionoff()
            })
        }
        else if (ele == 'pAccount') {
            clientMo.post('/admin/check').then((context)=>{
                if(context) {
                    this.props.bodyAdmin.setState({body : <Plus status={1} main={this.props.main} bodyAdmin={this.props.bodyAdmin}/>})
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
                <a onClick={this.selectMenu} className="list-menu-nav" id="account" title="บัญชี" href="list" >
                    <bot-bt-nav>
                        <bot-gap-nav-icon>
                            <img src="/people-svgrepo-com.svg"></img>
                        </bot-gap-nav-icon>
                        <bot-gap-string>
                            <bot-string>บัญชี</bot-string>
                            <bot-string>เจ้าหน้าที่ส่งเสริม</bot-string>    
                        </bot-gap-string>
                    </bot-bt-nav>
                </a>
                <a onClick={this.selectMenu} className="list-menu-nav" id="pAccount" title="เพิ่มบัญชี" href="plus">
                    <bot-bt-nav>
                        <bot-gap-nav-icon>
                            <img src="/plus-user-svgrepo-com.svg"></img>
                        </bot-gap-nav-icon>
                        <bot-gap-string>
                            <bot-string>เพิ่มบัญชี</bot-string>
                            <bot-string>เจ้าหน้าที่ส่งเสริม</bot-string>    
                        </bot-gap-string>
                    </bot-bt-nav>
                </a>
            </nav>
        )
    }
}