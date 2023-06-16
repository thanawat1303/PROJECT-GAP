import React, { useEffect } from "react";

const ErrorPage = ({text}) => {
    useEffect(()=>{
        clientMo.unLoadingPage()
    })
    return(
        <>{text}</>
    )
}

export default ErrorPage