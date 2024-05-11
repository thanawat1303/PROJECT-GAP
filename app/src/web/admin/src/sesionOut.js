import React, { useContext, useEffect } from "react";
import { AdminProvider } from "./main";

import Locals from "../../../locals";
const SessionOut = ({setBodyFileMain , sessionEle}) => {

    const { lg } = useContext(AdminProvider)
    const Logout = (e) => {
        e.preventDefault()
        window.location.href = '/admin'
    }

    useEffect(()=>{
        sessionEle.current.setAttribute('show' , '')
    })

    return(
        <form id="session-out" onSubmit={Logout}>
            <div>{Locals[lg]["session"]}</div>
            <button className="bt-submit-form">{Locals[lg]["ok"]}</button>
        </form>
    )

}

export default SessionOut