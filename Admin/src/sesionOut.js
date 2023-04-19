import React , {Component} from "react";
import Login from "./Login";

import { clientMo } from "./assets/js/moduleClient";

export default class SessionOut extends Component {

    Logout = (e) => {
        e.preventDefault()
        window.location.href = '/'
        // clientMo.rmAction('#loading' , 'hide' , 0)
        // setTimeout(()=>{
        //     clientMo.get('/admin/logout').then(()=>{
        //         this.props.main.setState({
        //             body : <Login main={this.props.main} state={true}/>
        //         })
        //         clientMo.addAction('#loading' , 'hide' , 1500)
        //     })
        // } , 1500)
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