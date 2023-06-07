import React, { useEffect } from "react";

const SessionOut = ({setBodyFileMain , sessionEle}) => {

    const Logout = (e) => {
        e.preventDefault()
        window.location.href = '/admin'
    }

    useEffect(()=>{
        sessionEle.setAttribute('show' , '')
    })

    return(
        <form id="session-out" onSubmit={Logout}>
            <div>เซสชั่นหมดอายุ</div>
            <button className="bt-submit-form">ตกลง</button>
        </form>
    )

}

export default SessionOut