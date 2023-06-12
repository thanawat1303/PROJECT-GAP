import React, { useEffect } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";

const ShowBecause = ({RefOnPage , id_table , type}) => {
    useEffect(()=>{
        RefOnPage.current.style.opacity = "1"
        RefOnPage.current.style.visibility = "visible"
    })

    const FetchData = async () => {
        const data = await clientMo.post("")
    }
}