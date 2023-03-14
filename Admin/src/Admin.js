import React , {Component} from "react";
import { clientMo } from "./assets/js/moduleClient";
import Login from "./Login";

export default class Admin extends Component {

    Logout = () => {
        clientMo.rmAction('#loading' , 'hide' , 0)
        setTimeout(()=>{
            clientMo.get('logout').then(()=>{
                this.props.main.setState({
                    body : <Login main={this.props.main}/>
                })
                clientMo.addAction('#loading' , 'hide' , 1500)
            })
        } , 1500)
    }

    render() {
        return (
            <>
                <section>
                    <button onClick={this.Logout}>LOGOUT</button>
                </section>
            </>
        )
    }
}