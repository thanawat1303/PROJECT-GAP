import React, { useEffect } from "react";
import { clientMo } from "../../src/assets/js/moduleClient";

const ErrorPage = ({text}) => {
    useEffect(()=>{
        clientMo.unLoadingPage()
    })
    return(
        <>{text}</>
    )
}

export default ErrorPage