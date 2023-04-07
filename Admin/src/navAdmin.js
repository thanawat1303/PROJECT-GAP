import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";

export default class NavAdmin extends Component {

    selectMenu = (e) => {
        let ID = 
            (e.target.tagName != 'A') //check round 1
            ? 
                (e.target.parentElement.tagName != 'A') //check round 2
                ? e.target.parentElement.parentElement.id 
                : e.target.parentElement.id
            : ID = e.target.id

        // get menu
        console.log(ID)
    }

    render() {
        return(
            <nav className="nav-menu">
                <a onClick={this.selectMenu} className="list-menu-nav" id="account">
                    <bot-gap-nav-icon>
                        <img src="people-svgrepo-com.svg"></img>
                    </bot-gap-nav-icon>
                    <bot-gap-string>บัญชี<br></br>เจ้าหน้าที่ส่งเสริม</bot-gap-string>
                </a>
                <a onClick={this.selectMenu} className="list-menu-nav" id="pAccount">
                    <bot-gap-nav-icon>
                        <img src="plus-user-svgrepo-com.svg"></img>
                    </bot-gap-nav-icon>
                    <bot-gap-string>เพิ่มบัญชี<br></br>เจ้าหน้าที่ส่งเสริม</bot-gap-string>
                </a>
            </nav>
        )
    }
}