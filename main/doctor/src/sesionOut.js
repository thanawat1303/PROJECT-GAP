import React , {Component} from "react";

export default class SessionOut extends Component {

    Logout = (e) => {
        e.preventDefault()
        window.location.href = '/doctor'
    }

    render(){
        return(
            <form id="session-out" onSubmit={this.Logout}>
                <div>เซสชั่นหมดอายุ</div>
                <button type="submit" className="bt-submit-form">ตกลง</button>
            </form>
        )
    }
}