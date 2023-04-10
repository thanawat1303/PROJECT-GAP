import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";

import List from "./listDocter";
import Plus from "./plusDocter";

export default class NavAdmin extends Component {

    componentDidMount() {
        this.checkPath()
        window.addEventListener('popstate' , this.changePage)
    }

    componentWillUnmount() {
        window.removeEventListener('popstate' , this.changePage)
    }

    changePage = () => {
        this.checkPath(2)
    }

    checkPath = (statusLoad = 0) =>{
        clientMo.post('/check').then((context)=>{
            if(context) {
                let ele = ''
                if(window.location.pathname == '/list' || window.location.pathname == '/')
                {
                    this.props.bodyAdmin.setState({body : <List status={statusLoad}/>})
                    ele = 'account'
                }
                else if (window.location.pathname == '/plus')
                {
                    this.props.bodyAdmin.setState({body : <Plus status={statusLoad}/>})
                    ele = 'pAccount'
                }

                if(document.querySelector('a[nav-select=""]')) document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                document.getElementById(ele).setAttribute('nav-select' , '')
            }
            
            else 
                this.setState({
                    body : <Login main={this}/>
                })
        })
    }

    selectMenu = (e) => {
        e.preventDefault() 
        let ele = e.target
        while(ele.tagName != 'A') ele = ele.parentElement

        ele = ele.id

        clientMo.post('/check').then((context)=>{
            if(context) {
                if(ele == 'account') this.props.bodyAdmin.setState({body : <List status={1}/>})
                else if (ele == 'pAccount') this.props.bodyAdmin.setState({body : <Plus status={1}/>})
                document.querySelector('a[nav-select=""]').removeAttribute('nav-select')
                document.getElementById(ele).setAttribute('nav-select' , '')
            }
            
            else 
                this.setState({
                    body : <Login main={this}/>
                })
        })
        
    }

    render() {
        return(
            <nav className="nav-menu">
                <a onClick={this.selectMenu} className="list-menu-nav" id="account" title="บัญชี" href="list" >
                    <bot-bt-nav>
                        <bot-gap-nav-icon>
                            <img src="people-svgrepo-com.svg"></img>
                        </bot-gap-nav-icon>
                        <bot-gap-string>บัญชี<br></br>เจ้าหน้าที่ส่งเสริม</bot-gap-string>
                    </bot-bt-nav>
                </a>
                <a onClick={this.selectMenu} className="list-menu-nav" id="pAccount" title="เพิ่มบัญชี" href="plus">
                    <bot-bt-nav>
                        <bot-gap-nav-icon>
                            <img src="plus-user-svgrepo-com.svg"></img>
                        </bot-gap-nav-icon>
                        <bot-gap-string>เพิ่มบัญชี<br></br>เจ้าหน้าที่ส่งเสริม</bot-gap-string>
                    </bot-bt-nav>
                </a>
            </nav>
        )
    }
}