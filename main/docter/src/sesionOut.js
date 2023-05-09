import React , {Component} from "react";
import Login from "./Login";

import { clientMo } from "../../../src/assets/js/moduleClient";

export default class SessionOut extends Component {

    Logout = (e) => {
        window.location.href = '/admin'
    }

    render(){
        return(
            <form id="session-out" onSubmit={this.Logout}>
                <div>เซสชั่นหมดอายุ</div>
                <button className="bt-submit-form">ตกลง</button>
            </form>
        )
    }
}