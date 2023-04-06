import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";

export default class NavAdmin extends Component {
    render() {
        return(
            <nav className="nav-menu">
                <a className="list-menu">
                    <p>เพิ่มบัญชี<br></br>เจ้าหน้าที่ส่งเสริม</p>
                </a>
                <a className="list-menu">
                    <p>บัญชี<br></br>เจ้าหน้าที่ส่งเสริม</p>
                </a>
            </nav>
        )
    }
}