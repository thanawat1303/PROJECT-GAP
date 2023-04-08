import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";

export default class NavAdmin extends Component {

    selectMenu = (e) => {
        e.preventDefault() 
        let ele = e.target
        while(ele.tagName != 'A') ele = ele.parentElement

        ele = ele.id

        clientMo.post('/check').then((context)=>{
            if(context) {
                if(ele == 'account') this.props.bodyAdmin.setState({body : <div>list</div>})
                else if (ele == 'pAccount') this.props.bodyAdmin.setState({body : <div>Plus</div>})
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
                <a onClick={this.selectMenu} className="list-menu-nav" id="account" title="บัญชี" href="list" nav-select="">
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