import React , {Component, useContext} from "react";
import { DoctorProvider } from "./main"
import Locals from "../../../locals";

const SessionOut = () => {
    const { lg } = useContext(DoctorProvider)
    const Logout = (e) => {
        e.preventDefault()
        window.location.href = '/doctor'
    }

    return(
        <form id="session-out" onSubmit={Logout}>
            <div>{Locals[lg]["session"]}</div>
            <button type="submit" className="bt-submit-form">{Locals[lg]["ok"]}</button>
        </form>
    )
}

export default SessionOut

// export default class SessionOut extends Component {

//     Logout = (e) => {
//         e.preventDefault()
//         window.location.href = '/doctor'
//     }

//     render(){
//         return(
//             <form id="session-out" onSubmit={this.Logout}>
//                 <div>เซสชั่นหมดอายุ</div>
//                 <button type="submit" className="bt-submit-form">ตกลง</button>
//             </form>
//         )
//     }
// }